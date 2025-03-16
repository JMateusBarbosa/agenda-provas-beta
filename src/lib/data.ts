
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



// Available time slots for exams
export const timeSlots = [
  '7:30', '8:30', '9:30', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

// Available PC numbers
export const pcNumbers = Array.from({ length: 14 }, (_, i) => (i + 1).toString());
