import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  Users, 
  Download, 
  Calendar, 
  FileText, 
  Check, 
  Filter, 
  Briefcase,
  DollarSign,
  Printer
} from 'lucide-react';
import { formatDateBr, formatCurrency } from '../lib/mockData';
import { VacationRequest, UserProfile } from '../types';

export const RHDashboard: React.FC = () => {
  const { 
    users, 
    requests, 
    approveRequestByRH, 
    rejectRequestByRH, 
    setSelectedRequest,
    setNoticeRequest,
    setIsNoticeModalOpen,
    showToast 
  } = useVacation();

  const [commentInput, setCommentInput] = useState<{ [id: string]: string }>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('todos');

  // Pending RH homologation (Manager already approved)
  const pendingRH = requests.filter(r => r.status === 'pendente_rh');

  // Approved requests (already final)
  const approvedRequests = requests.filter(r => r.status === 'aprovado');

  // Vacation risk calculation (limit concession date)
  const getRiskStatus = (user: UserProfile) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(user.limiteConcessivo);
    const diffDays = Math.ceil((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (user.diasSaldoRestante <= 0) {
      return { label: 'Em Dia', color: 'bg-slate-100 text-slate-700', isCritical: false };
    }
    if (diffDays < 30) {
      return { label: `Urgente: Vence em ${diffDays}d (Risco Dobro)`, color: 'bg-rose-100 text-rose-800 border-rose-300', isCritical: true };
    }
    if (diffDays < 90) {
      return { label: `Atenção: Vence em ${diffDays}d`, color: 'bg-amber-100 text-amber-800 border-amber-300', isCritical: false };
    }
    return { label: `Normal (${diffDays}d)`, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', isCritical: false };
  };

  const handleApprove = async (req: VacationRequest) => {
    const comment = commentInput[req.id] || 'Homologado pelo RH. Aviso de férias emitido de acordo com o Art. 135 da CLT.';
    await approveRequestByRH(req.id, comment);
    setCommentInput(prev => ({ ...prev, [req.id]: '' }));
  };

  const handleReject = async (reqId: string) => {
    if (!rejectReason.trim()) {
      showToast('Por favor, informe a justificativa da recusa pelo RH.', 'error');
      return;
    }
    await rejectRequestByRH(reqId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  const exportCsv = () => {
    const header = 'Nome,Cargo,Departamento,SaldoRestante,Gozados,PeriodoInicio,PeriodoFim,LimiteConcessivo\n';
    const rows = users.map(u => 
      `"${u.nome}","${u.cargo}","${u.departamento}",${u.diasSaldoRestante},${u.diasGozados},"${u.periodoAquisitivoInicio}","${u.periodoAquisitivoFim}","${u.limiteConcessivo}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_ferias_rh_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório CSV de férias exportado com sucesso!', 'success');
  };

  const filteredUsers = departmentFilter === 'todos' 
    ? users 
    : users.filter(u => u.departamento === departmentFilter);

  const departments = Array.from(new Set(users.map(u => u.departamento)));

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 mb-2">
            Gestão Corporativa de RH &bull; Nível 2 (Homologação Final)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            Painel Geral de Recursos Humanos &amp; Departamento Pessoal
          </h2>
          <p className="text-purple-100 text-sm mt-1 max-w-2xl">
            Acompanhe a conformidade trabalhista (CLT), homologue pedidos já aprovados pelos gestores, controle o risco de férias em dobro e emita avisos legais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório (CSV)</span>
          </button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aguardando Homologação</span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700">{pendingRH.length}</span>
            <span className="text-xs font-semibold text-slate-500">aprovadas por gestores</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Prontas para despacho do RH</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Colaboradores Totais</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{users.length}</span>
            <span className="text-xs font-semibold text-slate-500">em {departments.length} setores</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Todos com controle de saldo CLT</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Férias Homologadas</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{approvedRequests.length}</span>
            <span className="text-xs font-semibold text-slate-500">concluídas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Com avisos emitidos</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Risco Férias Dobro</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">
              {users.filter(u => getRiskStatus(u).isCritical).length}
            </span>
            <span className="text-xs font-semibold text-slate-500">em alerta urgente</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Limite concessivo em &lt; 30 dias</p>
        </div>
      </div>

      {/* Pending RH Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              Fila de Homologação Final do RH
            </h3>
            <p className="text-xs text-slate-500">
              Períodos de férias já aprovados pelos Gestores que necessitam de formalização legal pelo RH.
            </p>
          </div>
          <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {pendingRH.length} para homologar
          </span>
        </div>

        {pendingRH.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-800">A fila de homologação do RH está zerada!</h4>
            <p className="text-xs text-slate-500 mt-1">Nenhuma solicitação aprovada por gerente aguardando parecer final do RH.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRH.map(req => {
              const employee = users.find(u => u.id === req.funcionarioId);

              return (
                <div key={req.id} className="bg-white rounded-xl p-5 border border-purple-200 shadow-xs hover:border-purple-300 transition-all">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    
                    <div className="flex items-start gap-3">
                      <img 
                        src={employee?.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.funcionarioNome)}&background=3b82f6&color=fff`} 
                        alt={req.funcionarioNome} 
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{req.funcionarioNome}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                            {req.departamento} &bull; {req.funcionarioCargo}
                          </span>
                        </div>

                        {/* Request Period Highlight */}
                        <div className="mt-2.5 inline-flex flex-wrap items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>{formatDateBr(req.dataInicio)} até {formatDateBr(req.dataFim)}</span>
                            <span className="bg-purple-600 text-white px-2 py-0.5 rounded font-bold text-[11px]">
                              {req.diasTotais} dias de gozo
                            </span>
                          </div>

                          {req.venderAbono && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" /> Abono Pecuniário (10 dias vendidos)
                            </span>
                          )}

                          {req.adiantamentoDecimoTerceiro && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                              Adiantar 1ª parcela do 13º
                            </span>
                          )}
                        </div>

                        {/* Manager Endorsement Note */}
                        <div className="mt-3 p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-xs text-blue-950">
                          <span className="font-semibold text-blue-900 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            Parecer do Gestor ({req.gerenteNome}):
                          </span>
                          <p className="mt-0.5 italic">
                            &ldquo;{req.observacaoGerente || 'Aprovado pelo gestor de departamento.'}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(req)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Homologar e Baixar Saldo</span>
                      </button>

                      <button
                        onClick={() => {
                          setNoticeRequest(req);
                          setIsNoticeModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Prévia do Aviso de Férias</span>
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
                        Ver Detalhes do Histórico
                      </button>
                    </div>

                  </div>

                  {/* Rejection Form inside card */}
                  {rejectingId === req.id && (
                    <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200 animate-in fade-in">
                      <label className="block text-xs font-semibold text-rose-900 mb-1">
                        Motivo da Recusa pelo RH (obrigatório):
                      </label>
                      <textarea
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Ex: Não cumpre a antecedência mínima legal de 30 dias prevista no Art. 135 da CLT."
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
                          Confirmar Recusa RH
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional RH comment */}
                  {rejectingId !== req.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Observação da Homologação (ex: Programado para crédito no holerite do dia 25)."
                        value={commentInput[req.id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [req.id]: e.target.value })}
                        className="text-xs w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* General Employee Vacation Matrix & Passivo Trabalhista */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Matriz Geral de Colaboradores &amp; Saldos</h3>
            <p className="text-xs text-slate-500">Monitoramento dos períodos aquisitivos e risco de passivo trabalhista (CLT)</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              >
                <option value="todos">Todos os Departamentos</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={exportCsv}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Colaborador</th>
                <th className="px-5 py-3">Departamento / Cargo</th>
                <th className="px-5 py-3 text-center">Saldo Restante</th>
                <th className="px-5 py-3 text-center">Gozados</th>
                <th className="px-5 py-3">Período Aquisitivo</th>
                <th className="px-5 py-3">Limite Gozo (CLT)</th>
                <th className="px-5 py-3">Status de Conformidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => {
                const risk = getRiskStatus(user);
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img 
                        src={user.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}`} 
                        alt={user.nome}
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block">{user.nome}</span>
                        <span className="text-[10px] text-slate-400">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-800 block">{user.departamento}</span>
                      <span className="text-slate-500">{user.cargo}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {user.diasSaldoRestante} dias
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-slate-600 font-medium">
                      {user.diasGozados} dias
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {formatDateBr(user.periodoAquisitivoInicio)} - {formatDateBr(user.periodoAquisitivoFim)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {formatDateBr(user.limiteConcessivo)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${risk.color}`}>
                        {risk.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
