import { format, addDays, parseISO, getDate } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { DaySchedule } from '../types/schedule';

export function generateWeekDaysFromStartDate(
  startDateStr: string,
  existingDays: DaySchedule[] = []
): DaySchedule[] {
  const startDate = parseISO(startDateStr);
  const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return dayIds.map((id, index) => {
    const currentDate = addDays(startDate, index);
    const existingDay = existingDays.find((d) => d.id === id);

    return {
      id,
      date: format(currentDate, 'yyyy-MM-dd'),
      dayName: format(currentDate, 'EEEE', { locale: ro }).toUpperCase(),
      dayNumber: getDate(currentDate),
      monthName: format(currentDate, 'MMMM', { locale: ro }),
      isEnabled: existingDay?.isEnabled ?? true,
      events: existingDay?.events ?? [],
    };
  });
}

export function formatPeriodHeader(startDateStr: string, endDateStr: string): string {
  try {
    const start = parseISO(startDateStr);
    const end = parseISO(endDateStr);
    return `${format(start, 'd MMM', { locale: ro })} - ${format(end, 'd MMM', { locale: ro })}`;
  } catch {
    return '';
  }
}

export function calculateWeekEndDate(startDateStr: string): string {
  try {
    return format(addDays(parseISO(startDateStr), 6), 'yyyy-MM-dd');
  } catch {
    return startDateStr;
  }
}