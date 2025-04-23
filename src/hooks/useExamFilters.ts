
import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { ExamSchedule, FilterState, ExamStatus } from "@/lib/types";

export function useExamFilters(exams: ExamSchedule[]) {
  const [filters, setFilters] = useState<FilterState>({
    studentName: '',
    module: '',
    pcNumber: '',
    examDate: null,
    examTime: '',
    status: 'all'
  });
  const [filteredExams, setFilteredExams] = useState<ExamSchedule[]>([]);

  useEffect(() => {
    let result = [...exams];

    if (filters.studentName) {
      result = result.filter(exam =>
        exam.studentName?.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }
    if (filters.module) {
      result = result.filter(exam =>
        exam.module.toLowerCase().includes(filters.module.toLowerCase())
      );
    }
    if (filters.pcNumber && filters.pcNumber !== 'all') {
      result = result.filter(exam =>
        String(exam.pcNumber) === String(filters.pcNumber)
      );
    }
    if (filters.examDate instanceof Date) {
      result = result.filter(exam =>
        format(exam.examDate, 'yyyy-MM-dd') === format(filters.examDate, 'yyyy-MM-dd')
      );
    }
    if (filters.examTime && filters.examTime !== 'all') {
      result = result.filter(exam =>
        exam.examTime === filters.examTime
      );
    }
    if (filters.status !== 'all') {
      result = result.filter(exam =>
        exam.status === filters.status as ExamStatus
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    result.sort((a, b) => {
      const aIsToday = isSameDay(a.examDate, today);
      const bIsToday = isSameDay(b.examDate, today);
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;
      return a.examDate.getTime() - b.examDate.getTime();
    });

    setFilteredExams(result);
  }, [filters, exams]);

  return { filters, setFilters, filteredExams };
}
