
import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import ScheduleTable from '@/components/ScheduleTable';
import FilterBar from '@/components/FilterBar';
import Navbar from '@/components/Navbar';
import ExamPagination from '@/components/ExamPagination';
//import { sampleExamSchedules } from '@/lib/data';
import { examApi } from '@/lib/supabase-client';
import { ExamSchedule, FilterState, ExamStatus } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamSchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    studentName: '',
    module: '',
    pcNumber: '',
    examDate: null,
    examTime: '',
    status: 'all'
  });
  
  useEffect(() => {
    async function loadExams() {
      try {
        const data = await examApi.getExams();
        setExams(data);
        console.log('Exames carregados no estado:', data);
      } catch (error) {
        console.error('Erro ao buscar exames:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os agendamentos.",
          variant: "destructive",
        });
      }
    }
    loadExams();
  }, []);
  

  // Apply filters to exams and sort by today's exams first
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
    
    // Sort exams with today's exams displayed first
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    result.sort((a, b) => {
      const aIsToday = isSameDay(a.examDate, today);
      const bIsToday = isSameDay(b.examDate, today);
      
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;
      
      // If both are today or both are not today, sort by date
      return a.examDate.getTime() - b.examDate.getTime();
    });
    
    setFilteredExams(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, exams]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Handle status update
  const handleUpdateExam = async (id: string, updatedExam: Partial<ExamSchedule>) => {
    try {
      // Atualiza o exame no Supabase
      const updated = await examApi.updateExam(id, updatedExam);
  
      // Atualiza o estado local
      const updatedExams = exams.map(exam => 
        exam.id === id ? { ...exam, ...updated } : exam
      );
      setExams(updatedExams);
  
      toast({
        title: "Atualização realizada",
        description: "Os dados da prova foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive",
      });
      console.error("Erro ao atualizar o exame:", error);
    }
  };
  
  
  // Handle delete
  const handleDeleteExam = async (id: string) => {
    try {
      // Exclui o exame no Supabase
      await examApi.deleteExam(id);
  
      // Atualiza o estado local
      const updatedExams = exams.filter(exam => exam.id !== id);
      setExams(updatedExams);
  
      toast({
        title: "Prova excluída",
        description: "O agendamento da prova foi excluído com sucesso.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive",
      });
      console.error("Erro ao excluir o exame:", error);
    }
  };
  
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-center mb-8 text-navy">Agendamentos de Provas</h1>
        
        <div className="mb-6">
          <FilterBar 
            filters={filters}
            setFilters={setFilters}
          />
        </div>
        
        <ScheduleTable 
          exams={getCurrentPageItems()} 
          onUpdate={handleUpdateExam}
          onDelete={handleDeleteExam}
        />
        
        {filteredExams.length > ITEMS_PER_PAGE && (
          <ExamPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
