import { UserProfile, VacationRequest } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-ana',
    nome: 'Ana Beatriz Souza',
    email: 'ana.souza@empresa.com.br',
    cargo: 'Desenvolvedora Full Stack Pleno',
    departamento: 'Tecnologia',
    role: 'funcionario',
    gerenteId: 'user-carlos',
    gerenteNome: 'Carlos Eduardo Silva',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    dataAdmissao: '2023-06-01',
    diasSaldoTotal: 30,
    diasSaldoRestante: 30,
    diasGozados: 0,
    diasAgendados: 0,
    periodoAquisitivoInicio: '2025-06-01',
    periodoAquisitivoFim: '2026-05-31',
    limiteConcessivo: '2027-04-30',
    salarioBase: 7800.00
  },
  {
    id: 'user-carlos',
    nome: 'Carlos Eduardo Silva',
    email: 'carlos.gerente@empresa.com.br',
    cargo: 'Gerente de Engenharia & TI',
    departamento: 'Tecnologia',
    role: 'gerente',
    fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    dataAdmissao: '2020-01-15',
    diasSaldoTotal: 30,
    diasSaldoRestante: 25,
    diasGozados: 5,
    diasAgendados: 0,
    periodoAquisitivoInicio: '2025-01-15',
    periodoAquisitivoFim: '2026-01-14',
    limiteConcessivo: '2026-12-15',
    salarioBase: 14500.00
  },
  {
    id: 'user-mariana',
    nome: 'Mariana Santos',
    email: 'mariana.rh@empresa.com.br',
    cargo: 'Coordenadora de Recursos Humanos / DP',
    departamento: 'Recursos Humanos',
    role: 'rh',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    dataAdmissao: '2021-03-10',
    diasSaldoTotal: 30,
    diasSaldoRestante: 20,
    diasGozados: 10,
    diasAgendados: 0,
    periodoAquisitivoInicio: '2025-03-10',
    periodoAquisitivoFim: '2026-03-09',
    limiteConcessivo: '2027-02-10',
    salarioBase: 9200.00
  },
  {
    id: 'user-lucas',
    nome: 'Lucas Mendes Ferreira',
    email: 'lucas.ferreira@empresa.com.br',
    cargo: 'Analista de QA Sênior',
    departamento: 'Tecnologia',
    role: 'funcionario',
    gerenteId: 'user-carlos',
    gerenteNome: 'Carlos Eduardo Silva',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dataAdmissao: '2022-09-12',
    diasSaldoTotal: 30,
    diasSaldoRestante: 15,
    diasGozados: 15,
    diasAgendados: 0,
    periodoAquisitivoInicio: '2024-09-12',
    periodoAquisitivoFim: '2025-09-11',
    limiteConcessivo: '2026-08-12',
    salarioBase: 7200.00
  },
  {
    id: 'user-juliana',
    nome: 'Juliana Rocha',
    email: 'juliana.rocha@empresa.com.br',
    cargo: 'Analista Financeiro Sênior',
    departamento: 'Financeiro',
    role: 'funcionario',
    gerenteId: 'user-carlos',
    gerenteNome: 'Carlos Eduardo Silva',
    fotoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    dataAdmissao: '2021-08-01',
    diasSaldoTotal: 30,
    diasSaldoRestante: 10,
    diasGozados: 20,
    diasAgendados: 0,
    periodoAquisitivoInicio: '2024-08-01',
    periodoAquisitivoFim: '2025-07-31',
    limiteConcessivo: '2026-07-01',
    salarioBase: 6900.00
  }
];

