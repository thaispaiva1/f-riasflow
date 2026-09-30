import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Key, 
  Globe, 
  Check, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

export const SupabaseModal: React.FC = () => {
  const { 
    isSupabaseModalOpen, 
    setIsSupabaseModalOpen, 
    supabaseConfig, 
    updateSupabaseCredentials,
    showToast 
  } = useVacation();

  const [url, setUrl] = useState(supabaseConfig.url);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  if (!isSupabaseModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateSupabaseCredentials(url.trim(), anonKey.trim());
    setIsSubmitting(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('Script SQL copiado para a área de transferência!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Conexão com o Supabase</h2>
              <p className="text-xs text-slate-300">Pronto para persistência em nuvem PostgreSQL</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Configurar Credenciais
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Script SQL das Tabelas</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">1-Click</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'config' ? (
            <div>
              {/* Status Alert Banner */}
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
                supabaseConfig.isConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {supabaseConfig.isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <p className="font-semibold text-sm mb-1">
                    {supabaseConfig.isConnected 
                      ? 'Supabase Conectado e Operando!' 
                      : 'Modo Local Ativo (Pronto para o Supabase)'}
                  </p>
                  <p className="leading-relaxed">
                    {supabaseConfig.isConnected 
                      ? 'Todas as solicitações de férias, saldos e aprovações estão sincronizadas em tempo real com seu banco PostgreSQL no Supabase.' 
                      : 'O sistema já possui o schema pronto. Enquanto as credenciais não forem preenchidas, todos os dados são persistidos no navegador (LocalStorage), garantindo que nada se perca.'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Encontrado em: <strong>Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <textarea
                    rows={2}
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Encontrado em: <strong>Project Settings &gt; API &gt; Project API Keys &gt; anon public</strong>
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                  >
                    <span>Abrir painel Supabase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSupabaseModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                    >
                      Fechar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Testando Conexão...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Salvar &amp; Conectar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Script SQL para o Supabase</h3>
                  <p className="text-xs text-slate-500">Cria as tabelas `perfis`, `solicitacoes_ferias` e histórico com RLS.</p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl p-3 text-slate-100 font-mono text-[11px] max-h-80 overflow-y-auto border border-slate-800">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Como usar no Supabase:</strong> Vá no painel do Supabase &gt; menu lateral <strong>SQL Editor</strong> &gt; clique em <strong>New Query</strong> &gt; cole este script e clique no botão verde <strong>RUN</strong>.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
