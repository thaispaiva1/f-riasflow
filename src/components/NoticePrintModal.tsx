import React from 'react';
import { useVacation } from '../context/VacationContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatDateBr } from '../lib/mockData';

export const NoticePrintModal: React.FC = () => {
  const { noticeRequest, isNoticeModalOpen, setIsNoticeModalOpen, users } = useVacation();

  if (!isNoticeModalOpen || !noticeRequest) return null;

  const employee = users.find(u => u.id === noticeRequest.funcionarioId);

  // Return to work date is the day following dataFim
  const getReturnDate = (dateStr: string) => {
    try {
      const end = new Date(dateStr + 'T12:00:00');
      end.setDate(end.getDate() + 1);
      return end.toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar (hidden during print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Aviso de Férias Oficial (Art. 135 CLT)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={() => setIsNoticeModalOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 text-slate-900 font-sans print:p-0 print:m-0" id="aviso-ferias-doc">
          
          {/* Company Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <h1 className="text-lg font-extrabold uppercase tracking-wide">FÉRIASFLOW TECNOLOGIA E SERVIÇOS S.A.</h1>
            <p className="text-xs text-slate-600">CNPJ: 00.123.456/0001-78 &bull; Inscrição Estadual: Isenta</p>
            <p className="text-xs text-slate-500">Departamento de Recursos Humanos &bull; Gestão de Pessoas</p>
          </div>

          {/* Document Title */}
          <div className="text-center my-6">
            <h2 className="text-base font-bold uppercase tracking-wider underline">
              AVISO PRÉVIO DE FÉRIAS
            </h2>
            <p className="text-xs text-slate-500 mt-1">Conforme Artigo 135 da Consolidação das Leis do Trabalho (CLT)</p>
          </div>

          {/* Text Statement */}
          <div className="text-xs text-slate-800 leading-relaxed space-y-4 text-justify mb-8">
            <p>
              Vimos por meio deste comunicar-lhe que, de acordo com as disposições legais vigentes, 
              ser-lhe-á concedido o gozo de suas férias regulamentares, relativas ao período aquisitivo especificado abaixo:
            </p>

            {/* Spec Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong className="text-slate-900">Empregado(a):</strong> {noticeRequest.funcionarioNome}
                </div>
                <div>
                  <strong className="text-slate-900">Cargo:</strong> {noticeRequest.funcionarioCargo}
                </div>
                <div>
                  <strong className="text-slate-900">Departamento:</strong> {noticeRequest.departamento}
                </div>
                <div>
                  <strong className="text-slate-900">Gestor Responsável:</strong> {noticeRequest.gerenteNome}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <strong className="text-slate-900">Período Aquisitivo:</strong>{' '}
                  {formatDateBr(employee?.periodoAquisitivoInicio || '')} a {formatDateBr(employee?.periodoAquisitivoFim || '')}
                </div>
                <div>
                  <strong className="text-slate-900">Duração do Gozo:</strong> {noticeRequest.diasTotais} dias corridos
                </div>
                <div>
                  <strong className="text-slate-900">Início das Férias:</strong> {formatDateBr(noticeRequest.dataInicio)}
                </div>
                <div>
                  <strong className="text-slate-900">Término das Férias:</strong> {formatDateBr(noticeRequest.dataFim)}
                </div>
                <div>
                  <strong className="text-slate-900">Retorno ao Trabalho:</strong> {getReturnDate(noticeRequest.dataFim)}
                </div>
                <div>
                  <strong className="text-slate-900">Abono Pecuniário (10 dias):</strong>{' '}
                  {noticeRequest.venderAbono ? 'SIM (10 dias convertidos em remuneração)' : 'NÃO'}
                </div>
                <div>
                  <strong className="text-slate-900">1ª Parcela do 13º Salário:</strong>{' '}
                  {noticeRequest.adiantamentoDecimoTerceiro ? 'SIM (Solicitado adiantamento)' : 'NÃO'}
                </div>
              </div>
            </div>

            <p>
              Solicitamos a apresentação de sua Carteira de Trabalho e Previdência Social (CTPS) física ou acesso digital ao Departamento de Recursos Humanos 
              para as anotações devidas, bem como a ciência neste instrumento.
            </p>

            <p className="text-[11px] text-slate-500 italic">
              A remuneração correspondente às férias e, se for o caso, ao abono pecuniário e adiantamento da gratificação natalina, 
              será creditada até 2 (dois) dias antes do início do respectivo período, conforme estipulado pelo Art. 145 da CLT.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-12 grid grid-cols-2 gap-10 text-center text-xs">
            <div>
              <div className="border-t border-slate-800 pt-2 font-bold">
                FÉRIASFLOW TECNOLOGIA E SERVIÇOS S.A.
              </div>
              <span className="text-slate-500 text-[11px]">Recursos Humanos / Empregador</span>
              <p className="text-[10px] text-slate-400 mt-1">Homologado eletronicamente</p>
            </div>

            <div>
              <div className="border-t border-slate-800 pt-2 font-bold">
                {noticeRequest.funcionarioNome}
              </div>
              <span className="text-slate-500 text-[11px]">Assinatura do Empregado (Ciente)</span>
              <p className="text-[10px] text-slate-400 mt-1">Data: ____/____/________</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
