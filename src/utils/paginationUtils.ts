import type { DaySchedule } from '../types/schedule';

export type SlideCount = 1 | 2 | 3;

export interface SchedulePage {
  pageNumber: number;
  totalPages: number;
  days: DaySchedule[];
  totalEvents: number;
}

export function paginateScheduleDays(
  days: DaySchedule[],
  targetSlideCount: SlideCount = 2
): SchedulePage[] {
  if (days.length === 0) return [];

  let chunkedDays: DaySchedule[][] = [];

  switch (targetSlideCount) {
    case 2:
      chunkedDays = [days.slice(0, 3), days.slice(3, 7)];
      break;

    case 3:
      chunkedDays = [days.slice(0, 2), days.slice(2, 4), days.slice(4, 7)];
      break;

    default:
      chunkedDays = [days.slice(0, 3), days.slice(3, 7)];
  }

  const validPages = chunkedDays.filter((slice) => slice.length > 0);

  return validPages.map((pageDays, idx) => ({
    pageNumber: idx + 1,
    totalPages: validPages.length,
    days: pageDays,
    totalEvents: pageDays.reduce((acc, d) => acc + d.events.length, 0),
  }));
}