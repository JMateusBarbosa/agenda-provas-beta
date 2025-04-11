
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Interface para as props do componente DeleteConfirmation
 */
interface DeleteConfirmationProps {
  isOpen: boolean;            // Controla se o diálogo está aberto
  onClose: () => void;        // Função chamada ao fechar o diálogo
  onConfirm: () => void;      // Função chamada ao confirmar a exclusão
  examId: string;             // ID do exame a ser excluído
  studentName: string;        // Nome do aluno para exibição na confirmação
}

/**
 * Componente de Confirmação de Exclusão
 * 
 * Exibe um diálogo modal para confirmar a exclusão de um agendamento de exame.
 * Mostra o nome do aluno e avisa que a ação não pode ser desfeita.
 */
const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  examId,
  studentName,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o agendamento da prova de <strong>{studentName}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-failed hover:bg-failed/90 text-white"
            onClick={onConfirm}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
