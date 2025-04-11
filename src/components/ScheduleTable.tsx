
import React, { useState } from 'react';
import { isSameDay } from 'date-fns';
import TableRow from './TableRow';
import DeleteConfirmation from './DeleteConfirmation';
import { ExamSchedule } from '@/lib/types';

/**
 * Interface para as props do componente ScheduleTable
 */
interface ScheduleTableProps {
  exams: ExamSchedule[];                                          // Lista de exames a exibir
  onUpdate: (id: string, updatedExam: Partial<ExamSchedule>) => void;  // Função para atualizar um exame
  onDelete: (id: string) => void;                                 // Função para excluir um exame
}

/**
 * Componente de Tabela de Agendamentos
 * 
 * Exibe uma tabela com os agendamentos de exames e
 * fornece funcionalidades para atualizar e excluir exames.
 */
const ScheduleTable: React.FC<ScheduleTableProps> = ({ exams, onUpdate, onDelete }) => {
  // Estado para controlar o diálogo de confirmação de exclusão
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    examId: string;
    studentName: string;
  }>({
    isOpen: false,
    examId: '',
    studentName: '',
  });

  /**
   * Abre o diálogo de confirmação de exclusão
   * @param id ID do exame a excluir
   * @param studentName Nome do aluno para exibição
   */
  const openDeleteDialog = (id: string, studentName: string) => {
    setDeleteDialog({
      isOpen: true,
      examId: id,
      studentName,
    });
  };

  /**
   * Fecha o diálogo de confirmação de exclusão
   */
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      examId: '',
      studentName: '',
    });
  };

  /**
   * Confirma a exclusão do exame e fecha o diálogo
   */
  const confirmDelete = () => {
    onDelete(deleteDialog.examId);
    closeDeleteDialog();
  };

  // Data de hoje para identificar exames do dia atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Caso não haja exames, exibe mensagem informativa
  if (exams.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-lg border animate-fade-up">
        <div className="text-center text-gray-500">
          <p className="text-xl font-semibold mb-2">Nenhuma prova encontrada.</p>
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
      
      {/* Diálogo de confirmação de exclusão */}
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
