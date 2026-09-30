import React from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  DollarSign, 
  FileText, 
  CalendarDays,
  FileCheck,
  ChevronRight,
  Info,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { formatDateBr, formatCurrency } from '../lib/mockData';
import { VacationRequest, RequestStatus } from '../types';

export const EmployeeDashboard: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    setIsNewRequestModalOpen, 
    setSelectedRequest,
    cancelRequest,
    setNoticeRequest,
    setIsNoticeModalOpen
  } = useVacation();

  // Employee's own requests
  const myRequests = requests.filter(r => r.funcionarioId === currentUser.id);

  // Status badge helper
  const renderStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pendente_gerente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            Pendente Gestor
          </span>
        );
      case 'pendente_rh':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Aguardando RH
          </span>
        );
      case 'aprovado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Aprovado &amp; Homologado
          </span>
        );
      case 'reprovado_gerente':
      case 'reprovado_rh':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {status === 'reprovado_gerente' ? 'Reprovado pelo Gestor' : 'Reprovado pelo RH'}
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Cancelado
          </span>
        );
    }
  };

  // Timeline progress steps
  const getTimelineSteps = (status: RequestStatus) => {
    const isApprovedGerente = ['pendente_rh', 'aprovado'].includes(status);
    const isApprovedRH = status === 'aprovado';
    const isRejected = ['reprovado_gerente', 'reprovado_rh', 'cancelado'].includes(status);

    return (
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1 text-emerald-700">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Solicitação
        </span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className={`flex items-center gap-1 ${
          isApprovedGerente ? 'text-emerald-700' : isRejected ? 'text-rose-600' : 'text-amber-700 font-bold'
        }`}>
          {isApprovedGerente ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />} 
          Gestor
        </span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className={`flex items-center gap-1 ${
          isApprovedRH ? 'text-emerald-700 font-bold' : isRejected ? 'text-slate-400' : status === 'pendente_rh' ? 'text-indigo-700 font-bold' : 'text-slate-400'
        }`}>
          {isApprovedRH ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />} 
          RH
        </span>
      </div>
    );
  };

  // Estimated 10-day abono value
  const estimatedAbonoValue = (currentUser.salarioBase / 30) * 10 + (currentUser.salarioBase / 30 * 10 / 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-blue-100 mb-2">
            Portal do Colaborador
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            Olá, {currentUser.nome.split(' ')[0]}!
          </h2>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Acompanhe seu saldo de férias, datas do período aquisitivo e solicite novos períodos com aprovação direta do seu gestor e do RH.
          </p>
        </div>
        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-blue-600" />
          <span>Solicitar Minhas Férias</span>
        </button>
      </div>

      {/* Balance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Saldo Disponível */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Disponível</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarDays className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{currentUser.diasSaldoRestante}</span>
            <span className="text-sm font-semibold text-slate-500">dias</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span>De um total de <strong>{currentUser.diasSaldoTotal} dias</strong> anuais</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(currentUser.diasSaldoRestante / currentUser.diasSaldoTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 2: Período Aquisitivo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Período Aquisitivo</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {formatDateBr(currentUser.periodoAquisitivoInicio)} até {formatDateBr(currentUser.periodoAquisitivoFim)}
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Limite para gozo: <strong className="text-slate-800">{formatDateBr(currentUser.limiteConcessivo)}</strong></span>
          </div>
        </div>

        {/* Card 3: Dias Agendados / Gozados */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Dias Agendados</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{currentUser.diasAgendados}</span>
            <span className="text-sm font-semibold text-slate-500">dias em análise</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Já usufruídos este ano: <strong className="text-slate-800">{currentUser.diasGozados} dias</strong>
          </div>
        </div>

        {/* Card 4: Abono Pecuniário (Venda de 10 dias) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Abono Pecuniário (10d)</span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="text-xl font-bold text-indigo-900">
            {formatCurrency(estimatedAbonoValue)}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Estimativa de valor ao vender 1/3 das férias (+ 1/3 constitucional)
          </div>
        </div>

      </div>

      {/* Main Content: My Requests Table & CLT Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table of requests (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Minhas Solicitações de Férias</h3>
                <p className="text-xs text-slate-500">Histórico e status de aprovação de cada período</p>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nova Solicitação</span>
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-slate-600">Você ainda não tem solicitações de férias registradas.</p>
                <p className="text-xs text-slate-400 mt-1">Clique no botão "Solicitar Minhas Férias" para iniciar seu pedido.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myRequests.map(req => (
                  <div key={req.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {formatDateBr(req.dataInicio)} até {formatDateBr(req.dataFim)}
                          </span>
                          <span className="text-xs bg-slate-100 font-semibold px-2 py-0.5 rounded text-slate-700">
                            {req.diasTotais} dias corridos
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Gestor avaliador: <strong>{req.gerenteNome}</strong> &bull; Solicitado em {formatDateBr(req.criadoEm)}
                        </p>
                      </div>

                      <div>{renderStatusBadge(req.status)}</div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3">
                      {getTimelineSteps(req.status)}
                    </div>

                    {/* Badges for Abono and 13º */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        {req.venderAbono && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                            <DollarSign className="w-3 h-3" /> Abono de {req.diasAbono} dias vendido
                          </span>
                        )}
                        {req.adiantamentoDecimoTerceiro && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-medium text-[11px] border border-blue-200">
                            1ª parcela 13º adiantada
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'aprovado' && (
                          <button
                            onClick={() => {
                              setNoticeRequest(req);
                              setIsNoticeModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Aviso de Férias</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        >
                          Ver Detalhes
                        </button>

                        {['pendente_gerente', 'pendente_rh'].includes(req.status) && (
                          <button
                            onClick={() => {
                              if (confirm('Deseja realmente cancelar esta solicitação de férias?')) {
                                cancelRequest(req.id);
                              }
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: CLT Rules & Information */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Regras de Férias (Legislação CLT)
            </h4>

            <div className="space-y-2.5 text-slate-600 leading-relaxed">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Fracionamento em até 3 períodos:</strong>
                Desde a Reforma Trabalhista, as férias podem ser divididas em até 3 vezes, sendo que um período não pode ser menor que 14 dias e nenhum menor que 5 dias.
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Início das férias:</strong>
                É proibido iniciar as férias nos 2 dias que antecedem feriados ou repouso semanal remunerado (sexta-feira se trabalha de seg a sex).
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Abono Pecuniário (Venda):</strong>
                É facultado ao empregado converter até 1/3 (10 dias) do período de férias a que tiver direito em abono pecuniário no valor da remuneração que lhe seria devida.
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Fluxo de Aprovação:</strong>
                Sua solicitação é encaminhada ao seu <strong>Gerente Direto</strong> e, após a aprovação dele, é homologada pelo <strong>RH</strong> com a emissão do Aviso Prévio.
              </div>
            </div>
          </div>

          {/* Manager Info Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Seu Gestor Imediato</h4>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {currentUser.gerenteNome ? currentUser.gerenteNome.charAt(0) : 'G'}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{currentUser.gerenteNome || 'Gestor Responsável'}</p>
                <p className="text-slate-500 text-[11px]">Gerência de Departamento</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
