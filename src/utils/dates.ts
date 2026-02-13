// utils/dates.ts
import { format, addDays } from 'date-fns';

/**
 * Combina uma Date (apenas data usada) e uma string de horário ("7:30"|"14:00")
 * assumindo fuso de Manaus (UTC-4) e retorna ISO string em UTC (timestamptz).
 */
export function makeExamTsFromDateAndTime(date: Date, timeStr: string): string {
  const yyyyMMdd = format(date, 'yyyy-MM-dd');

  // normalizar timeStr para HH:mm:ss
  const parts = (timeStr || '00:00').split(':').map(p => p.padStart(2, '0'));
  const hh = parts[0] ?? '00';
  const mm = parts[1] ?? '00';
  const ss = parts[2] ?? '00';
  const localIso = `${yyyyMMdd}T${hh}:${mm}:${ss}-04:00`; // Manaus = -04:00

  // new Date(localIso) converte para UTC internamente; toISOString() produz formato aceito pelo Postgres
  return new Date(localIso).toISOString();
}

/**
 * Retorna início e fim do dia (intervalo) no fuso Manaus, já em ISO UTC,
 * para usar em filtros por dia: [startIso, endIso)
 */
export function dayIntervalIsoForDate(date: Date): { startIso: string; endIso: string } {
  const yyyyMMdd = format(date, 'yyyy-MM-dd');
  const startLocal = `${yyyyMMdd}T00:00:00-04:00`;
  // usar addDays para garantir mudança de mês/ano correta
  const tomorrow = addDays(date, 1);
  const yyyyMMdd2 = format(tomorrow, 'yyyy-MM-dd');
  const endLocal = `${yyyyMMdd2}T00:00:00-04:00`;

  return {
    startIso: new Date(startLocal).toISOString(),
    endIso: new Date(endLocal).toISOString(),
  };
}
