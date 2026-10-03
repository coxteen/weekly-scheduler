import type { DaySchedule } from '../types/schedule';

export interface SchedulePage {
  pageNumber: number;
  totalPages: number;
  days: DaySchedule[];
  totalEvents: number;
}

const MAX_EVENTS_PER_PAGE = 9;

export function paginateScheduleDays(days: DaySchedule[]): SchedulePage[] {
  const activeDays = days.filter((d) => d.isEnabled);

  if (activeDays.length === 0) {
    return [{ pageNumber: 1, totalPages: 1, days: [], totalEvents: 0 }];
  }

  const pages: DaySchedule[][] = [];
  let currentPageDays: DaySchedule[] = [];
  let currentCount = 0;

  for (const day of activeDays) {
    const dayEventsCount = day.events.length;

    if (currentCount + dayEventsCount > MAX_EVENTS_PER_PAGE && currentPageDays.length > 0) {
      pages.push(currentPageDays);
      currentPageDays = [day];
      currentCount = dayEventsCount;
    } else {
      currentPageDays.push(day);
      currentCount += dayEventsCount;
    }
  }

  if (currentPageDays.length > 0) {
    pages.push(currentPageDays);
  }

  const totalPages = pages.length;

  return pages.map((pageDays, idx) => ({
    pageNumber: idx + 1,
    totalPages,
    days: pageDays,
    totalEvents: pageDays.reduce((acc, d) => acc + d.events.length, 0),
  }));
}