export type Role = 'rh' | 'gerente' | 'funcionario';

export type RequestStatus = 
  | 'pendente_gerente' 
  | 'pendente_rh' 
  | 'aprovado' 
  | 'reprovado_gerente' 
  | 'reprovado_rh' 
  | 'cancelado';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  role: Role;
  gerenteId?: string; // ID of the manager
  gerenteNome?: string;
  fotoUrl?: string;
  dataAdmissao: string;
  diasSaldoTotal: number;
  diasSaldoRestante: number;
  diasGozados: number;
  diasAgendados: number;
  periodoAquisitivoInicio: string;
  periodoAquisitivoFim: string;
  limiteConcessivo: string; // date limit before double vacation penalty
  salarioBase: number;
}

export interface ApprovalHistoryItem {
  id: string;
  solicitacaoId: string;
  autorId: string;
  autorNome: string;
  autorRole: Role;
  acao: 'criada' | 'aprovada_gerente' | 'reprovada_gerente' | 'aprovada_rh' | 'reprovada_rh' | 'cancelada';
  observacao?: string;
  criadoEm: string;
}

export interface VacationRequest {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  funcionarioCargo: string;
  departamento: string;
  gerenteId: string;
  gerenteNome: string;
  dataInicio: string;
  dataFim: string;
  diasTotais: number;
  venderAbono: boolean; // Abono pecuniário (vender 10 dias)
  diasAbono: number; // usually 10 if venderAbono is true
  adiantamentoDecimoTerceiro: boolean; // Adiantamento 13º salário
  motivoOuObs?: string;
  status: RequestStatus;
  observacaoGerente?: string;
  observacaoRH?: string;
  dataAprovacaoGerente?: string;
  dataAprovacaoRH?: string;
  criadoEm: string;
  atualizadoEm: string;
  historico?: ApprovalHistoryItem[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastChecked?: string;
}

export interface DepartmentSummary {
  nome: string;
  totalColaboradores: number;
  emFeriasAgora: number;
  solicitacoesPendentes: number;
}
