import type { DaySchedule } from '../types/schedule';

export interface SchedulePage {
  pageNumber: number;
  totalPages: number;
  days: DaySchedule[];
  totalEvents: number;
}

export function paginateScheduleDays(days: DaySchedule[]): SchedulePage[] {
  if (days.length === 0) return [];

  // Paginare fixă: Luni-Miercuri (primele 3) pe pagina 1, Joi-Duminică (următoarele 4) pe pagina 2.
  const page1Days = days.slice(0, 3);
  const page2Days = days.slice(3, 7);

  const pages = [page1Days, page2Days].filter(p => p.length > 0);

  return pages.map((pageDays, idx) => ({
    pageNumber: idx + 1,
    totalPages: pages.length,
    days: pageDays,
    totalEvents: pageDays.reduce((acc, d) => acc + d.events.length, 0),
  }));
}