import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, VacationRequest, ApprovalHistoryItem } from '../types';

const STORAGE_KEY_URL = 'feriasflow_supabase_url';
const STORAGE_KEY_ANON = 'feriasflow_supabase_anon_key';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL) || envUrl;
  const storedAnon = localStorage.getItem(STORAGE_KEY_ANON) || envAnon;

  return { url: storedUrl.trim(), anonKey: storedAnon.trim() };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string): void {
  if (url) {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
  }

  if (anonKey) {
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

let activeClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey) {
    activeClient = null;
    return null;
  }

  try {
    if (!activeClient) {
      activeClient = createClient(url, anonKey);
    }
    return activeClient;
  } catch (error) {
    console.error('Erro ao inicializar cliente Supabase:', error);
    return null;
  }
}

export function resetSupabaseClient(): void {
  activeClient = null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL e Chave Anon são obrigatórios.' };
  }

  try {
    const testClient = createClient(url, anonKey);
    // Ping by checking auth settings or querying public table
    const { error } = await testClient.from('perfis').select('id').limit(1);
    
    if (error) {
      // If table does not exist yet, but connection authenticated:
      if (error.code === '42P01') {
        return { 
          success: true, 
          message: 'Conectado ao Supabase com sucesso! Porém a tabela "perfis" ainda não existe. Execute o script SQL fornecido na aba Guia SQL.' 
        };
      }
      return { success: false, message: `Erro ao conectar: ${error.message}` };
    }

    return { success: true, message: 'Conexão com o Supabase estabelecida com sucesso! Tabelas detectadas.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Falha ao conectar com o endpoint do Supabase.' };
  }
}

// Complete copyable SQL Schema for Supabase
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================
-- FÉRIASFLOW - ESQUEMA DE BANCO DE DADOS SUPABASE
-- Sistema de Gestão de Férias (RH, Gerente e Funcionário)
-- ==============================================================

-- 1. Criação do tipo ENUM para Papéis (Roles) e Status
DO $$ BEGIN
    CREATE TYPE tipo_papel AS ENUM ('rh', 'gerente', 'funcionario');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_solicitacao AS ENUM (
        'pendente_gerente',
        'pendente_rh',
        'aprovado',
        'reprovado_gerente',
        'reprovado_rh',
        'cancelado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Perfis de Funcionários
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cargo VARCHAR(150) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    role tipo_papel NOT NULL DEFAULT 'funcionario',
    gerente_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    data_admissao DATE NOT NULL DEFAULT CURRENT_DATE,
    dias_saldo_total INT NOT NULL DEFAULT 30,
    dias_saldo_restante INT NOT NULL DEFAULT 30,
    dias_gozados INT NOT NULL DEFAULT 0,
    dias_agendados INT NOT NULL DEFAULT 0,
    periodo_aquisitivo_inicio DATE NOT NULL,
    periodo_aquisitivo_fim DATE NOT NULL,
    limite_concessivo DATE NOT NULL,
    salario_base NUMERIC(10,2) NOT NULL DEFAULT 3500.00,
    foto_url TEXT,
    criado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Solicitações de Férias
CREATE TABLE IF NOT EXISTS public.solicitacoes_ferias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    gerente_id UUID NOT NULL REFERENCES public.perfis(id),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    dias_totais INT NOT NULL CHECK (dias_totais > 0 AND dias_totais <= 30),
    vender_abono BOOLEAN NOT NULL DEFAULT false,
    dias_abono INT NOT NULL DEFAULT 0,
    adiantamento_decimo_terceiro BOOLEAN NOT NULL DEFAULT false,
    motivo_ou_obs TEXT,
    status status_solicitacao NOT NULL DEFAULT 'pendente_gerente',
    observacao_gerente TEXT,
    observacao_rh TEXT,
    data_aprovacao_gerente TIMESTAMPTZ,
    data_aprovacao_rh TIMESTAMPTZ,
    criado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Histórico de Tramitação e Auditoria
CREATE TABLE IF NOT EXISTS public.historico_aprovacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES public.solicitacoes_ferias(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES public.perfis(id),
    autor_nome VARCHAR(255) NOT NULL,
    autor_role tipo_papel NOT NULL,
    acao VARCHAR(50) NOT NULL,
    observacao TEXT,
    criado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_aprovacoes ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Acesso Permissivas para a API do App (Anon / Authenticated)
CREATE POLICY "Permitir leitura total para consulta de ferias" 
ON public.perfis FOR SELECT USING (true);

CREATE POLICY "Permitir atualizacao de perfis pelo RH" 
ON public.perfis FOR ALL USING (true);

CREATE POLICY "Permitir gerenciamento de solicitacoes" 
ON public.solicitacoes_ferias FOR ALL USING (true);

CREATE POLICY "Permitir registro de historico" 
ON public.historico_aprovacoes FOR ALL USING (true);

-- 7. Dados Iniciais de Demonstração (Seed Data)
INSERT INTO public.perfis (id, nome, email, cargo, departamento, role, data_admissao, dias_saldo_total, dias_saldo_restante, dias_gozados, dias_agendados, periodo_aquisitivo_inicio, periodo_aquisitivo_fim, limite_concessivo, salario_base, foto_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Mariana Santos', 'mariana.rh@empresa.com.br', 'Especialista de RH / Business Partner', 'Recursos Humanos', 'rh', '2021-03-10', 30, 20, 10, 0, '2025-03-10', '2026-03-09', '2027-02-10', 8200.00, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('22222222-2222-2222-2222-222222222222', 'Carlos Eduardo Silva', 'carlos.gerente@empresa.com.br', 'Gerente de Engenharia & TI', 'Tecnologia', 'gerente', '2020-01-15', 30, 25, 5, 0, '2025-01-15', '2026-01-14', '2026-12-15', 14500.00, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
  ('33333333-3333-3333-3333-333333333333', 'Ana Beatriz Souza', 'ana.souza@empresa.com.br', 'Desenvolvedora Full Stack Pleno', 'Tecnologia', 'funcionario', '2023-06-01', 30, 30, 0, 0, '2024-06-01', '2025-05-31', '2026-05-01', 7800.00, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('44444444-4444-4444-4444-444444444444', 'Lucas Mendes Ferreira', 'lucas.ferreira@empresa.com.br', 'Analista de QA Sênior', 'Tecnologia', 'funcionario', '2022-09-12', 30, 15, 15, 0, '2024-09-12', '2025-09-11', '2026-08-12', 7200.00, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('55555555-5555-5555-5555-555555555555', 'Juliana Rocha', 'juliana.rocha@empresa.com.br', 'Analista Financeiro Sênior', 'Financeiro', 'funcionario', '2021-08-01', 30, 10, 20, 0, '2024-08-01', '2025-07-31', '2026-07-01', 6900.00, 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150')
ON CONFLICT (id) DO NOTHING;

-- Atualizar gerentes
UPDATE public.perfis SET gerente_id = '22222222-2222-2222-2222-222222222222' WHERE id IN ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555');
`;
