import { useState } from 'react';
import type { WeeklyScheduleConfig, ScheduleEvent, ScheduleTheme } from '../types/schedule';
import { generateWeekDaysFromStartDate, calculateWeekEndDate } from '../utils/dateUtils';
import rawData from '../data/mockSchedule.json';
import { PRESET_THEMES } from '../data/themes';

export function useScheduleManager() {
  const [schedule, setSchedule] = useState<WeeklyScheduleConfig>(() => {
    const defaultData = rawData as WeeklyScheduleConfig;
    const forestTheme = PRESET_THEMES.find((t) => t.id === 'forest') || defaultData.theme;

    return {
      ...defaultData,
      theme: forestTheme,
    };
  });

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

  const toggleDayEnabled = (dayId: string) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId ? { ...day, isEnabled: !day.isEnabled } : day
      ),
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
    handleStartDateChange,
    toggleDayEnabled,
    handleThemeChange,
    updateEvent,
    addEvent,
    deleteEvent,
  };
}