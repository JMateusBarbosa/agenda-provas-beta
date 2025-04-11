
import { ExamSchedule } from './types';

/**
 * Supabase Database Schema
 * 
 * Este arquivo define as funções para converter entre os formatos de dados
 * usados no frontend (tipos TypeScript) e os formatos usados no Supabase (banco de dados).
 * 
 * Relação entre nomenclaturas:
 * - Frontend: camelCase (studentName)
 * - Supabase: snake_case (student_name)
 */

/**
 * Converte um objeto ExamSchedule do formato da aplicação para o formato do Supabase
 * 
 * @param exam Objeto de agendamento no formato da aplicação (sem ID)
 * @param schoolId ID da escola associada ao exame
 * @returns Objeto no formato esperado pelo Supabase
 */
export const toSupabaseExam = (exam: Omit<ExamSchedule, 'id'>, schoolId: string): Record<string, any> => {
  return {
    student_name: exam.studentName,
    module: exam.module,
    pc_number: exam.pcNumber,
    exam_date: exam.examDate.toISOString(),
    exam_time: exam.examTime,
    exam_type: exam.examType,
    status: exam.status,
    school_id: schoolId
  };
};

/**
 * Converte um registro do Supabase para o formato de ExamSchedule da aplicação
 * 
 * @param record Registro retornado pelo Supabase
 * @returns Objeto ExamSchedule no formato usado pela aplicação
 */
export const fromSupabaseExam = (record: Record<string, any>): ExamSchedule => {
  return {
    id: record.id,
    studentName: record.student_name,
    module: record.module,
    pcNumber: record.pc_number,
    examDate: new Date(record.exam_date),
    examTime: record.exam_time,
    examType: record.exam_type,
    status: record.status,
    schoolId: record.school_id
  };
};
