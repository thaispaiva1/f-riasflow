import React, { useState, useMemo } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Send,
  HelpCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { validateVacationCLT, formatCurrency, formatDateBr } from '../lib/mockData';

export const NewRequestModal: React.FC = () => {
  const { 
    currentUser, 
    isNewRequestModalOpen, 
    setIsNewRequestModalOpen, 
    createVacationRequest,
    showToast 
  } = useVacation();

  // Initial suggested dates: next month, Monday to Friday (e.g. 15 days)
  const [dataInicio, setDataInicio] = useState('2026-11-09');
  const [dataFim, setDataFim] = useState('2026-11-23');
  const [venderAbono, setVenderAbono] = useState(false);
  const [adiantamentoDecimoTerceiro, setAdiantamentoDecimoTerceiro] = useState(false);
  const [motivoOuObs, setMotivoOuObs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validation = useMemo(() => {
    return validateVacationCLT(
      dataInicio, 
      dataFim, 
      currentUser.diasSaldoRestante, 
      venderAbono
    );
  }, [dataInicio, dataFim, currentUser.diasSaldoRestante, venderAbono]);

  if (!isNewRequestModalOpen) return null;

  // Estimated financial calculation for 10-day abono
  const abonoEstimado = (currentUser.salarioBase / 30) * 10 + (currentUser.salarioBase / 30 * 10 / 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation.isValid) {
      showToast(validation.errors[0] || 'Verifique as datas da solicitação.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await createVacationRequest({
      dataInicio,
      dataFim,
      diasTotais: validation.days,
      venderAbono,
      diasAbono: venderAbono ? 10 : 0,
      adiantamentoDecimoTerceiro,
      motivoOuObs: motivoOuObs.trim() || undefined
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsNewRequestModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Solicitar Férias</h2>
              <p className="text-xs text-blue-100">
                Colaborador: <strong>{currentUser.nome}</strong> &bull; Saldo: <strong>{currentUser.diasSaldoRestante} dias</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewRequestModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Destination workflow alert */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>
                Gestor responsável pela 1ª aprovação: <strong>{currentUser.gerenteNome || 'Carlos Eduardo Silva'}</strong>
              </span>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              Nível 1 &gt; RH
            </span>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Data de Início das Férias
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Recomendado: segunda-feira
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Data de Término das Férias
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Último dia de descanso
              </span>
            </div>
          </div>

          {/* Calculated Days Banner */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">Total Solicitado:</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-blue-700">{validation.days}</span>
              <span className="text-xs font-bold text-blue-900">dias corridos</span>
            </div>
          </div>

          {/* CLT Warnings & Errors */}
          {validation.errors.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              {validation.errors.map((err, idx) => (
                <div key={idx} className="flex items-start gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {validation.warnings.length > 0 && validation.errors.length === 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              {validation.warnings.map((warn, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Options: Abono Pecuniário (10 days sale) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  id="abono-checkbox"
                  type="checkbox"
                  checked={venderAbono}
                  onChange={(e) => setVenderAbono(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="abono-checkbox" className="font-bold text-xs text-slate-900 cursor-pointer flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Vender 10 dias de Férias (Abono Pecuniário - Art. 143 CLT)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Conversão em dinheiro de 1/3 do período de férias a que tem direito.
                  </p>
                </div>
              </div>

              {venderAbono && (
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 font-bold block">Valor Estimado:</span>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {formatCurrency(abonoEstimado)}
                  </span>
                </div>
              )}
            </div>

            {/* 13th Salary Advance Option */}
            <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2.5">
              <input
                id="13-checkbox"
                type="checkbox"
                checked={adiantamentoDecimoTerceiro}
                onChange={(e) => setAdiantamentoDecimoTerceiro(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <label htmlFor="13-checkbox" className="font-bold text-xs text-slate-900 cursor-pointer">
                  Solicitar Adiantamento da 1ª Parcela do 13º Salário
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Conforme Art. 2º, § 2º da Lei 4.749/65, pode ser pago junto com as férias.
                </p>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações / Justificativa para o Gestor e RH (opcional)
            </label>
            <textarea
              rows={2}
              value={motivoOuObs}
              onChange={(e) => setMotivoOuObs(e.target.value)}
              placeholder="Ex: Viagem em família já programada. Tarefas antecipadas com o time."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!validation.isValid || isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitação de Férias'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
