
import React, { useState } from 'react';
import { examApi } from '@/lib/supabase-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import ExamForm from '@/components/exam/ExamForm';
import ExamConfirmationDialog from '@/components/exam/ExamConfirmationDialog';
import { ExamType } from '@/lib/types';

const ScheduleExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { schoolId } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Form state for confirmation dialog
    const [formData, setFormData] = useState({
    studentName: '',
    module: '',
    pcNumber: '',
    examTs: '' as string,    // ISO string gerada pelo ExamForm (exam_ts)
    examTime: '',
    examType: 'P1' as ExamType,
  });


    const handleSubmit = async (examData: any) => {
    try {
      // examData já deve conter schoolId (ExamForm inclui antes de chamar)
      const data = await examApi.createExam(examData); // apenas 1 argumento

      toast({
        title: "Prova agendada",
        description: `Agendamento para ${examData.studentName} realizado com sucesso.`,
      });

      // Store form data for confirmation dialog (usar examTs em vez de examDate)
      setFormData({
        studentName: examData.studentName,
        module: examData.module,
        pcNumber: String(examData.pcNumber),
        examTs: examData.examTs ?? '',   // examTs é ISO string enviada pelo ExamForm
        examTime: examData.examTime,
        examType: examData.examType,
      });

      setShowConfirmation(true);
    } catch (error) {
      console.error("Erro ao agendar prova:", error);
      throw error; // Re-throw para o ExamForm lidar
    }
  };


  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <PageLayout
      title="Agendar Nova Prova"
      description="Preencha todos os campos obrigatórios para criar um novo agendamento de prova."
    >
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg border border-border p-6 animate-fade-up">
        <ExamForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          schoolId={schoolId}
        />
      </div>
      
        <ExamConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        studentName={formData.studentName}
        module={formData.module}
        pcNumber={formData.pcNumber}
        examTs={formData.examTs}        // agora passamos examTs (ISO string)
        examTime={formData.examTime}
        examType={formData.examType}
        onClose={handleConfirmationClose}
      />

    </PageLayout>
  );
};

export default ScheduleExam;
