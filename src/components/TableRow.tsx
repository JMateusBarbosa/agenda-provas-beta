
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExamSchedule, ExamStatus } from '@/lib/types';
import { timeSlots } from '@/lib/data';

interface TableRowProps {
  exam: ExamSchedule;
  isToday: boolean;
  onUpdate: (id: string, updatedExam: Partial<ExamSchedule>) => void;
  onDelete: (id: string) => void;
}

const TableRow: React.FC<TableRowProps> = ({ exam, isToday, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedExam, setUpdatedExam] = useState<Partial<ExamSchedule>>({});
  
  const handleEdit = () => {
    setUpdatedExam({});
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedExam({});
  };
  
  const handleSave = () => {
    if (Object.keys(updatedExam).length > 0) {
      onUpdate(exam.id, updatedExam);
    }
    setIsEditing(false);
  };
  
  const handleChange = (field: keyof ExamSchedule, value: any) => {
    setUpdatedExam(prev => ({ ...prev, [field]: value }));
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status: ExamStatus) => {
    switch (status) {
      case 'Pendente':
        return 'status-badge status-pending';
      case 'Aprovado':
        return 'status-badge status-approved';
      case 'Reprovado':
        return 'status-badge status-failed';
      default:
        return 'status-badge';
    }
  };
  
  // Get row background based on date
  const getRowClass = () => {
    if (isToday) {
      return "today-highlight table-row-hover";
    }
    return "table-row-hover";
  };

  return (
    <tr className={getRowClass()}>
      {/* Student Name */}
      <td className="px-4 py-3 border-b">
        {isEditing ? (
          <Input
            className="w-full border rounded px-2 py-1"
            defaultValue={exam.studentName}
            onChange={(e) => handleChange('studentName', e.target.value)}
          />
        ) : (
          exam.studentName
        )}
      </td>
      
      {/* Module */}
      <td className="px-4 py-3 border-b">
        {isEditing ? (
          <Input
            className="w-full border rounded px-2 py-1"
            defaultValue={exam.module}
            onChange={(e) => handleChange('module', e.target.value)}
          />
        ) : (
          exam.module
        )}
      </td>
      
      {/* PC Number */}
      <td className="px-4 py-3 text-center border-b">
        {isEditing ? (
          <Input
            className="w-20 text-center border rounded px-2 py-1 mx-auto"
            type="number"
            min="1"
            max="14"
            defaultValue={exam.pcNumber}
            onChange={(e) => handleChange('pcNumber', Number(e.target.value))}
          />
        ) : (
          exam.pcNumber
        )}
      </td>
      
      {/* Exam Date */}
      <td className="px-4 py-3 text-center border-b whitespace-nowrap">
        {isEditing ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-32">
                {updatedExam.examDate 
                  ? format(updatedExam.examDate, 'dd/MM/yyyy')
                  : format(exam.examDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={updatedExam.examDate || exam.examDate}
                onSelect={date => handleChange('examDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          format(exam.examDate, 'dd/MM/yyyy')
        )}
      </td>
      
      {/* Exam Time */}
      <td className="px-4 py-3 text-center border-b">
        {isEditing ? (
          <Select
            defaultValue={exam.examTime}
            onValueChange={(value) => handleChange('examTime', value)}
          >
            <SelectTrigger className="w-24 mx-auto">
              <SelectValue placeholder={exam.examTime} />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          exam.examTime
        )}
      </td>
      
      {/* Exam Type */}
      <td className="px-4 py-3 text-center border-b whitespace-nowrap">
        {isEditing ? (
          <Select
            value={updatedExam.examType || exam.examType}
            onValueChange={(value) => handleChange('examType', value)}
          >
            <SelectTrigger className="w-28 mx-auto">
              <SelectValue placeholder={exam.examType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="Rec.1">Rec.1</SelectItem>
              <SelectItem value="Rec.2">Rec.2</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          exam.examType
        )}
      </td>
      
      {/* Status */}
      <td className="px-4 py-3 text-center border-b">
        {isEditing ? (
          <Select
            defaultValue={exam.status}
            onValueChange={(value) => handleChange('status', value as ExamStatus)}
          >
            <SelectTrigger className="w-28 mx-auto">
              <SelectValue placeholder={exam.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Reprovado">Reprovado</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span className={getStatusBadgeClass(exam.status)}>
            {exam.status}
          </span>
        )}
      </td>
      
      {/* Actions */}
      <td className="px-4 py-3 text-center border-b space-x-1">
        {isEditing ? (
          <div className="flex justify-center space-x-1">
            <button 
              onClick={handleSave}
              className="text-white bg-approved hover:bg-opacity-90 rounded-md p-1.5 transition-all duration-200"
              title="Salvar"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={handleCancel}
              className="text-white bg-failed hover:bg-opacity-90 rounded-md p-1.5 transition-all duration-200"
              title="Cancelar"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-1">
            <button 
              onClick={handleEdit}
              className="button-edit"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={() => onDelete(exam.id)}
              className="button-delete"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
