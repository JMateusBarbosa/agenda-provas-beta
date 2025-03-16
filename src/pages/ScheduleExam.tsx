
import React, { useState } from 'react';
import { examApi } from '@/lib/supabase-client';

import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ExamStatus, ExamType } from '@/lib/types';

const ScheduleExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [studentName, setStudentName] = useState('');
  const [module, setModule] = useState('');
  const [pcNumber, setPcNumber] = useState('');
  const [examDate, setExamDate] = useState<Date>(new Date());
  const [examTime, setExamTime] = useState('');
  const [examType, setExamType] = useState<ExamType>('P1');
  
  // Error states
  const [errors, setErrors] = useState({
    studentName: false,
    module: false,
    pcNumber: false,
    examTime: false,
  });

  const validateForm = () => {
    const newErrors = {
      studentName: !studentName,
      module: !module,
      pcNumber: !pcNumber,
      examTime: !examTime,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const resetForm = () => {
    setStudentName('');
    setModule('');
    setPcNumber('');
    setExamDate(new Date());
    setExamTime('');
    setExamType('P1');
    setErrors({
      studentName: false,
      module: false,
      pcNumber: false,
      examTime: false,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Formulário inválido",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Cria o novo exame utilizando a API do Supabase definida em examApi
      const newExam = await examApi.createExam({
        studentName,
        module,
        pcNumber: Number(pcNumber), // Certifique-se de enviar um número se for esse o tipo
        examDate, // A função toSupabaseExam fará a conversão para ISO
        examTime,
        examType,
        status: "Pendente", // Ou o status padrão que você deseja
      });
      
      toast({
        title: "Agendamento realizado",
        description: "A prova foi agendada com sucesso!",
        variant: "default", // Veja o próximo item para correção do variant
      });
      
      setIsSaving(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao agendar a prova.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    //navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 container pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg border border-border p-6 animate-fade-up">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-navy mb-2">Agendar Nova Prova</h1>
            <p className="text-gray-600">
              Preencha todos os campos obrigatórios para criar um novo agendamento de prova.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-navy font-medium">
                Nome do Aluno <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentName"
                placeholder="Digite o nome completo do aluno"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={`filter-input ${errors.studentName ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.studentName && (
                <p className="text-red-500 text-sm">Preencha este campo!</p>
              )}
            </div>
            
            {/* Module */}
            <div className="space-y-2">
              <Label htmlFor="module" className="text-navy font-medium">
                Módulo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="module"
                placeholder="Digite o nome do módulo"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className={`filter-input ${errors.module ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.module && (
                <p className="text-red-500 text-sm">Preencha este campo!</p>
              )}
            </div>
            
            {/* PC Number */}
            <div className="space-y-2">
              <Label htmlFor="pcNumber" className="text-navy font-medium">
                Número do PC <span className="text-red-500">*</span>
              </Label>
              <Select
                value={pcNumber}
                onValueChange={setPcNumber}
              >
                <SelectTrigger 
                  id="pcNumber" 
                  className={`filter-input ${errors.pcNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <SelectValue placeholder="Selecione o número do PC" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 14 }).map((_, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      PC {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pcNumber && (
                <p className="text-red-500 text-sm">Preencha este campo!</p>
              )}
            </div>
            
            {/* Exam Date */}
            <div className="space-y-2">
              <Label htmlFor="examDate" className="text-navy font-medium">
                Data da Prova <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="filter-input w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {examDate ? (
                      format(examDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={examDate}
                    onSelect={(date) => date && setExamDate(date)}
                    initialFocus
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Exam Time */}
            <div className="space-y-2">
              <Label htmlFor="examTime" className="text-navy font-medium">
                Horário <span className="text-red-500">*</span>
              </Label>
              <Select
                value={examTime}
                onValueChange={setExamTime}
              >
                <SelectTrigger 
                  id="examTime" 
                  className={`filter-input ${errors.examTime ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {['7:30', '8:30', '9:30', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.examTime && (
                <p className="text-red-500 text-sm">Preencha este campo!</p>
              )}
            </div>
            
            {/* Exam Type */}
            <div className="space-y-2">
              <Label htmlFor="examType" className="text-navy font-medium">
                Tipo da Prova <span className="text-red-500">*</span>
              </Label>
              <Select
                value={examType}
                onValueChange={(value) => setExamType(value as ExamType)}
              >
                <SelectTrigger id="examType" className="filter-input">
                  <SelectValue placeholder="Selecione o tipo da prova" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="Rec.1">Rec.1</SelectItem>
                  <SelectItem value="Rec.2">Rec.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Form Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                type="submit"
                className="bg-navy text-white hover:bg-opacity-90 transition-colors flex-1"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Agendamento
                  </>
                )}
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-300 transition-colors flex-1"
                onClick={resetForm}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
              <Button 
                type="button"
                className="bg-failed text-white hover:bg-opacity-90 transition-colors flex-1"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="bg-navy text-white py-4 text-center text-sm">
        © 2025 Sistema de Agendamento de Provas - Todos os direitos reservados.
      </footer>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendamento Realizado</DialogTitle>
            <DialogDescription>
              A prova foi agendada com sucesso!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between">
              <span className="font-medium">Aluno:</span>
              <span>{studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Módulo:</span>
              <span>{module}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">PC:</span>
              <span>{pcNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Data:</span>
              <span>{examDate ? format(examDate, "dd/MM/yyyy") : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Horário:</span>
              <span>{examTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tipo:</span>
              <span>{examType}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmationClose}>Ok</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleExam;
