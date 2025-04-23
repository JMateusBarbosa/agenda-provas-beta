
import { useState, useEffect } from "react";
import { examApi } from "@/lib/supabase-client";
import { ExamSchedule } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

export function useExamData(schoolId?: string) {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      if (!schoolId) return;
      setLoading(true);
      try {
        const data = await examApi.getExams(schoolId);
        setExams(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os agendamentos.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
    loadExams();
  }, [schoolId]);

  const updateExam = async (id: string, updatedExam: Partial<ExamSchedule>) => {
    try {
      const updated = await examApi.updateExam(id, updatedExam);
      setExams((prev) =>
        prev.map(exam => exam.id === id ? { ...exam, ...updated } : exam)
      );
      toast({
        title: "Atualização realizada",
        description: "Os dados da prova foram atualizados com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive",
      });
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await examApi.deleteExam(id);
      setExams((prev) => prev.filter(exam => exam.id !== id));
      toast({
        title: "Prova excluída",
        description: "O agendamento da prova foi excluído com sucesso.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive",
      });
    }
  };

  return {
    exams,
    setExams,
    updateExam,
    deleteExam,
    loading,
  };
}
