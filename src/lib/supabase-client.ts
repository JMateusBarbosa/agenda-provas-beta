
// This file will be implemented when Supabase is connected
// Below is a placeholder for the structure to implement

/**
 * Instructions for Supabase Setup:
 * 
 * 1. Create a Supabase project at https://supabase.com
 * 2. Create the exam_schedules table using the SQL in supabase-schema.ts
 * 3. Install the Supabase client: npm install @supabase/supabase-js
 * 4. Configure your Supabase URL and public anon key below
 */



import { createClient } from '@supabase/supabase-js';
import { ExamSchedule } from './types';
import { toSupabaseExam, fromSupabaseExam } from './supabase-schema';

// Replace with your Supabase URL and public anon key when deploying
const supabaseUrl = 'https://lndunjdjtxqnxbafedfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZHVuamRqdHhxbnhiYWZlZGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5Nzc1NzgsImV4cCI6MjA1NzU1MzU3OH0.maudsrhpJc1mMSMAEyFBIkZJIJ2I0mVeTc7Q6FclcRo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Exam API functions
export const examApi = {
  // Get all exams with optional filters
  getExams: async (): Promise<ExamSchedule[]> => {
    const { data, error } = await supabase
      .from('exam_schedules')
      .select('*')
      .order('exam_date', { ascending: true });
    
    console.log('Dados retornados do Supabase:', data);

    if (error) throw error;
    
    return data ? data.map(fromSupabaseExam) : [];
  },
  
  // Get a single exam by id
  getExamById: async (id: string): Promise<ExamSchedule | null> => {
    const { data, error } = await supabase
      .from('exam_schedules')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? fromSupabaseExam(data) : null;
  },
  
  // Create a new exam
  createExam: async (exam: Omit<ExamSchedule, 'id'>): Promise<ExamSchedule> => {
    const { data, error } = await supabase
      .from('exam_schedules')
      .insert(toSupabaseExam(exam))
      .select()
      .single();
    
    if (error) throw error;
    
    return fromSupabaseExam(data);
  },
  
  // Update an existing exam
  updateExam: async (id: string, exam: Partial<ExamSchedule>): Promise<ExamSchedule> => {
    const updateData: Record<string, any> = {};
    
    // Only convert fields that exist in the partial update
    if (exam.studentName !== undefined) updateData.student_name = exam.studentName;
    if (exam.module !== undefined) updateData.module = exam.module;
    if (exam.pcNumber !== undefined) updateData.pc_number = exam.pcNumber;
    if (exam.examDate !== undefined) updateData.exam_date = exam.examDate.toISOString();
    if (exam.examTime !== undefined) updateData.exam_time = exam.examTime;
    if (exam.examType !== undefined) updateData.exam_type = exam.examType;
    if (exam.status !== undefined) updateData.status = exam.status;
    
    const { data, error } = await supabase
      .from('exam_schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return fromSupabaseExam(data);
  },
  
  // Delete an exam
  deleteExam: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('exam_schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

