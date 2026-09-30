import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  CalendarDays, 
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  Send,
  Check
} from 'lucide-react';
import { formatDateBr } from '../lib/mockData';
import { VacationRequest } from '../types';

export const ManagerDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    requests, 
    approveRequestByManager, 
    rejectRequestByManager, 
    setSelectedRequest,
    setActiveTab,
    showToast 
  } = useVacation();

  const [commentInput, setCommentInput] = useState<{ [id: string]: string }>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Team members under this manager
  const teamMembers = users.filter(u => u.gerenteId === currentUser.id);
  const teamMemberIds = teamMembers.map(u => u.id);

  // Requests under this manager
  const teamRequests = requests.filter(r => teamMemberIds.includes(r.funcionarioId) || r.gerenteId === currentUser.id);

  // Pending for this manager
  const pendingRequests = teamRequests.filter(r => r.status === 'pendente_gerente');

  // Currently or upcoming on vacation
  const approvedTeamRequests = teamRequests.filter(r => r.status === 'aprovado' || r.status === 'pendente_rh');

  // Check overlapping vacation dates within the same team
  const checkOverlap = (req: VacationRequest): VacationRequest[] => {
    const start = new Date(req.dataInicio).getTime();
    const end = new Date(req.dataFim).getTime();

    return teamRequests.filter(other => {
      if (other.id === req.id) return false;
      if (['reprovado_gerente', 'reprovado_rh', 'cancelado'].includes(other.status)) return false;

      const otherStart = new Date(other.dataInicio).getTime();
      const otherEnd = new Date(other.dataFim).getTime();

      return (start <= otherEnd && end >= otherStart);
    });
  };

  const handleApprove = async (req: VacationRequest) => {
    const comment = commentInput[req.id] || 'Aprovado pelo gestor. Equipe alinhada para cobertura.';
    await approveRequestByManager(req.id, comment);
    setCommentInput(prev => ({ ...prev, [req.id]: '' }));
  };

  const handleReject = async (reqId: string) => {
    if (!rejectReason.trim()) {
      showToast('Por favor, informe a justificativa da recusa.', 'error');
      return;
    }
    await rejectRequestByManager(reqId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 mb-2">
            Painel do Gestor de Equipe &bull; Nível 1 de Aprovação
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            Gestão de Equipe &mdash; {currentUser.departamento}
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Como gerente, você avalia o impacto operacional e aprova os períodos de férias da sua equipe antes do encaminhamento para homologação pelo RH.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('calendar')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Calendário da Equipe</span>
          </button>
        </div>
      </div>

      {/* Team Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aguardando Minha Aprovação</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{pendingRequests.length}</span>
            <span className="text-xs font-semibold text-slate-500">solicitações pendentes</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {pendingRequests.length === 0 ? 'Tudo em dia!' : 'Aguardando seu parecer de gestão'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Liderados Diretos</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{teamMembers.length}</span>
            <span className="text-xs font-semibold text-slate-500">colaboradores</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Departamento: <strong>{currentUser.departamento}</strong>
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Férias em Andamento/Aprovadas</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{approvedTeamRequests.length}</span>
            <span className="text-xs font-semibold text-slate-500">períodos</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Escalas programadas</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo da Equipe</span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <CalendarDays className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-900">
              {teamMembers.reduce((acc, m) => acc + m.diasSaldoRestante, 0)}
            </span>
            <span className="text-xs font-semibold text-slate-500">dias acumulados</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Total a usufruir na equipe</p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Solicitações Pendentes da Sua Equipe
            </h3>
            <p className="text-xs text-slate-500">
              Avalie as datas, cobertura operacional e aprove para encaminhar ao RH.
            </p>
          </div>
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            {pendingRequests.length} pendente(s)
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-800">Nenhuma solicitação pendente no momento!</h4>
            <p className="text-xs text-slate-500 mt-1">Todos os pedidos da sua equipe já foram analisados e encaminhados ao RH.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.map(req => {
              const overlaps = checkOverlap(req);
              const employee = users.find(u => u.id === req.funcionarioId);

              return (
                <div key={req.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    
                    {/* Employee Info */}
                    <div className="flex items-start gap-3">
                      <img 
                        src={employee?.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.funcionarioNome)}&background=3b82f6&color=fff`} 
                        alt={req.funcionarioNome} 
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{req.funcionarioNome}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            {req.funcionarioCargo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Saldo restante de férias do colaborador: <strong>{employee?.diasSaldoRestante ?? '-'} dias</strong> &bull; Período Aquisitivo: {formatDateBr(employee?.periodoAquisitivoInicio || '')} a {formatDateBr(employee?.periodoAquisitivoFim || '')}
                        </p>

                        {/* Request Period Highlight */}
                        <div className="mt-3 inline-flex flex-wrap items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{formatDateBr(req.dataInicio)} até {formatDateBr(req.dataFim)}</span>
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold text-[11px]">
                              {req.diasTotais} dias
                            </span>
                          </div>

                          {req.venderAbono && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                              Vender 10 dias (Abono)
                            </span>
                          )}

                          {req.adiantamentoDecimoTerceiro && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium">
                              Adiantamento 13º
                            </span>
                          )}
                        </div>

                        {req.motivoOuObs && (
                          <p className="mt-2 text-xs text-slate-600 italic">
                            &ldquo;{req.motivoOuObs}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(req)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprovar e Enviar ao RH</span>
                      </button>

                      <button
                        onClick={() => setRejectingId(req.id)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Recusar</span>
                      </button>

                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="text-xs text-slate-500 hover:text-slate-800 text-center py-1 cursor-pointer"
                      >
                        Ver Análise Completa
                      </button>
                    </div>

                  </div>

                  {/* Overlap / Collision Alert */}
                  {overlaps.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Alerta de Sobreposição na Equipe:</strong>
                        <span>
                          No mesmo período, {overlaps.map(o => o.funcionarioNome).join(', ')} também estará ausente ({overlaps.map(o => `${formatDateBr(o.dataInicio)} a ${formatDateBr(o.dataFim)}`).join('; ')}). Certifique-se de que haverá cobertura suficiente no departamento.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rejection Form inside card */}
                  {rejectingId === req.id && (
                    <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200 animate-in fade-in">
                      <label className="block text-xs font-semibold text-rose-900 mb-1">
                        Motivo da Recusa (obrigatório):
                      </label>
                      <textarea
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Ex: Conflito de agenda no projeto de implantação; solicitamos remarcar para novembro."
                        className="w-full p-2.5 text-xs border border-rose-300 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 resize-none"
                      />
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Confirmar Recusa
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional Manager comment input before approving */}
                  {rejectingId !== req.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Comentário do Gestor para o RH (opcional): ex: Equipe alinhada e substituto definido."
                        value={commentInput[req.id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [req.id]: e.target.value })}
                        className="text-xs w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Team Members Vacation Status Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Membros da Minha Equipe &amp; Saldos</h3>
            <p className="text-xs text-slate-500">Acompanhamento preventivo de férias a vencer</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {teamMembers.length} colaboradores liderados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Colaborador</th>
                <th className="px-5 py-3">Cargo</th>
                <th className="px-5 py-3 text-center">Saldo Restante</th>
                <th className="px-5 py-3 text-center">Dias Gozados</th>
                <th className="px-5 py-3">Período Aquisitivo</th>
                <th className="px-5 py-3">Limite p/ Gozo (CLT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img 
                      src={member.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.nome)}`} 
                      alt={member.nome}
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <span className="font-semibold text-slate-900">{member.nome}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{member.cargo}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {member.diasSaldoRestante} dias
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center text-slate-600 font-medium">
                    {member.diasGozados} dias
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {formatDateBr(member.periodoAquisitivoInicio)} - {formatDateBr(member.periodoAquisitivoFim)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">
                      {formatDateBr(member.limiteConcessivo)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
