
export type ExamStatus = 'Pendente' | 'Aprovado' | 'Reprovado';

export type ExamType = 'P1' | 'Rec.1' | 'Rec.2';

export type ExamSchedule = {
  id: string;
  studentName: string;
  module: string;
  pcNumber: number;
  examDate: Date;
  examTime: string;
  examType: ExamType;
  status: ExamStatus;
}

export type FilterState = {
  studentName: string;
  module: string;
  pcNumber: string;
  examDate: Date | null;
  examTime: string;
  status: string; // Changed from ExamStatus | '' to string to allow "all" value
}
