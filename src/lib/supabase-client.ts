
import { createClient } from '@supabase/supabase-js';
import { ExamSchedule } from './types';
import { toSupabaseExam, fromSupabaseExam} from './supabase-schema';
import { makeExamTsFromDateAndTime } from '@/utils/dates';

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
      // Buscar TODOS os registros (Supabase limita a 1000 por padrão)
      let allData: any[] = [];
      let from = 0;
      const PAGE_SIZE = 1000;

      while (true) {
        const { data, error: pageError } = await supabase
          .from('exam_schedules')
          .select('*')
          .eq('school_id', schoolId)
          .order('exam_ts', { ascending: true, nullsFirst: false })
          .range(from, from + PAGE_SIZE - 1);

        if (pageError) throw pageError;
        if (!data || data.length === 0) break;

        allData = allData.concat(data);
        if (data.length < PAGE_SIZE) break; // última página
        from += PAGE_SIZE;
      }

      return allData.map(fromSupabaseExam);
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

      if (error) {
        if (error.code === 'PGRST116' /* not found */) return null;
        throw error;
      }

      return fromSupabaseExam(data);
    },
  /**
   * Cria um novo agendamento de exame
   * @param exam Dados do exame a criar (sem ID)
   * @param schoolId ID da escola associada ao exame
   * @returns Dados do exame criado
   */
  createExam: async (payload: Partial<ExamSchedule>) => {
    // usa toSupabaseExam para manter snake_case
    const insertPayload = toSupabaseExam(payload);
    const { data, error } = await supabase
      .from('exam_schedules')
      .insert([insertPayload])
      .select('*'); // retorna o objeto inserido

    if (error) throw error;
    // data é array, pegamos o primeiro e mapeamos
    return fromSupabaseExam(Array.isArray(data) ? data[0] : data);
  },
  
  /**
   * Atualiza um agendamento de exame existente
   * @param id ID do exame a atualizar
   * @param exam Dados parciais do exame para atualização
   * @returns Dados do exame atualizado
   */
    updateExam: async (id: string, exam: Partial<ExamSchedule>): Promise<ExamSchedule> => {
    const updateData: Record<string, any> = {};

    // Campos simples
    if (exam.studentName !== undefined) updateData.student_name = exam.studentName;
    if (exam.module !== undefined) updateData.module = exam.module;
    if (exam.pcNumber !== undefined) updateData.pc_number = exam.pcNumber;
    if (exam.examType !== undefined) updateData.exam_type = exam.examType;
    if (exam.status !== undefined) updateData.status = exam.status;
    if (exam.schoolId !== undefined) {
      // NÃO permitir mudança de escola por segurança do domínio — comente/remova se quiser permitir
      // updateData.school_id = exam.schoolId;
    }

    // Prioridade 1: se o caller enviou examTs já pronto, use ele diretamente
    if (exam.examTs !== undefined && exam.examTs !== null) {
      // exam.examTs pode ser Date ou string ISO
      updateData.exam_ts = exam.examTs instanceof Date ? exam.examTs.toISOString() : exam.examTs;
      // também atualize exam_time se enviado (mantemos para UX)
      if (exam.examTime !== undefined) updateData.exam_time = exam.examTime;
      if (exam.examDate !== undefined) updateData.exam_date = exam.examDate ? exam.examDate.toISOString() : null;
    } else if (exam.examDate !== undefined || exam.examTime !== undefined) {
      // Caso caller não envie examTs, recombinamos usando a função compartilhada com o frontend
      // Buscar o exame atual para obter valores faltantes
      const { data: currentExam, error: fetchErr } = await supabase
        .from('exam_schedules')
        .select('exam_date, exam_time, exam_ts')
        .eq('id', id)
        .single();

      if (fetchErr) throw fetchErr;

      // determinar nova data e hora (prioriza valores enviados no payload)
      // currentExam.exam_ts existe em UTC string ou null
      let baseDate: Date;
      if (exam.examDate) {
        baseDate = exam.examDate;
      } else if (currentExam?.exam_ts) {
        baseDate = new Date(currentExam.exam_ts);
      } else if (currentExam?.exam_date) {
        baseDate = new Date(currentExam.exam_date);
      } else {
        baseDate = new Date();
      }

      const newTime = (exam.examTime !== undefined && exam.examTime !== null)
        ? exam.examTime
        : currentExam?.exam_time ?? '00:00';

      // gerar exam_ts usando a mesma lógica do frontend (Manaus)
      const examTsIso = makeExamTsFromDateAndTime(baseDate, newTime);

      // preencher updateData
      updateData.exam_ts = examTsIso;
      updateData.exam_time = newTime;
      if (exam.examDate !== undefined) {
        updateData.exam_date = exam.examDate ? exam.examDate.toISOString() : null;
      }
    }

    const { data, error } = await supabase
      .from('exam_schedules')
      .update(updateData)
      .eq('id', id)
      .select('*')
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
