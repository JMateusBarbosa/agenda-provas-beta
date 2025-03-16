
import { ExamSchedule } from './types';

// Helper to generate today's date
const today = new Date();
today.setHours(0, 0, 0, 0);

// Helper to generate a date a few days from today
const getFutureDate = (daysToAdd: number): Date => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysToAdd);
  return date;
}

// Helper to generate a date a few days before today
const getPastDate = (daysToSubtract: number): Date => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysToSubtract);
  return date;
}

// Sample exam schedules with varied dates to demonstrate the different states
export const sampleExamSchedules: ExamSchedule[] = [
  {
    id: '1',
    studentName: 'Ana Silva',
    module: 'Programação Web',
    pcNumber: 5,
    examDate: today,
    examTime: '8:30',
    examType: 'P1',
    status: 'Pendente'
  },
  {
    id: '2',
    studentName: 'Pedro Santos',
    module: 'Algoritmos',
    pcNumber: 8,
    examDate: today,
    examTime: '14:00',
    examType: 'Rec.1',
    status: 'Pendente'
  },
  {
    id: '3',
    studentName: 'Carla Oliveira',
    module: 'Banco de Dados',
    pcNumber: 3,
    examDate: getFutureDate(1),
    examTime: '15:00',
    examType: 'P1',
    status: 'Pendente'
  },
  {
    id: '4',
    studentName: 'João Pereira',
    module: 'Redes de Computadores',
    pcNumber: 10,
    examDate: getPastDate(1),
    examTime: '9:30',
    examType: 'P1',
    status: 'Aprovado'
  },
  {
    id: '5',
    studentName: 'Mariana Costa',
    module: 'Inteligência Artificial',
    pcNumber: 7,
    examDate: getPastDate(2),
    examTime: '16:00',
    examType: 'Rec.2',
    status: 'Reprovado'
  },
  {
    id: '6',
    studentName: 'Lucas Mendes',
    module: 'Segurança da Informação',
    pcNumber: 12,
    examDate: today,
    examTime: '17:00',
    examType: 'P1',
    status: 'Pendente'
  },
  {
    id: '7',
    studentName: 'Fernanda Lima',
    module: 'Computação Gráfica',
    pcNumber: 9,
    examDate: getFutureDate(2),
    examTime: '8:30',
    examType: 'P1',
    status: 'Pendente'
  },
  {
    id: '8',
    studentName: 'Rafael Souza',
    module: 'Sistemas Operacionais',
    pcNumber: 4,
    examDate: getFutureDate(3),
    examTime: '14:00',
    examType: 'Rec.1',
    status: 'Pendente'
  },
  {
    id: '9',
    studentName: 'Juliana Alves',
    module: 'Desenvolvimento Mobile',
    pcNumber: 6,
    examDate: getPastDate(3),
    examTime: '15:00',
    examType: 'P1',
    status: 'Aprovado'
  },
  {
    id: '10',
    studentName: 'Gabriel Rocha',
    module: 'Engenharia de Software',
    pcNumber: 11,
    examDate: getPastDate(4),
    examTime: '9:30',
    examType: 'Rec.2',
    status: 'Reprovado'
  }
];

// Available time slots for exams
export const timeSlots = [
  '7:30', '8:30', '9:30', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

// Available PC numbers
export const pcNumbers = Array.from({ length: 14 }, (_, i) => (i + 1).toString());
