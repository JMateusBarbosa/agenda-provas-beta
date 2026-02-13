import { ExamSchedule } from './types';

/**
 * Converte dados do frontend para o formato do Supabase
 * NÃO gera datas. Apenas converte campos.
 */
export const toSupabaseExam = (
  exam: Partial<ExamSchedule>
): Record<string, any> => {
  const out: Record<string, any> = {};

  if (exam.studentName !== undefined) out.student_name = exam.studentName;
  if (exam.module !== undefined) out.module = exam.module;
  if (exam.pcNumber !== undefined) out.pc_number = exam.pcNumber;
  if (exam.examTime !== undefined) out.exam_time = exam.examTime;
  if (exam.examType !== undefined) out.exam_type = exam.examType;
  if (exam.status !== undefined) out.status = exam.status;
  if (exam.schoolId !== undefined) out.school_id = exam.schoolId;

  // Fonte da verdade
  if (exam.examTs !== undefined) {
    out.exam_ts = exam.examTs instanceof Date ? exam.examTs.toISOString() : exam.examTs;
  }

   // Campo legado (opcional). Se não vier, derive do exam_ts para atender NOT NULL.
  if (exam.examDate !== undefined && exam.examDate != null) {
     out.exam_date = exam.examDate.toISOString();
  } else if (exam.examTs !== undefined && exam.examTs !== null) {
    const examTsDate = exam.examTs instanceof Date ? exam.examTs : new Date(exam.examTs);
    if (!Number.isNaN(examTsDate.getTime())) {
      out.exam_date = examTsDate.toISOString();
    }
  }

  return out;
};

/**
 * Converte registro do Supabase para o formato da aplicação
 */
export const fromSupabaseExam = (record: Record<string, any>): ExamSchedule => {
  const examTs = record.exam_ts ? new Date(record.exam_ts) : null;

  return {
    id: record.id,
    studentName: record.student_name,
    module: record.module,
    pcNumber: record.pc_number,
    examDate: examTs ?? new Date(record.exam_date),
    examTime: record.exam_time,
    examType: record.exam_type,
    status: record.status,
    schoolId: record.school_id,
    examTs,
  };
};
