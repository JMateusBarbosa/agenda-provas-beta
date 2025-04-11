
import { createClient } from '@supabase/supabase-js';
import { ExamSchedule } from './types';
import { toSupabaseExam, fromSupabaseExam } from './supabase-schema';

// URLs e chaves do Supabase
// IMPORTANTE: Estas credenciais são seguras para uso no cliente pois
// possuem permissões limitadas via Row Level Security (RLS)
const supabaseUrl = 'https://lndunjdjtxqnxbafedfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZHVuamRqdHhxbnhiYWZlZGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5Nzc1NzgsImV4cCI6MjA1NzU1MzU3OH0.maudsrhpJc1mMSMAEyFBIkZJIJ2I0mVeTc7Q6FclcRo';

// Cliente Supabase para interação com backend
export const supabase = createClient(supabaseUrl, supabaseKey);

// Importamos as funções de auth-api.ts
import { authApi } from './auth-api';

/**
 * API para gerenciamento de usuários
 * 
 * Fornece funções para:
 * - Buscar usuários
 * - Buscar usuário atual
 * - Buscar usuário por nome de usuário
 * - Registro de usuários
 * - Verificação de existência de nomes de usuário
 */
export const userApi = {
  /**
   * Busca todos os usuários do sistema
   * @returns Lista de usuários
   */
  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    return data;
  },
  
  /**
   * Busca o usuário atualmente autenticado
   * @returns Dados do usuário ou null se não autenticado
   */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (!user) return null;
    
    // Buscar informações adicionais do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();
    
    if (userError) throw userError;
    
    return userData;
  },
  
  /**
   * Busca um usuário pelo nome de usuário
   * @param username Nome de usuário a buscar
   * @returns Dados do usuário encontrado
   */
  getUserByUsername: async (username: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    
    return data;
  },
  
  // Re-exportamos as funções de authApi
  registerUser: authApi.registerUser,
  checkUsernameExists: authApi.checkUsernameExists
};

/**
 * API para gerenciamento de agendamentos de exames
 * 
 * Fornece funções para:
 * - Listar exames (com filtro por escola)
 * - Buscar exame por ID
 * - Criar exame
 * - Atualizar exame
 * - Excluir exame
 */
export const examApi = {
  /**
   * Busca todos os exames de uma escola
   * @param schoolId ID da escola para filtrar os exames
   * @returns Lista de agendamentos de exames
   */
  getExams: async (schoolId: string): Promise<ExamSchedule[]> => {
    const { data, error } = await supabase
      .from('exam_schedules')
      .select('*')
      .eq('school_id', schoolId)
      .order('exam_date', { ascending: true });
    
    console.log('Dados retornados do Supabase:', data);

    if (error) throw error;
    
    return data ? data.map(fromSupabaseExam) : [];
  },
  
  /**
   * Busca um exame específico por ID
   * @param id ID do exame a buscar
   * @returns Dados do exame ou null se não encontrado
   */
  getExamById: async (id: string): Promise<ExamSchedule | null> => {
    const { data, error } = await supabase
      .from('exam_schedules')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? fromSupabaseExam(data) : null;
  },
  
  /**
   * Cria um novo agendamento de exame
   * @param exam Dados do exame a criar (sem ID)
   * @param schoolId ID da escola associada ao exame
   * @returns Dados do exame criado
   */
  createExam: async (exam: Omit<ExamSchedule, 'id'>, schoolId: string): Promise<ExamSchedule> => {
    const { data, error } = await supabase
      .from('exam_schedules')
      .insert(toSupabaseExam(exam, schoolId))
      .select()
      .single();
    
    if (error) throw error;
    
    return fromSupabaseExam(data);
  },
  
  /**
   * Atualiza um agendamento de exame existente
   * @param id ID do exame a atualizar
   * @param exam Dados parciais do exame para atualização
   * @returns Dados do exame atualizado
   */
  updateExam: async (id: string, exam: Partial<ExamSchedule>): Promise<ExamSchedule> => {
    const updateData: Record<string, any> = {};
    
    // Apenas converte campos que existem na atualização parcial
    if (exam.studentName !== undefined) updateData.student_name = exam.studentName;
    if (exam.module !== undefined) updateData.module = exam.module;
    if (exam.pcNumber !== undefined) updateData.pc_number = exam.pcNumber;
    if (exam.examDate !== undefined) updateData.exam_date = exam.examDate.toISOString();
    if (exam.examTime !== undefined) updateData.exam_time = exam.examTime;
    if (exam.examType !== undefined) updateData.exam_type = exam.examType;
    if (exam.status !== undefined) updateData.status = exam.status;
    // Não permitimos atualizar a escola
    
    const { data, error } = await supabase
      .from('exam_schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return fromSupabaseExam(data);
  },
  
  /**
   * Exclui um agendamento de exame
   * @param id ID do exame a excluir
   */
  deleteExam: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('exam_schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

/**
 * API para gerenciamento de escolas
 * 
 * Fornece funções para:
 * - Listar escolas
 * - Buscar escola por ID
 */
export const schoolApi = {
  /**
   * Busca todas as escolas cadastradas
   * @returns Lista de escolas
   */
  getSchools: async () => {
    const { data, error } = await supabase
      .from('schools')
      .select('*');
    
    if (error) throw error;
    
    return data;
  },
  
  /**
   * Busca uma escola específica por ID
   * @param id ID da escola a buscar
   * @returns Dados da escola
   */
  getSchoolById: async (id: string) => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  }
};
