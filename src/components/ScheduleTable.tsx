
import React, { useState } from 'react';
import { isSameDay } from 'date-fns';
import TableRow from './TableRow';
import DeleteConfirmation from './DeleteConfirmation';
import { ExamSchedule } from '@/lib/types';

interface ScheduleTableProps {
  exams: ExamSchedule[];
  onUpdate: (id: string, updatedExam: Partial<ExamSchedule>) => void;
  onDelete: (id: string) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ exams, onUpdate, onDelete }) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    examId: string;
    studentName: string;
  }>({
    isOpen: false,
    examId: '',
    studentName: '',
  });

  const openDeleteDialog = (id: string, studentName: string) => {
    setDeleteDialog({
      isOpen: true,
      examId: id,
      studentName,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      examId: '',
      studentName: '',
    });
  };

  const confirmDelete = () => {
    onDelete(deleteDialog.examId);
    closeDeleteDialog();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (exams.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-lg border animate-fade-up">
        <div className="text-center text-gray-500">
          <p className="text-xl font-semibold mb-2">Nenhuma prova encontrada .</p>
          <p className="text-sm">Tente ajustar os filtros ou agendar uma nova prova.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container animate-fade-up">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-navy text-white">
              <th className="px-4 py-3 text-left font-semibold">Nome do Aluno</th>
              <th className="px-4 py-3 text-left font-semibold">Módulo</th>
              <th className="px-4 py-3 text-center font-semibold">PC</th>
              <th className="px-4 py-3 text-center font-semibold">Data</th>
              <th className="px-4 py-3 text-center font-semibold">Horário</th>
              <th className="px-4 py-3 text-center font-semibold">Tipo</th>
              <th className="px-4 py-3 text-center font-semibold">Estado</th>
              <th className="px-4 py-3 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <TableRow
                key={exam.id}
                exam={exam}
                isToday={isSameDay(exam.examDate, today)}
                onUpdate={onUpdate}
                onDelete={(id) => openDeleteDialog(id, exam.studentName)}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <DeleteConfirmation
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        examId={deleteDialog.examId}
        studentName={deleteDialog.studentName}
      />
    </div>
  );
};

export default ScheduleTable;
