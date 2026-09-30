import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Briefcase, 
  User, 
  FileText, 
  DollarSign, 
  Printer, 
  History,
  AlertTriangle,
  Check
} from 'lucide-react';
import { formatDateBr } from '../lib/mockData';
import { RequestStatus } from '../types';

export const RequestDetailsModal: React.FC = () => {
  const { 
    selectedRequest, 
    setSelectedRequest, 
    currentUser, 
    users, 
    approveRequestByManager, 
    rejectRequestByManager, 
    approveRequestByRH, 
    rejectRequestByRH, 
    cancelRequest,
    setNoticeRequest,
    setIsNoticeModalOpen,
    showToast 
  } = useVacation();

  const [comment, setComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!selectedRequest) return null;

  const employee = users.find(u => u.id === selectedRequest.funcionarioId);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pendente_gerente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" /> Aguardando Avaliação do Gestor
          </span>
        );
      case 'pendente_rh':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <Clock className="w-3.5 h-3.5 text-indigo-700" /> Aprovado pelo Gestor &bull; Aguardando RH
          </span>
        );
      case 'aprovado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Aprovado e Homologado pelo RH
          </span>
        );
      case 'reprovado_gerente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" /> Reprovado pelo Gestor
          </span>
        );
      case 'reprovado_rh':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" /> Reprovado pelo RH
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Cancelado
          </span>
        );
    }
  };

  const handleManagerApprove = async () => {
    await approveRequestByManager(selectedRequest.id, comment || undefined);
    setSelectedRequest(null);
  };

  const handleManagerReject = async () => {
    if (!rejectReason.trim()) {
      showToast('Por favor, informe a justificativa da recusa.', 'error');
      return;
    }
    await rejectRequestByManager(selectedRequest.id, rejectReason);
    setSelectedRequest(null);
  };

  const handleRHApprove = async () => {
    await approveRequestByRH(selectedRequest.id, comment || undefined);
    setSelectedRequest(null);
  };

  const handleRHReject = async () => {
    if (!rejectReason.trim()) {
      showToast('Por favor, informe a justificativa da recusa pelo RH.', 'error');
      return;
    }
    await rejectRequestByRH(selectedRequest.id, rejectReason);
    setSelectedRequest(null);
  };

  const canManagerAction = currentUser.role === 'gerente' && selectedRequest.status === 'pendente_gerente';
  const canRHAction = currentUser.role === 'rh' && selectedRequest.status === 'pendente_rh';
  const canEmployeeCancel = currentUser.id === selectedRequest.funcionarioId && ['pendente_gerente', 'pendente_rh'].includes(selectedRequest.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Detalhes da Solicitação de Férias</h2>
              <p className="text-xs text-slate-300">
                Código: <span className="font-mono">{selectedRequest.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRequest(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Status badge & top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
            <div>{getStatusBadge(selectedRequest.status)}</div>
            <div className="text-xs text-slate-400">
              Registrado em {formatDateBr(selectedRequest.criadoEm)}
            </div>
          </div>

          {/* Employee & Manager card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Colaborador Solicitante</span>
              <div className="flex items-center gap-2.5">
                <img 
                  src={employee?.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.funcionarioNome)}`} 
                  alt={selectedRequest.funcionarioNome} 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{selectedRequest.funcionarioNome}</h4>
                  <p className="text-slate-500">{selectedRequest.departamento} &bull; {selectedRequest.funcionarioCargo}</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Gestor Imediato (Nível 1)</span>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                  {selectedRequest.gerenteNome.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{selectedRequest.gerenteNome}</h4>
                  <p className="text-slate-500">Gestão Responsável</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vacation Period Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Período de Descanso</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <span className="text-[11px] text-blue-700 block">Data de Início:</span>
                <span className="text-sm font-bold text-slate-900">{formatDateBr(selectedRequest.dataInicio)}</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <span className="text-[11px] text-blue-700 block">Data de Término:</span>
                <span className="text-sm font-bold text-slate-900">{formatDateBr(selectedRequest.dataFim)}</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <span className="text-[11px] text-blue-700 block">Duração Total:</span>
                <span className="text-sm font-extrabold text-blue-700">{selectedRequest.diasTotais} dias corridos</span>
              </div>
            </div>
          </div>

          {/* Abono and 13th info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Abono Pecuniário (Venda de 10 dias):</span>
              {selectedRequest.venderAbono ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sim, 10 dias convertidos em abono
                </span>
              ) : (
                <span className="text-slate-500">Não solicitado (gozo integral)</span>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Adiantamento da 1ª Parcela do 13º:</span>
              {selectedRequest.adiantamentoDecimoTerceiro ? (
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Sim, adiantamento requerido
                </span>
              ) : (
                <span className="text-slate-500">Não solicitado</span>
              )}
            </div>
          </div>

          {/* Observations / Justification */}
          {selectedRequest.motivoOuObs && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block mb-1">Justificativa do Colaborador:</span>
              <p className="text-slate-800 italic">&ldquo;{selectedRequest.motivoOuObs}&rdquo;</p>
            </div>
          )}

          {/* Endorsements / Approvals Log */}
          {selectedRequest.observacaoGerente && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950">
              <span className="font-semibold text-blue-900 block mb-0.5">
                Parecer do Gestor ({selectedRequest.gerenteNome}):
              </span>
              <p className="italic">&ldquo;{selectedRequest.observacaoGerente}&rdquo;</p>
            </div>
          )}

          {selectedRequest.observacaoRH && (
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-purple-950">
              <span className="font-semibold text-purple-900 block mb-0.5">
                Parecer / Despacho do RH:
              </span>
              <p className="italic">&ldquo;{selectedRequest.observacaoRH}&rdquo;</p>
            </div>
          )}

          {/* Audit trail */}
          {selectedRequest.historico && selectedRequest.historico.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                Histórico de Tramitação
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1 text-xs">
                {selectedRequest.historico.map((h, i) => (
                  <div key={h.id || i} className="relative">
                    <span className="font-semibold text-slate-900">{h.autorNome}</span>{' '}
                    <span className="text-[10px] text-slate-400 uppercase">({h.autorRole})</span>
                    <p className="text-slate-600 mt-0.5">{h.observacao || h.acao}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(h.criadoEm).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Form inside modal */}
          {isRejecting && (
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2">
              <label className="block font-semibold text-rose-900">
                Informe o motivo da recusa:
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Descreva o motivo que será registrado no histórico e comunicado ao colaborador."
                className="w-full p-2.5 border border-rose-300 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={canManagerAction ? handleManagerReject : handleRHReject}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
                >
                  Confirmar Recusa
                </button>
              </div>
            </div>
          )}

          {/* Comment input for approval */}
          {(canManagerAction || canRHAction) && !isRejecting && (
            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Comentário de Aprovação (opcional):
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={canManagerAction ? "Ex: Equipe avisada e prazos reorganizados." : "Ex: Homologado pelo RH corporativo."}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

        </div>

        {/* Modal Footer / Action buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          
          <div>
            {selectedRequest.status === 'aprovado' && (
              <button
                onClick={() => {
                  setNoticeRequest(selectedRequest);
                  setIsNoticeModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Aviso de Férias Oficial</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRequest(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Fechar
            </button>

            {/* Manager Actions */}
            {canManagerAction && !isRejecting && (
              <>
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Recusar Pedido
                </button>
                <button
                  onClick={handleManagerApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Aprovar (Encaminhar ao RH)</span>
                </button>
              </>
            )}

            {/* RH Actions */}
            {canRHAction && !isRejecting && (
              <>
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Recusar Homologação
                </button>
                <button
                  onClick={handleRHApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Homologar e Emitir Aviso</span>
                </button>
              </>
            )}

            {/* Employee cancel */}
            {canEmployeeCancel && (
              <button
                onClick={() => {
                  if (confirm('Deseja cancelar esta solicitação de férias?')) {
                    cancelRequest(selectedRequest.id);
                  }
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar Minha Solicitação
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
