import { useState, useEffect } from "react";
import { ExamSchedule, FilterState, ExamStatus } from "@/lib/types";

const MANAUS_TZ = "America/Manaus";

/**
 * Formata uma Date como "YYYY-MM-DD" no fuso America/Manaus.
 * Usa Intl.DateTimeFormat para ser 100% preciso independente do timezone do navegador.
 */
const toManausDateStr = (date: Date): string => {
  // en-CA locale retorna no formato YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MANAUS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Converte a data escolhida no calendário para YYYY-MM-DD sem aplicar conversão de timezone.
 * Evita deslocamento de dia quando o navegador está em fuso diferente de Manaus.
 */
const calendarDateToYmd = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Obtém a data efetiva do exame para comparação.
 * Prioriza examTs; se null, usa examDate.
 */
const getEffectiveDate = (exam: ExamSchedule): Date | null => {
  if (exam.examTs) {
    const d = exam.examTs instanceof Date ? exam.examTs : new Date(exam.examTs as any);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (exam.examDate) {
    const d = exam.examDate instanceof Date ? exam.examDate : new Date(exam.examDate as any);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
};

export function useExamFilters(exams: ExamSchedule[]) {
  const [filters, setFilters] = useState<FilterState>({
    studentName: "",
    module: "",
    pcNumber: "",
    examDate: null,
    examTime: "",
    status: "all",
  });
  const [filteredExams, setFilteredExams] = useState<ExamSchedule[]>([]);

  useEffect(() => {
    let result = [...exams];

    // Filtro por nome
    if (filters.studentName) {
      result = result.filter((exam) =>
        exam.studentName?.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    // Filtro por módulo
    if (filters.module) {
      result = result.filter((exam) =>
        exam.module.toLowerCase().includes(filters.module.toLowerCase())
      );
    }

    // Filtro por PC
    if (filters.pcNumber && filters.pcNumber !== "all") {
      result = result.filter(
        (exam) => String(exam.pcNumber) === String(filters.pcNumber)
      );
    }

    // Filtro por data: compara strings YYYY-MM-DD no fuso Manaus
    if (filters.examDate instanceof Date) {
      const filterDateStr = calendarDateToYmd(filters.examDate);

      result = result.filter((exam) => {
        const effective = getEffectiveDate(exam);
        if (!effective) return false;
        const examDateStr = toManausDateStr(effective);
        return examDateStr === filterDateStr;
      });
    }

    // Filtro por horário
    if (filters.examTime && filters.examTime !== "all") {
      result = result.filter((exam) => exam.examTime === filters.examTime);
    }

    // Filtro por status
    if (filters.status !== "all") {
      result = result.filter((exam) => exam.status === (filters.status as ExamStatus));
    }

    // Ordenação: "hoje" primeiro, depois cronológico
    const todayStr = toManausDateStr(new Date());

    result.sort((a, b) => {
      const aDate = getEffectiveDate(a);
      const bDate = getEffectiveDate(b);

      const aIsToday = aDate ? toManausDateStr(aDate) === todayStr : false;
      const bIsToday = bDate ? toManausDateStr(bDate) === todayStr : false;

      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;

      const aTime = aDate?.getTime() ?? 0;
      const bTime = bDate?.getTime() ?? 0;
      return aTime - bTime;
    });

    setFilteredExams(result);
  }, [filters, exams]);

  return { filters, setFilters, filteredExams };
}
