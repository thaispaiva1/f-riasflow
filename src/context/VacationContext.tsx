import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, VacationRequest, ApprovalHistoryItem, Role } from '../types';
import { INITIAL_USERS, INITIAL_REQUESTS } from '../lib/mockData';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  getSupabaseClient,
  resetSupabaseClient,
  testSupabaseConnection
} from '../lib/supabase';
import confetti from 'canvas-confetti';

interface VacationContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  loginAsUser: (user: UserProfile) => void;
  logout: () => void;
  users: UserProfile[];
  requests: VacationRequest[];
  activeTab: 'dashboard' | 'calendar' | 'employees' | 'supabase_guide';
  setActiveTab: (tab: 'dashboard' | 'calendar' | 'employees' | 'supabase_guide') => void;
  selectedRequest: VacationRequest | null;
  setSelectedRequest: (req: VacationRequest | null) => void;
  isNewRequestModalOpen: boolean;
  setIsNewRequestModalOpen: (open: boolean) => void;
  isNoticeModalOpen: boolean;
  setIsNoticeModalOpen: (open: boolean) => void;
  noticeRequest: VacationRequest | null;
  setNoticeRequest: (req: VacationRequest | null) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  supabaseConfig: {
    url: string;
    anonKey: string;
    isConnected: boolean;
    isChecking: boolean;
    lastMessage: string | null;
  };
  createVacationRequest: (data: {
    dataInicio: string;
    dataFim: string;
    diasTotais: number;
    venderAbono: boolean;
    diasAbono: number;
    adiantamentoDecimoTerceiro: boolean;
    motivoOuObs?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  approveRequestByManager: (requestId: string, observacao?: string) => Promise<void>;
  rejectRequestByManager: (requestId: string, motivo: string) => Promise<void>;
  approveRequestByRH: (requestId: string, observacao?: string) => Promise<void>;
  rejectRequestByRH: (requestId: string, motivo: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  updateSupabaseCredentials: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
  resetToDemoData: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  getTeamRequests: () => VacationRequest[];
  getPendingManagerCount: () => number;
  getPendingRHCount: () => number;
}

const VacationContext = createContext<VacationContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS = 'feriasflow_users_v2';
const LOCAL_STORAGE_REQUESTS = 'feriasflow_requests_v2';
const LOCAL_STORAGE_ACTIVE_USER = 'feriasflow_active_user_id_v2';
const LOCAL_STORAGE_IS_LOGGED_IN = 'feriasflow_is_logged_in_v2';

export const VacationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [requests, setRequests] = useState<VacationRequest[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REQUESTS);
      return stored ? JSON.parse(stored) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    try {
      const activeId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER);
      const found = users.find(u => u.id === activeId);
      return found || users[0] || INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_IS_LOGGED_IN);
      return storedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'employees' | 'supabase_guide'>('dashboard');
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeRequest, setNoticeRequest] = useState<VacationRequest | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: '',
    isConnected: false,
    isChecking: false,
    lastMessage: null as string | null
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Erro ao salvar usuários no localStorage:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.warn('Erro ao salvar solicitações no localStorage:', e);
    }
  }, [requests]);

  const setCurrentUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, user.id);
    showToast(`Perfil alterado para: ${user.nome} (${user.role.toUpperCase()})`, 'info');
  }, [showToast]);

  const login = useCallback((email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, error: 'Usuário não encontrado. Verifique o e-mail digitado.' };
    }

    if (!password || password.trim().length === 0) {
      return { success: false, error: 'Informe a senha de acesso.' };
    }

    // Senhas válidas: '123456' ou senhas baseadas no primeiro nome em minúsculo ('ana123', 'carlos123', 'mariana123', etc.)
    const validPasswords = ['123456', `${foundUser.nome.split(' ')[0].toLowerCase()}123`];
    if (!validPasswords.includes(password.trim())) {
      return { success: false, error: 'Senha incorreta. A senha padrão do sistema é 123456.' };
    }

    setCurrentUserState(foundUser);
    setIsAuthenticated(true);
    if (foundUser.role === 'funcionario') {
      setActiveTab('dashboard');
    }
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, foundUser.id);
    localStorage.setItem(LOCAL_STORAGE_IS_LOGGED_IN, 'true');
    showToast(`Bem-vindo(a), ${foundUser.nome}!`, 'success');
    return { success: true };
  }, [users, showToast]);

  const loginAsUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user);
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, user.id);
    localStorage.setItem(LOCAL_STORAGE_IS_LOGGED_IN, 'true');
    showToast(`Acesso concedido: ${user.nome} (${user.role.toUpperCase()})`, 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_IS_LOGGED_IN);
    showToast('Você saiu da sua conta.', 'info');
  }, [showToast]);

  // Check Supabase connection on mount
  useEffect(() => {
    const config = getStoredSupabaseConfig();
    setSupabaseConfig(prev => ({
      ...prev,
      url: config.url,
      anonKey: config.anonKey
    }));

    if (config.url && config.anonKey) {
      checkSupabase(config.url, config.anonKey);
    }
  }, []);

  const checkSupabase = async (url: string, anonKey: string) => {
    setSupabaseConfig(prev => ({ ...prev, isChecking: true }));
    const result = await testSupabaseConnection(url, anonKey);
    setSupabaseConfig(prev => ({
      ...prev,
      url,
      anonKey,
      isConnected: result.success,
      isChecking: false,
      lastMessage: result.message
    }));

    if (result.success) {
      fetchFromSupabase();
    }
  };

  const fetchFromSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { data: remoteUsers, error: usersErr } = await client.from('perfis').select('*');
      if (!usersErr && remoteUsers && remoteUsers.length > 0) {
        // Map snake_case to camelCase
        const mappedUsers: UserProfile[] = remoteUsers.map(u => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          cargo: u.cargo,
          departamento: u.departamento,
          role: u.role,
          gerenteId: u.gerente_id,
          dataAdmissao: u.data_admissao,
          diasSaldoTotal: u.dias_saldo_total,
          diasSaldoRestante: u.dias_saldo_restante,
          diasGozados: u.dias_gozados,
          diasAgendados: u.dias_agendados,
          periodoAquisitivoInicio: u.periodo_aquisitivo_inicio,
          periodoAquisitivoFim: u.periodo_aquisitivo_fim,
          limiteConcessivo: u.limite_concessivo,
          salarioBase: Number(u.salario_base || 4000),
          fotoUrl: u.foto_url
        }));
        setUsers(mappedUsers);
      }

      const { data: remoteRequests, error: reqErr } = await client.from('solicitacoes_ferias').select('*');
      if (!reqErr && remoteRequests) {
        const mappedReqs: VacationRequest[] = remoteRequests.map(r => ({
          id: r.id,
          funcionarioId: r.funcionario_id,
          funcionarioNome: r.funcionario_nome || '',
          funcionarioCargo: r.funcionario_cargo || '',
          departamento: r.departamento || '',
          gerenteId: r.gerente_id,
          gerenteNome: r.gerente_nome || '',
          dataInicio: r.data_inicio,
          dataFim: r.data_fim,
          diasTotais: r.dias_totais,
          venderAbono: r.vender_abono,
          diasAbono: r.dias_abono,
          adiantamentoDecimoTerceiro: r.adiantamento_decimo_terceiro,
          motivoOuObs: r.motivo_ou_obs,
          status: r.status,
          observacaoGerente: r.observacao_gerente,
          observacaoRH: r.observacao_rh,
          dataAprovacaoGerente: r.data_aprovacao_gerente,
          dataAprovacaoRH: r.data_aprovacao_rh,
          criadoEm: r.criado_em,
          atualizadoEm: r.atualizado_em
        }));
        if (mappedReqs.length > 0) {
          setRequests(mappedReqs);
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar dados do Supabase:', err);
    }
  };

  const updateSupabaseCredentials = async (url: string, anonKey: string) => {
    setSupabaseConfig(prev => ({ ...prev, isChecking: true }));
    saveStoredSupabaseConfig(url, anonKey);
    resetSupabaseClient();
    
    const result = await testSupabaseConnection(url, anonKey);
    setSupabaseConfig({
      url,
      anonKey,
      isConnected: result.success,
      isChecking: false,
      lastMessage: result.message
    });

    if (result.success) {
      showToast('Conectado ao Supabase com sucesso!', 'success');
      fetchFromSupabase();
    } else {
      showToast(result.message, 'error');
    }

    return result;
  };

  const resetToDemoData = () => {
    setUsers(INITIAL_USERS);
    setRequests(INITIAL_REQUESTS);
    setCurrentUserState(INITIAL_USERS[0]);
    localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(LOCAL_STORAGE_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, INITIAL_USERS[0].id);
    showToast('Dados de demonstração restaurados com sucesso!', 'info');
  };

  // Helper counters
  const getTeamRequests = useCallback(() => {
    if (currentUser.role === 'gerente') {
      // Find subordinates whose gerenteId is currentUser.id
      const subIds = users.filter(u => u.gerenteId === currentUser.id).map(u => u.id);
      return requests.filter(r => subIds.includes(r.funcionarioId) || r.gerenteId === currentUser.id);
    }
    if (currentUser.role === 'rh') {
      return requests;
    }
    return requests.filter(r => r.funcionarioId === currentUser.id);
  }, [currentUser, users, requests]);

  const getPendingManagerCount = useCallback(() => {
    if (currentUser.role === 'gerente') {
      const subIds = users.filter(u => u.gerenteId === currentUser.id).map(u => u.id);
      return requests.filter(r => (subIds.includes(r.funcionarioId) || r.gerenteId === currentUser.id) && r.status === 'pendente_gerente').length;
    }
    return requests.filter(r => r.status === 'pendente_gerente').length;
  }, [currentUser, users, requests]);

  const getPendingRHCount = useCallback(() => {
    return requests.filter(r => r.status === 'pendente_rh').length;
  }, [requests]);

  // Create Vacation Request
  const createVacationRequest = async (data: {
    dataInicio: string;
    dataFim: string;
    diasTotais: number;
    venderAbono: boolean;
    diasAbono: number;
    adiantamentoDecimoTerceiro: boolean;
    motivoOuObs?: string;
  }) => {
    const managerId = currentUser.gerenteId || users.find(u => u.role === 'gerente')?.id || 'gerente-fallback';
    const manager = users.find(u => u.id === managerId);
    const managerName = manager?.nome || currentUser.gerenteNome || 'Gestor Responsável';

    const newReqId = 'req-' + Date.now();
    const nowIso = new Date().toISOString();

    const historyItem: ApprovalHistoryItem = {
      id: 'hist-' + Date.now(),
      solicitacaoId: newReqId,
      autorId: currentUser.id,
      autorNome: currentUser.nome,
      autorRole: currentUser.role,
      acao: 'criada',
      observacao: data.motivoOuObs || 'Solicitação inicial registrada pelo funcionário.',
      criadoEm: nowIso
    };

    const newRequest: VacationRequest = {
      id: newReqId,
      funcionarioId: currentUser.id,
      funcionarioNome: currentUser.nome,
      funcionarioCargo: currentUser.cargo,
      departamento: currentUser.departamento,
      gerenteId: managerId,
      gerenteNome: managerName,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      diasTotais: data.diasTotais,
      venderAbono: data.venderAbono,
      diasAbono: data.diasAbono,
      adiantamentoDecimoTerceiro: data.adiantamentoDecimoTerceiro,
      motivoOuObs: data.motivoOuObs,
      status: 'pendente_gerente',
      criadoEm: nowIso,
      atualizadoEm: nowIso,
      historico: [historyItem]
    };

    // Update state
    setRequests(prev => [newRequest, ...prev]);

    // Update employee diasAgendados
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          diasAgendados: u.diasAgendados + data.diasTotais + (data.venderAbono ? data.diasAbono : 0)
        };
      }
      return u;
    }));

    // Sync to Supabase if connected
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConnected) {
      try {
        await client.from('solicitacoes_ferias').insert({
          funcionario_id: currentUser.id,
          gerente_id: managerId,
          data_inicio: data.dataInicio,
          data_fim: data.dataFim,
          dias_totais: data.diasTotais,
          vender_abono: data.venderAbono,
          dias_abono: data.diasAbono,
          adiantamento_decimo_terceiro: data.adiantamentoDecimoTerceiro,
          motivo_ou_obs: data.motivoOuObs,
          status: 'pendente_gerente'
        });
      } catch (err) {
        console.warn('Erro ao inserir solicitação no Supabase:', err);
      }
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    showToast('Solicitação de férias enviada com sucesso ao Gerente!', 'success');
    return { success: true };
  };

  // Manager Approval: passes to RH
  const approveRequestByManager = async (requestId: string, observacao?: string) => {
    const nowIso = new Date().toISOString();
    
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const hist: ApprovalHistoryItem = {
          id: 'hist-' + Date.now(),
          solicitacaoId: requestId,
          autorId: currentUser.id,
          autorNome: currentUser.nome,
          autorRole: 'gerente',
          acao: 'aprovada_gerente',
          observacao: observacao || 'Aprovado pelo gestor imediato.',
          criadoEm: nowIso
        };
        return {
          ...r,
          status: 'pendente_rh',
          observacaoGerente: observacao || 'Aprovado pelo gestor.',
          dataAprovacaoGerente: nowIso,
          atualizadoEm: nowIso,
          historico: [...(r.historico || []), hist]
        };
      }
      return r;
    }));

    // Update selected if open
    setSelectedRequest(prev => {
      if (prev && prev.id === requestId) {
        return {
          ...prev,
          status: 'pendente_rh',
          observacaoGerente: observacao || 'Aprovado pelo gestor.',
          dataAprovacaoGerente: nowIso,
          atualizadoEm: nowIso
        };
      }
      return prev;
    });

    // Supabase update
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConnected) {
      try {
        await client.from('solicitacoes_ferias').update({
          status: 'pendente_rh',
          observacao_gerente: observacao,
          data_aprovacao_gerente: nowIso,
          atualizado_em: nowIso
        }).eq('id', requestId);
      } catch (e) {
        console.warn('Supabase update error:', e);
      }
    }

    showToast('Férias aprovadas pelo Gerente! Encaminhadas para homologação final do RH.', 'success');
  };

  // Manager Rejection
  const rejectRequestByManager = async (requestId: string, motivo: string) => {
    const nowIso = new Date().toISOString();
    const req = requests.find(r => r.id === requestId);

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const hist: ApprovalHistoryItem = {
          id: 'hist-' + Date.now(),
          solicitacaoId: requestId,
          autorId: currentUser.id,
          autorNome: currentUser.nome,
          autorRole: 'gerente',
          acao: 'reprovada_gerente',
          observacao: motivo,
          criadoEm: nowIso
        };
        return {
          ...r,
          status: 'reprovado_gerente',
          observacaoGerente: motivo,
          atualizadoEm: nowIso,
          historico: [...(r.historico || []), hist]
        };
      }
      return r;
    }));

    // Restore diasAgendados
    if (req) {
      const diasToRestore = req.diasTotais + (req.venderAbono ? req.diasAbono : 0);
      setUsers(prev => prev.map(u => {
        if (u.id === req.funcionarioId) {
          return {
            ...u,
            diasAgendados: Math.max(0, u.diasAgendados - diasToRestore)
          };
        }
        return u;
      }));
    }

    setSelectedRequest(null);
    showToast('Solicitação reprovada pelo Gerente.', 'info');
  };

  // RH Final Approval: deduction of days and final confirmation
  const approveRequestByRH = async (requestId: string, observacao?: string) => {
    const nowIso = new Date().toISOString();
    const targetReq = requests.find(r => r.id === requestId);

    if (!targetReq) return;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const hist: ApprovalHistoryItem = {
          id: 'hist-' + Date.now(),
          solicitacaoId: requestId,
          autorId: currentUser.id,
          autorNome: currentUser.nome,
          autorRole: 'rh',
          acao: 'aprovada_rh',
          observacao: observacao || 'Homologado pelo RH corporativo. Aviso formal emitido.',
          criadoEm: nowIso
        };
        return {
          ...r,
          status: 'aprovado',
          observacaoRH: observacao || 'Homologado pelo RH.',
          dataAprovacaoRH: nowIso,
          atualizadoEm: nowIso,
          historico: [...(r.historico || []), hist]
        };
      }
      return r;
    }));

    // Deduct employee balance
    const totalDeduction = targetReq.diasTotais + (targetReq.venderAbono ? targetReq.diasAbono : 0);
    setUsers(prev => prev.map(u => {
      if (u.id === targetReq.funcionarioId) {
        return {
          ...u,
          diasSaldoRestante: Math.max(0, u.diasSaldoRestante - totalDeduction),
          diasGozados: u.diasGozados + targetReq.diasTotais,
          diasAgendados: Math.max(0, u.diasAgendados - totalDeduction)
        };
      }
      return u;
    }));

    setSelectedRequest(prev => {
      if (prev && prev.id === requestId) {
        return {
          ...prev,
          status: 'aprovado',
          observacaoRH: observacao || 'Homologado pelo RH.',
          dataAprovacaoRH: nowIso,
          atualizadoEm: nowIso
        };
      }
      return prev;
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast('Férias homologadas e confirmadas pelo RH com sucesso!', 'success');
  };

  // RH Rejection
  const rejectRequestByRH = async (requestId: string, motivo: string) => {
    const nowIso = new Date().toISOString();
    const req = requests.find(r => r.id === requestId);

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const hist: ApprovalHistoryItem = {
          id: 'hist-' + Date.now(),
          solicitacaoId: requestId,
          autorId: currentUser.id,
          autorNome: currentUser.nome,
          autorRole: 'rh',
          acao: 'reprovada_rh',
          observacao: motivo,
          criadoEm: nowIso
        };
        return {
          ...r,
          status: 'reprovado_rh',
          observacaoRH: motivo,
          atualizadoEm: nowIso,
          historico: [...(r.historico || []), hist]
        };
      }
      return r;
    }));

    // Restore diasAgendados
    if (req) {
      const diasToRestore = req.diasTotais + (req.venderAbono ? req.diasAbono : 0);
      setUsers(prev => prev.map(u => {
        if (u.id === req.funcionarioId) {
          return {
            ...u,
            diasAgendados: Math.max(0, u.diasAgendados - diasToRestore)
          };
        }
        return u;
      }));
    }

    setSelectedRequest(null);
    showToast('Solicitação reprovada pelo RH.', 'info');
  };

  // Cancel Request by employee
  const cancelRequest = async (requestId: string) => {
    const nowIso = new Date().toISOString();
    const req = requests.find(r => r.id === requestId);

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const hist: ApprovalHistoryItem = {
          id: 'hist-' + Date.now(),
          solicitacaoId: requestId,
          autorId: currentUser.id,
          autorNome: currentUser.nome,
          autorRole: currentUser.role,
          acao: 'cancelada',
          observacao: 'Cancelada pelo solicitante.',
          criadoEm: nowIso
        };
        return {
          ...r,
          status: 'cancelado',
          atualizadoEm: nowIso,
          historico: [...(r.historico || []), hist]
        };
      }
      return r;
    }));

    if (req && req.status !== 'aprovado') {
      const diasToRestore = req.diasTotais + (req.venderAbono ? req.diasAbono : 0);
      setUsers(prev => prev.map(u => {
        if (u.id === req.funcionarioId) {
          return {
            ...u,
            diasAgendados: Math.max(0, u.diasAgendados - diasToRestore)
          };
        }
        return u;
      }));
    }

    setSelectedRequest(null);
    showToast('Solicitação de férias cancelada com sucesso.', 'info');
  };

  return (
    <VacationContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        loginAsUser,
        logout,
        users,
        requests,
        activeTab,
        setActiveTab,
        selectedRequest,
        setSelectedRequest,
        isNewRequestModalOpen,
        setIsNewRequestModalOpen,
        isNoticeModalOpen,
        setIsNoticeModalOpen,
        noticeRequest,
        setNoticeRequest,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        supabaseConfig,
        createVacationRequest,
        approveRequestByManager,
        rejectRequestByManager,
        approveRequestByRH,
        rejectRequestByRH,
        cancelRequest,
        updateSupabaseCredentials,
        resetToDemoData,
        toast,
        showToast,
        hideToast,
        getTeamRequests,
        getPendingManagerCount,
        getPendingRHCount
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

export const useVacation = () => {
  const context = useContext(VacationContext);
  if (!context) {
    throw new Error('useVacation must be used within a VacationProvider');
  }
  return context;
};
