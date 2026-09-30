import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

export const SupabaseGuideView: React.FC = () => {
  const { 
    supabaseConfig, 
    updateSupabaseCredentials, 
    showToast,
    resetToDemoData,
    users,
    requests
  } = useVacation();

  const [url, setUrl] = useState(supabaseConfig.url);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('Script SQL copiado com sucesso!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    await updateSupabaseCredentials(url.trim(), anonKey.trim());
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Database className="w-3.5 h-3.5" />
            <span>Persistência em Nuvem PostgreSQL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Integração com o Supabase
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            O FériasFlow foi desenvolvido com arquitetura completa para o Supabase. Todas as tabelas, tipos de dados, 
            status de aprovação (RH / Gerente) e histórico estão mapeados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Connection form & status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${supabaseConfig.isConnected ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'}`} />
              Status da Conexão
            </h3>

            <div className={`p-4 rounded-xl text-xs mb-4 border ${
              supabaseConfig.isConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                {supabaseConfig.isConnected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conectado ao Supabase</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Armazenamento Local Ativo</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed opacity-90">
                {supabaseConfig.isConnected
                  ? 'As requisições e saldos estão salvos e sincronizados diretamente no seu PostgreSQL Supabase.'
                  : 'O sistema opera perfeitamente com persistência no navegador até você inserir as credenciais.'}
              </p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL do Projeto Supabase
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chave Anon Pública (anon key)
                </label>
                <textarea
                  rows={3}
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Testando Conexão...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Testar e Salvar Credenciais</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                <span>Acessar Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={resetToDemoData}
                className="text-slate-500 hover:text-slate-800 text-[11px]"
                title="Reinicia com os dados de exemplo dos 5 colaboradores"
              >
                Restaurar Dados Demo
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Dados no Sistema
            </h4>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Colaboradores Cadastrados:</span>
              <span className="font-semibold text-slate-900">{users.length}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Total de Solicitações:</span>
              <span className="font-semibold text-slate-900">{requests.length}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Papeis Configurados:</span>
              <span className="font-semibold text-slate-900">RH, Gerente, Funcionário</span>
            </div>
          </div>
        </div>

        {/* Right column: 3-step guide & SQL Script */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3 Step Tutorial */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Passo a Passo Rápido para Ativar no Supabase
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">Crie um Projeto</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Acesse <strong>supabase.com</strong>, crie sua organização e um novo projeto gratuito.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">Execute o SQL</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Copie o script abaixo, cole no <strong>SQL Editor</strong> do Supabase e clique em <strong>RUN</strong>.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">Conecte a API</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Copie a URL e a Anon Key do painel e salve no formulário ao lado. Pronto!
                </p>
              </div>
            </div>
          </div>

          {/* SQL Editor card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>supabase_schema_feriasflow.sql</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Script SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 font-mono text-xs text-emerald-400 max-h-96 overflow-y-auto leading-relaxed">
              <pre className="text-slate-300">{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
