
import { ExamSchedule } from './types';

/**
 * Supabase Database Schema
 * 
 * This file outlines the structure of the database table needed for the exam scheduling system.
 * The schema matches the ExamSchedule type used in the application.
 * 
 * Table name: exam_schedules
 */

/**
 * SQL to create the exam_schedules table in Supabase:
 * 
 * CREATE TABLE exam_schedules (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   student_name TEXT NOT NULL,
 *   module TEXT NOT NULL,
 *   pc_number INTEGER NOT NULL,
 *   exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   exam_time TEXT NOT NULL,
 *   exam_type TEXT NOT NULL,
 *   status TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- Create an index for faster date-based queries
 * CREATE INDEX idx_exam_date ON exam_schedules(exam_date);
 * 
 * -- Create a trigger to update the updated_at timestamp
 * CREATE OR REPLACE FUNCTION update_modified_column()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   NEW.updated_at = now();
 *   RETURN NEW;
 * END;
 * $$ language 'plpgsql';
 * 
 * CREATE TRIGGER update_exam_schedules_updated_at
 * BEFORE UPDATE ON exam_schedules
 * FOR EACH ROW
 * EXECUTE PROCEDURE update_modified_column();
 */

/**
 * API Endpoints to implement in Supabase:
 * 
 * 1. GET /api/exams
 *    - Returns all exam schedules
 *    - Optional query parameters for filtering
 * 
 * 2. GET /api/exams/:id
 *    - Returns a specific exam by ID
 * 
 * 3. POST /api/exams
 *    - Creates a new exam schedule
 *    - Requires all fields except ID
 * 
 * 4. PUT /api/exams/:id
 *    - Updates an existing exam schedule
 *    - Partial updates allowed
 * 
 * 5. DELETE /api/exams/:id
 *    - Deletes an exam schedule
 */

/**
 * Function to convert application ExamSchedule to Supabase format
 */
export const toSupabaseExam = (exam: Omit<ExamSchedule, 'id'>): Record<string, any> => {
  return {
    student_name: exam.studentName,
    module: exam.module,
    pc_number: exam.pcNumber,
    exam_date: exam.examDate.toISOString(),
    exam_time: exam.examTime,
    exam_type: exam.examType,
    status: exam.status
  };
};

/**
 * Function to convert Supabase record to application ExamSchedule
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
    status: record.status
  };
};
