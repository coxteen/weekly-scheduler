export interface ScheduleEvent {
  id: string;
  title: string;
  feature: string;
  time: string;
  emoji: string;
}

export interface DaySchedule {
  id: string;
  date: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isEnabled: boolean;
  events: ScheduleEvent[];
}

export interface ScheduleTheme {
  id: string;
  name: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface WeeklyScheduleConfig {
  title: string;
  startDate: string;
  endDate: string;
  includeYear?: boolean;
  theme: ScheduleTheme;
  days: DaySchedule[];
}