export const INITIAL_REQUESTS: VacationRequest[] = [
  {
    id: 'req-001',
    funcionarioId: 'user-lucas',
    funcionarioNome: 'Lucas Mendes Ferreira',
    funcionarioCargo: 'Analista de QA Sênior',
    departamento: 'Tecnologia',
    gerenteId: 'user-carlos',
    gerenteNome: 'Carlos Eduardo Silva',
    dataInicio: '2026-10-14',
    dataFim: '2026-10-28',
    diasTotais: 15,
    venderAbono: false,
    diasAbono: 0,
    adiantamentoDecimoTerceiro: true,
    motivoOuObs: 'Viagem em família agendada há meses.',
    status: 'pendente_gerente',
    criadoEm: '2026-09-20T14:30:00Z',
    atualizadoEm: '2026-09-20T14:30:00Z',
    historico: [
      {
        id: 'hist-1',
        solicitacaoId: 'req-001',
        autorId: 'user-lucas',
        autorNome: 'Lucas Mendes Ferreira',
        autorRole: 'funcionario',
        acao: 'criada',
        observacao: 'Solicitação enviada para aprovação do gestor.',
        criadoEm: '2026-09-20T14:30:00Z'
      }
    ]
  },
  {
    id: 'req-002',
    funcionarioId: 'user-juliana',
    funcionarioNome: 'Juliana Rocha',
    funcionarioCargo: 'Analista Financeiro Sênior',
    departamento: 'Financeiro',
    gerenteId: 'user-carlos',
    gerenteNome: 'Carlos Eduardo Silva',
    dataInicio: '2026-11-03',
    dataFim: '2026-11-12',
    diasTotais: 10,
    venderAbono: true,
    diasAbono: 10,
    adiantamentoDecimoTerceiro: false,
    motivoOuObs: 'Período pós-fechamento contábil trimestral. Desejo vender 10 dias.',
    status: 'pendente_rh',
    observacaoGerente: 'Aprovado pelo gestor. O time financeiro estará coberto pela equipe de apoio.',
    dataAprovacaoGerente: '2026-09-25T10:15:00Z',
    criadoEm: '2026-09-22T09:00:00Z',
    atualizadoEm: '2026-09-25T10:15:00Z',
    historico: [
      {
        id: 'hist-2',
        solicitacaoId: 'req-002',
        autorId: 'user-juliana',
        autorNome: 'Juliana Rocha',
        autorRole: 'funcionario',
        acao: 'criada',
        observacao: 'Solicitação criada.',
        criadoEm: '2026-09-22T09:00:00Z'
      },
      {
        id: 'hist-3',
        solicitacaoId: 'req-002',
        autorId: 'user-carlos',
        autorNome: 'Carlos Eduardo Silva',
        autorRole: 'gerente',
        acao: 'aprovada_gerente',
        observacao: 'Aprovado pelo gestor. O time financeiro estará coberto pela equipe de apoio.',
        criadoEm: '2026-09-25T10:15:00Z'
      }
    ]
  },
  {
    id: 'req-003',
    funcionarioId: 'user-carlos',
    funcionarioNome: 'Carlos Eduardo Silva',
    funcionarioCargo: 'Gerente de Engenharia & TI',
    departamento: 'Tecnologia',
    gerenteId: 'user-mariana',
    gerenteNome: 'Mariana Santos',
    dataInicio: '2026-12-21',
    dataFim: '2027-01-04',
    diasTotais: 15,
    venderAbono: false,
    diasAbono: 0,
    adiantamentoDecimoTerceiro: false,
    motivoOuObs: 'Recesso de fim de ano.',
    status: 'aprovado',
    observacaoGerente: 'Substituição formal repassada ao Tech Lead.',
    observacaoRH: 'Homologado pelo RH. Aviso de férias emitido e encaminhado.',
    dataAprovacaoGerente: '2026-09-10T16:00:00Z',
    dataAprovacaoRH: '2026-09-12T11:20:00Z',
    criadoEm: '2026-09-08T11:00:00Z',
    atualizadoEm: '2026-09-12T11:20:00Z',
    historico: [
      {
        id: 'hist-4',
        solicitacaoId: 'req-003',
        autorId: 'user-carlos',
        autorNome: 'Carlos Eduardo Silva',
        autorRole: 'gerente',
        acao: 'criada',
        observacao: 'Solicitação registrada.',
        criadoEm: '2026-09-08T11:00:00Z'
      },
      {
        id: 'hist-5',
        solicitacaoId: 'req-003',
        autorId: 'user-mariana',
        autorNome: 'Mariana Santos',
        autorRole: 'rh',
        acao: 'aprovada_gerente',
        observacao: 'Alinhado com a diretoria.',
        criadoEm: '2026-09-10T16:00:00Z'
      },
      {
        id: 'hist-6',
        solicitacaoId: 'req-003',
        autorId: 'user-mariana',
        autorNome: 'Mariana Santos',
        autorRole: 'rh',
        acao: 'aprovada_rh',
        observacao: 'Homologado pelo RH. Aviso de férias emitido e encaminhado.',
        criadoEm: '2026-09-12T11:20:00Z'
      }
    ]
  }
];

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
  return diffDays;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDateBr(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

// Brazilian CLT Labor Rule validation
export function validateVacationCLT(
  startDateStr: string,
  endDateStr: string,
  diasSaldoRestante: number,
  venderAbono: boolean
): { isValid: boolean; warnings: string[]; errors: string[]; days: number } {
  const days = calculateDaysBetween(startDateStr, endDateStr);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!startDateStr || !endDateStr) {
    return { isValid: false, warnings, errors: ['Selecione a data de início e fim.'], days: 0 };
  }

  if (days <= 0) {
    return { isValid: false, warnings, errors: ['A data final deve ser posterior ou igual à data de início.'], days: 0 };
  }

  const saldoDisponivel = venderAbono ? diasSaldoRestante - 10 : diasSaldoRestante;

  if (venderAbono && diasSaldoRestante < 10) {
    errors.push('Saldo insuficiente para realizar o abono pecuniário (venda de 10 dias).');
  }

  if (days > saldoDisponivel) {
    errors.push(`Os dias solicitados (${days} dias) ultrapassam o seu saldo disponível (${saldoDisponivel} dias).`);
  }

  // CLT: O início das férias não pode ocorrer nos dois dias que antecedem feriado ou repouso semanal remunerado (sexta-feira se folga no sábado/domingo)
  const start = new Date(startDateStr + 'T12:00:00');
  const dayOfWeek = start.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  if (dayOfWeek === 5) {
    warnings.push('Atenção CLT (Art. 134, § 3º): É vedado o início das férias nos 2 dias que antecedem feriado ou repouso semanal remunerado (sextas-feiras). Recomenda-se iniciar na segunda-feira.');
  } else if (dayOfWeek === 6 || dayOfWeek === 0) {
    errors.push('O início das férias não pode ser em sábado ou domingo.');
  }

  // CLT fracionamento: nenhum período pode ser inferior a 5 dias corridos
  if (days < 5) {
    errors.push('Regra CLT (Art. 134, § 1º): Nenhum período de férias individual pode ser inferior a 5 dias corridos.');
  }

  // Notice: minimum 30 days notice recommended by CLT art. 135
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffFromToday = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffFromToday < 30) {
    warnings.push(`Aviso de antecedência: A CLT prevê comunicação com 30 dias de antecedência. Solicitação com ${diffFromToday} dias de antecedência pode exigir anuência especial do RH.`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    days
  };
}
