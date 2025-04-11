
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
    examDate: new Date(),
    examTime: '',
    examType: 'P1' as ExamType,
  });

  const handleSubmit = async (examData: any) => {
    try {
      const data = await examApi.createExam(examData, schoolId);
      
      toast({
        title: "Prova agendada",
        description: `Agendamento para ${examData.studentName} realizado com sucesso.`,
      });
      
      // Store form data for confirmation dialog
      setFormData({
        studentName: examData.studentName,
        module: examData.module,
        pcNumber: examData.pcNumber.toString(),
        examDate: examData.examDate,
        examTime: examData.examTime,
        examType: examData.examType,
      });
      
      setShowConfirmation(true);
    } catch (error) {
      console.error("Erro ao agendar prova:", error);
      throw error; // Re-throw to be caught by ExamForm
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
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
        examDate={formData.examDate}
        examTime={formData.examTime}
        examType={formData.examType}
        onClose={handleConfirmationClose}
      />
    </PageLayout>
  );
};

export default ScheduleExam;
