import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Briefcase,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { formatDateBr, formatCurrency } from '../lib/mockData';
import { UserProfile, Role } from '../types';

export const EmployeesView: React.FC = () => {
  const { users, currentUser, setCurrentUser, showToast } = useVacation();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'todos' || u.departamento === departmentFilter;
    const matchesRole = roleFilter === 'todos' || u.role === roleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const departments = Array.from(new Set(users.map(u => u.departamento)));

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'rh':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">RH</span>;
      case 'gerente':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Gerente</span>;
      case 'funcionario':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Funcionário</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Quadro de Colaboradores &amp; Dados de Férias
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de períodos aquisitivos, saldos acumulados e vencimentos de concessão conforme a CLT.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="todos">Todos Departamentos</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="todos">Todos os Papéis</option>
            <option value="funcionario">Funcionários</option>
            <option value="gerente">Gerentes</option>
            <option value="rh">RH</option>
          </select>
        </div>
      </div>

      {/* Grid of Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(user => {
          const isCurrent = user.id === currentUser.id;
          const percentUsed = Math.min(100, Math.round(((user.diasGozados) / user.diasSaldoTotal) * 100));

          return (
            <div 
              key={user.id} 
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isCurrent ? 'ring-2 ring-blue-600 border-blue-400' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* User Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=3b82f6&color=fff`} 
                      alt={user.nome} 
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{user.nome}</h3>
                      <p className="text-xs text-slate-500">{user.cargo}</p>
                      <span className="text-[11px] font-semibold text-blue-600">{user.departamento}</span>
                    </div>
                  </div>
                  <div>{getRoleBadge(user.role)}</div>
                </div>

                {/* Vacation Balances */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Saldo Restante:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {user.diasSaldoRestante} dias
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dias Já Usufruídos:</span>
                    <span className="font-semibold text-slate-800">{user.diasGozados} dias</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dias em Agendamento:</span>
                    <span className="font-semibold text-amber-700">{user.diasAgendados} dias</span>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>{user.diasGozados} dias gozados</span>
                      <span>{user.diasSaldoTotal} dias anuais</span>
                    </div>
                  </div>
                </div>

                {/* Período Aquisitivo details */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Período Aquisitivo:</span>
                    <span className="font-medium text-slate-800">
                      {formatDateBr(user.periodoAquisitivoInicio)} - {formatDateBr(user.periodoAquisitivoFim)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Limite de Gozo (CLT):</span>
                    <span className="font-bold text-slate-900">
                      {formatDateBr(user.limiteConcessivo)}
                    </span>
                  </div>
                  {user.gerenteNome && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Gestor Direto:</span>
                      <span className="text-slate-700 font-medium">{user.gerenteNome}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">{user.email}</span>
                {isCurrent && (
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Perfil Conectado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
