import React from 'react';
import { useVacation } from '../context/VacationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useVacation();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium max-w-md ${
        toast.type === 'success'
          ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
          : toast.type === 'error'
            ? 'bg-rose-900 text-rose-100 border-rose-700'
            : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}

        <span className="flex-1">{toast.message}</span>

        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white transition-colors p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
