import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';
import { formatDateBr } from '../lib/mockData';
import { VacationRequest, RequestStatus } from '../types';

export const CalendarView: React.FC = () => {
  const { requests, users, setSelectedRequest } = useVacation();

  // Current calendar view month/year
  const [currentDate, setCurrentDate] = useState(() => {
    // Default to Oct 2026 where sample requests are, or current date
    return new Date(2026, 9, 1); // Month 9 is October (0-indexed)
  });

  const [departmentFilter, setDepartmentFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Days calculation for the grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (['cancelado', 'reprovado_gerente', 'reprovado_rh'].includes(req.status)) {
      return false; // don't clutter calendar with rejected/cancelled
    }
    if (departmentFilter !== 'todos' && req.departamento !== departmentFilter) {
      return false;
    }
    if (statusFilter !== 'todos' && req.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Check if a day has vacation events
  const getRequestsForDay = (day: number) => {
    // Format YYYY-MM-DD
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    return filteredRequests.filter(req => {
      return dateStr >= req.dataInicio && dateStr <= req.dataFim;
    });
  };

  // Month requests for side panel
  const currentMonthRequests = filteredRequests.filter(req => {
    const start = new Date(req.dataInicio);
    const end = new Date(req.dataFim);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    return (start <= monthEnd && end >= monthStart);
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'aprovado':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'pendente_rh':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'pendente_gerente':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusDot = (status: RequestStatus) => {
    switch (status) {
      case 'aprovado':
        return 'bg-emerald-500';
      case 'pendente_rh':
        return 'bg-indigo-500';
      case 'pendente_gerente':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  const departments = Array.from(new Set(users.map(u => u.departamento)));

  return (
    <div className="space-y-6">
      
      {/* Calendar Header with Navigation and Filters */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded-lg hover:bg-white text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              Hoje
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Próximo Mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize">
              {monthNames[month]} <span className="text-slate-500 font-normal">{year}</span>
            </h2>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Aprovado (Homologado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 font-medium">Aguardando RH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Aguardando Gestor</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="todos">Todos Departamentos</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="todos">Todos os Status</option>
              <option value="aprovado">Aprovadas</option>
              <option value="pendente_rh">Aguardando RH</option>
              <option value="pendente_gerente">Aguardando Gestor</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Grid & Side list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Calendar Grid (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
            {weekDayNames.map((d, i) => (
              <div key={d} className={i === 0 || i === 6 ? 'text-slate-400' : ''}>
                {d}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[560px]">
            {/* Previous month empty days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <div key={`prev-${i}`} className="p-1.5 sm:p-2 bg-slate-50/50 min-h-[95px] text-slate-300 text-xs">
                  <span>{dayNum}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayOfWeek = (firstDayIndex + i) % 7;
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const dayRequests = getRequestsForDay(day);

              return (
                <div 
                  key={`day-${day}`} 
                  className={`p-1.5 sm:p-2 min-h-[95px] flex flex-col justify-between transition-colors ${
                    isWeekend ? 'bg-slate-50/60' : 'bg-white hover:bg-blue-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold rounded-md px-1.5 py-0.5 ${
                      isWeekend ? 'text-slate-400' : 'text-slate-800'
                    }`}>
                      {day}
                    </span>
                    {dayRequests.length > 1 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded-full" title="Mais de 1 colaborador de férias!">
                        {dayRequests.length}
                      </span>
                    )}
                  </div>

                  {/* Vacation tags on this day */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-20">
                    {dayRequests.slice(0, 3).map(req => (
                      <button
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={`w-full text-left px-1.5 py-1 rounded text-[10px] font-semibold border truncate flex items-center gap-1 transition-transform hover:scale-[1.02] cursor-pointer ${getStatusColor(req.status)}`}
                        title={`${req.funcionarioNome} (${req.departamento}) - ${req.diasTotais} dias. Clique para ver detalhes e aprovar.`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(req.status)}`} />
                        <span className="truncate">{req.funcionarioNome.split(' ')[0]}</span>
                      </button>
                    ))}

                    {dayRequests.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-medium block text-center">
                        +{dayRequests.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Next month filling days */}
            {Array.from({ length: (7 - ((firstDayIndex + totalDaysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`next-${i}`} className="p-1.5 sm:p-2 bg-slate-50/50 min-h-[95px] text-slate-300 text-xs">
                <span>{i + 1}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Side Panel: Month Summary & Requests list */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              Ausências em {monthNames[month]}/{year}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {currentMonthRequests.length} colaboradores com férias neste mês
            </p>

            {currentMonthRequests.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhuma ausência programada para este mês com os filtros atuais.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {currentMonthRequests.map(req => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/80 hover:bg-blue-50/40 transition-all cursor-pointer text-xs"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900">{req.funcionarioNome}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${getStatusDot(req.status)}`} />
                    </div>
                    <div className="text-[11px] text-slate-500 mb-1">
                      {req.departamento} &bull; {req.funcionarioCargo}
                    </div>
                    <div className="flex items-center justify-between text-slate-700 font-semibold pt-1 border-t border-slate-200/60 text-[11px]">
                      <span>{formatDateBr(req.dataInicio)} a {formatDateBr(req.dataFim)}</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                        {req.diasTotais} dias
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick conflict advisory */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Users className="w-4 h-4 text-indigo-600" /> Dica para Gerentes &amp; RH
            </span>
            <p className="leading-relaxed text-slate-600">
              Clique em qualquer bloco de férias no calendário para abrir os detalhes, verificar o parecer do gestor e aprovar ou homologar instantaneamente.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
