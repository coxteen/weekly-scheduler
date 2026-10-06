import { useState, useEffect } from 'react';
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

  const importFromExcel = async (file: File): Promise<void> => {
    setImportStatus({ state: 'loading', message: `Se procesează "${file.name}"...` });

    try {
      const buffer = await file.arrayBuffer();
      const updatedSchedule = await parseExcelToSchedule(buffer, schedule);

      const totalEvents = updatedSchedule.days.reduce(
        (sum, day) => sum + day.events.length,
        0
      );

      setSchedule(updatedSchedule);

      if (totalEvents === 0) {
        setImportStatus({
          state: 'error',
          message: 'Fișierul a fost citit, dar nu s-au identificat evenimente valide.',
        });
      } else {
        setImportStatus({
          state: 'success',
          message: `S-au importat și salvat cu succes ${totalEvents} evenimente!`,
        });

        setTimeout(() => {
          setImportStatus((prev) => (prev.state === 'success' ? { state: 'idle', message: '' } : prev));
        }, 4000);
      }
    } catch (error) {
      console.error('[Excel Import Error]:', error);
      const errMsg = error instanceof Error ? error.message : 'Eroare la parsare.';
      setImportStatus({
        state: 'error',
        message: `Eroare la procesare: ${errMsg}`,
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