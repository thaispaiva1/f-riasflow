import React from 'react';
import { VacationProvider, useVacation } from './context/VacationContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { RHDashboard } from './components/RHDashboard';
import { CalendarView } from './components/CalendarView';
import { EmployeesView } from './components/EmployeesView';
import { NewRequestModal } from './components/NewRequestModal';
import { RequestDetailsModal } from './components/RequestDetailsModal';
import { NoticePrintModal } from './components/NoticePrintModal';
import { Toast } from './components/Toast';

const MainContent: React.FC = () => {
  const { currentUser, activeTab, isAuthenticated } = useVacation();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <>
            {currentUser.role === 'funcionario' && <EmployeeDashboard />}
            {currentUser.role === 'gerente' && <ManagerDashboard />}
            {currentUser.role === 'rh' && <RHDashboard />}
          </>
        )}

        {activeTab === 'calendar' && <CalendarView />}
        
        {/* Funcionário não tem acesso a Colaboradores & Saldos */}
        {activeTab === 'employees' && currentUser.role !== 'funcionario' && (
          <EmployeesView />
        )}
      </main>

      {/* Modals */}
      <NewRequestModal />
      <RequestDetailsModal />
      <NoticePrintModal />
      <Toast />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FériasFlow</span>
            <span>&bull;</span>
            <span>Sistema Corporativo de Gestão de Férias CLT</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Conforme legislação trabalhista vigente (CLT)
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <VacationProvider>
      <MainContent />
    </VacationProvider>
  );
}
