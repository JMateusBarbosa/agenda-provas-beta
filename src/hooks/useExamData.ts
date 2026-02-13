// userExamData.ts
import { useState, useEffect } from "react";
import { examApi } from "@/lib/supabase-client";
import { ExamSchedule } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export function useExamData(schoolId?: string) {
  const { toast } = useToast(); // use the hook version consistently
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadExams() {
      // if no schoolId, clear state and stop loading
      if (!schoolId) {
        if (mounted) {
          setExams([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await examApi.getExams(schoolId);
        if (!mounted) return;
        setExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("loadExams error:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os agendamentos.",
          variant: "destructive",
        });
        if (mounted) setExams([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadExams();

    return () => {
      mounted = false;
    };
  }, [schoolId, toast]);

  const updateExam = async (id: string, updatedExam: Partial<ExamSchedule>) => {
    try {
      const updated = await examApi.updateExam(id, updatedExam);
      // handle case where API returns array or single object
      const updatedItem = Array.isArray(updated) ? updated[0] : updated;
      if (!updatedItem) throw new Error("Nenhum item atualizado retornado pela API.");

      setExams((prev) =>
        prev.map((exam) => (exam.id === id ? { ...exam, ...updatedItem } : exam))
      );

      toast({
        title: "Atualização realizada",
        description: "Os dados da prova foram atualizados com sucesso.",
      });

      return updatedItem;
    } catch (err) {
      console.error("updateExam error:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await examApi.deleteExam(id);
      setExams((prev) => prev.filter((exam) => exam.id !== id));
      toast({
        title: "Prova excluída",
        description: "O agendamento da prova foi excluído com sucesso.",
        variant: "destructive",
      });
    } catch (err) {
      console.error("deleteExam error:", err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive",
      });
      throw err;
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
