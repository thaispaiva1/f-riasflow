import React from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  Calendar as CalendarIcon, 
  Users, 
  LayoutDashboard, 
  PlusCircle, 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  LogOut
} from 'lucide-react';
import { Role } from '../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setIsNewRequestModalOpen,
    getPendingManagerCount,
    getPendingRHCount,
    logout
  } = useVacation();

  const pendingManager = getPendingManagerCount();
  const pendingRH = getPendingRHCount();

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'rh':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Recursos Humanos (RH)
          </span>
        );
      case 'gerente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Briefcase className="w-3.5 h-3.5" />
            Gestor / Gerente
          </span>
        );
      case 'funcionario':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5" />
            Colaborador / Funcionário
          </span>
        );
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Current User */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">FériasFlow</h1>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">CLT</span>
                </div>
                <p className="text-xs text-slate-500">Gestão Integrada de Férias</p>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-slate-200" />

            {/* Active profile card */}
            <div className="flex items-center gap-3 pl-1">
              <img 
                src={currentUser.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.nome)}&background=3b82f6&color=fff`} 
                alt={currentUser.nome} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 leading-tight">{currentUser.nome}</span>
                  {getRoleBadge(currentUser.role)}
                </div>
                <span className="text-xs text-slate-500 leading-tight">
                  {currentUser.cargo} &bull; <span className="font-medium text-slate-700">{currentUser.departamento}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Solicitar Férias</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-sm font-medium transition-all cursor-pointer"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 mt-4 pt-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>
              {currentUser.role === 'rh' 
                ? 'Painel Geral do RH' 
                : currentUser.role === 'gerente' 
                  ? 'Painel da Minha Equipe' 
                  : 'Meu Painel de Férias'}
            </span>
            {currentUser.role === 'gerente' && pendingManager > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {pendingManager}
              </span>
            )}
            {currentUser.role === 'rh' && pendingRH > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-purple-600 text-white rounded-full">
                {pendingRH}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendário de Ausências</span>
          </button>

          {/* Somente Gerente ou RH têm acesso a "Colaboradores & Saldos" */}
          {currentUser.role !== 'funcionario' && (
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'employees'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Colaboradores & Saldos</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
