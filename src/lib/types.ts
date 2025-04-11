
/**
 * Definição dos tipos principais utilizados na aplicação
 */

/**
 * Status possíveis para um exame
 */
export type ExamStatus = 'Pendente' | 'Aprovado' | 'Reprovado';

/**
 * Tipos possíveis de exame
 */
export type ExamType = 'P1' | 'Rec.1' | 'Rec.2';

/**
 * Estrutura de dados para agendamento de exame
 */
export type ExamSchedule = {
  id: string;                 // Identificador único do agendamento
  studentName: string;        // Nome do aluno
  module: string;             // Módulo/disciplina
  pcNumber: number;           // Número do computador
  examDate: Date;             // Data do exame
  examTime: string;           // Horário do exame (formato: HH:MM)
  examType: ExamType;         // Tipo do exame (P1, Rec.1, Rec.2)
  status: ExamStatus;         // Status do exame (Pendente, Aprovado, Reprovado)
  schoolId: string;           // ID da escola associada
}

/**
 * Estrutura para o estado dos filtros na tabela de exames
 */
export type FilterState = {
  studentName: string;
  module: string;
  pcNumber: string;
  examDate: Date | null;
  examTime: string;
  status: string;
}

/**
 * Estrutura de dados para usuário
 */
export type User = {
  id: string;                 // Identificador único do usuário na tabela users
  email: string;              // Email do usuário (único)
  name: string;               // Nome completo do usuário
  schoolId: string;           // ID da escola associada
  username: string;           // Nome de usuário para login (único)
}
