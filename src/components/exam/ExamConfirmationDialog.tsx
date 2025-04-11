
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ExamType } from '@/lib/types';

interface ExamConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  module: string;
  pcNumber: string;
  examDate: Date;
  examTime: string;
  examType: ExamType;
  onClose: () => void;
}

const ExamConfirmationDialog: React.FC<ExamConfirmationDialogProps> = ({
  open,
  onOpenChange,
  studentName,
  module,
  pcNumber,
  examDate,
  examTime,
  examType,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={onClose}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExamConfirmationDialog;
