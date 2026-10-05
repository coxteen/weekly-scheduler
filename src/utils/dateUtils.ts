import {
  format,
  addDays,
  parseISO,
  getDate,
  isMonday,
  nextMonday,
  isSameMonth,
  isSameYear,
  getYear,
} from 'date-fns';
import { ro } from 'date-fns/locale';
import type { DaySchedule } from '../types/schedule';

export function getDefaultWeekStartDate(): string {
  const today = new Date();
  const targetDate = isMonday(today) ? today : nextMonday(today);
  return format(targetDate, 'yyyy-MM-dd');
}

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

export function formatPeriodHeader(
  startDateStr: string,
  endDateStr: string,
  includeYear: boolean = false
): string {
  try {
    const start = parseISO(startDateStr);
    const end = parseISO(endDateStr);

    const startDay = getDate(start);
    const endDay = getDate(end);
    const startMonth = format(start, 'MMMM', { locale: ro }).toUpperCase();
    const endMonth = format(end, 'MMMM', { locale: ro }).toUpperCase();
    const startYear = getYear(start);
    const endYear = getYear(end);

    const sameMonth = isSameMonth(start, end);
    const sameYear = isSameYear(start, end);

    if (sameMonth) {
      const yearPart = includeYear ? ` ${endYear}` : '';
      return `${startDay} - ${endDay} ${endMonth}${yearPart}`;
    }

    if (includeYear) {
      if (sameYear) {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
      }
      return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    }

    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
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