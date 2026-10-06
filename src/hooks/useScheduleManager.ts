import { useState, useEffect, useRef } from 'react';
import type { WeeklyScheduleConfig, ScheduleEvent, ScheduleTheme } from '../types/schedule';
import {
  generateWeekDaysFromStartDate,
  calculateWeekEndDate,
  getDefaultWeekStartDate,
} from '../utils/dateUtils';
import { parseExcelToSchedule } from '../utils/excelScheduleParser';
import rawData from '../data/mockSchedule.json';
import { PRESET_THEMES } from '../data/themes';

const STORAGE_KEY = 'zborhub_weekly_schedule_config';

export interface ImportStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export function useScheduleManager() {
  const getInitialSchedule = (): WeeklyScheduleConfig => {
    // 1. Verificăm mai întâi dacă avem salvat un program în localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as WeeklyScheduleConfig;
      }
    } catch (e) {
      console.error('Nu s-au putut încărca datele din localStorage:', e);
    }

    // 2. Fallback pe mockSchedule.json
    const defaultData = rawData as WeeklyScheduleConfig;
    const forestTheme = PRESET_THEMES.find((t) => t.id === 'forest') || defaultData.theme;
    const defaultStartDate = getDefaultWeekStartDate();
    const defaultEndDate = calculateWeekEndDate(defaultStartDate);
    const initialDays = generateWeekDaysFromStartDate(defaultStartDate, defaultData.days);

    return {
      ...defaultData,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      includeYear: false,
      days: initialDays,
      theme: forestTheme,
    };
  };

  const [schedule, setSchedule] = useState<WeeklyScheduleConfig>(getInitialSchedule);

  const [importStatus, setImportStatus] = useState<ImportStatus>({
    state: 'idle',
    message: '',
  });

  // Salvare automată în localStorage la orice actualizare de stare
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    } catch (e) {
      console.error('Eroare la salvarea în localStorage:', e);
    }
  }, [schedule]);

  const scheduleRef = useRef(schedule);
  scheduleRef.current = schedule;

  const importFromExcel = async (file: File): Promise<void> => {
  setImportStatus({ state: 'loading', message: `Se procesează "${file.name}"...` });

  try {
    const buffer = await file.arrayBuffer();

    // 1. Parsăm fișierul folosind starea garantat actuală din ref
    const currentSchedule = scheduleRef.current;
    const parsed = await parseExcelToSchedule(buffer, currentSchedule);

    // 2. Garantăm ID-uri unice pentru fiecare eveniment
    const sanitizedDays = parsed.days.map((day) => ({
      ...day,
      events: day.events.map((ev, idx) => ({
        ...ev,
        id: ev.id && typeof ev.id === 'string' && ev.id.trim() !== ''
          ? ev.id.trim()
          : `ev-${day.id}-${idx}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      })),
    }));

    const totalEvents = sanitizedDays.reduce((sum, d) => sum + d.events.length, 0);

    if (totalEvents === 0) {
      setImportStatus({
        state: 'error',
        message: 'Fișierul a fost citit, dar nu conține ateliere detectabile.',
      });
      return;
    }

    // 3. Păstrăm tema și setările de dată curente, actualizând doar zilele importate
    const sanitizedSchedule: WeeklyScheduleConfig = {
      ...currentSchedule,
      ...parsed,
      days: sanitizedDays,
      // Ne asigurăm că tema și setările selectate de utilizator nu sunt suprascrise eronat
      theme: currentSchedule.theme,
      startDate: currentSchedule.startDate,
      endDate: currentSchedule.endDate,
      includeYear: currentSchedule.includeYear,
    };

    // 4. Actualizare atomică
    setSchedule(sanitizedSchedule);

    setImportStatus({
      state: 'success',
      message: `S-au importat și salvat cu succes ${totalEvents} evenimente!`,
    });

    setTimeout(() => {
      setImportStatus((prev) => (prev.state === 'success' ? { state: 'idle', message: '' } : prev));
    }, 3500);

  } catch (error) {
    console.error('[Excel Import Error]:', error);
    setImportStatus({
      state: 'error',
      message: error instanceof Error ? error.message : 'Eroare la parsarea fișierului.',
    });
  }
};

  // Resetare completă la mockSchedule.json
  const resetToDefaultSchedule = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Eroare la curățarea localStorage:', e);
    }

    const defaultData = rawData as WeeklyScheduleConfig;
    const forestTheme = PRESET_THEMES.find((t) => t.id === 'forest') || defaultData.theme;
    const defaultStartDate = getDefaultWeekStartDate();
    const defaultEndDate = calculateWeekEndDate(defaultStartDate);
    const initialDays = generateWeekDaysFromStartDate(defaultStartDate, defaultData.days);

    const freshSchedule: WeeklyScheduleConfig = {
      ...defaultData,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      includeYear: false,
      days: initialDays,
      theme: forestTheme,
    };

    setSchedule(freshSchedule);
    setImportStatus({
      state: 'success',
      message: 'Programul a fost resetat la datele de bază!',
    });

    setTimeout(() => {
      setImportStatus((prev) => (prev.state === 'success' ? { state: 'idle', message: '' } : prev));
    }, 3000);
  };

  const handleStartDateChange = (newStartDate: string) => {
    setSchedule((prev) => {
      const updatedDays = generateWeekDaysFromStartDate(newStartDate, prev.days);
      const newEndDate = calculateWeekEndDate(newStartDate);

      return {
        ...prev,
        startDate: newStartDate,
        endDate: newEndDate,
        days: updatedDays,
      };
    });
  };

  const handleIncludeYearToggle = (include: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      includeYear: include,
    }));
  };

  const handleThemeChange = (theme: ScheduleTheme) => {
    setSchedule((prev) => ({
      ...prev,
      theme,
    }));
  };

  const updateEvent = (dayId: string, eventId: string, updatedFields: Partial<ScheduleEvent>) => {
  setSchedule((prev) => ({
    ...prev,
    days: prev.days.map((day) => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        events: day.events.map((ev) =>
          ev.id === eventId ? { ...ev, ...updatedFields } : ev
        ),
      };
    }),
  }));
};

  const addEvent = (dayId: string) => {
    const newEvent: ScheduleEvent = {
      id: `e-${Date.now()}`,
      title: 'Atelier Nou',
      feature: 'detalii atelier',
      time: '18:00 - 19:30',
      emoji: '✨',
    };

    setSchedule((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId ? { ...day, events: [...day.events, newEvent] } : day
      ),
    }));
  };

  const deleteEvent = (dayId: string, eventId: string) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId
          ? { ...day, events: day.events.filter((ev) => ev.id !== eventId) }
          : day
      ),
    }));
  };

  return {
    schedule,
    importStatus,
    importFromExcel,
    resetToDefaultSchedule,
    handleStartDateChange,
    handleIncludeYearToggle,
    handleThemeChange,
    updateEvent,
    addEvent,
    deleteEvent,
  };
}