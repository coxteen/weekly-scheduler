import { useState } from 'react';
import { AppleEmojiPickerModal } from './AppleEmojiPickerModal';
import { ScheduleSettings } from './ScheduleSettings';
import { DayEditor } from './DayEditor';
import { UI_THEME } from '../../constants/uiThemeConfig';
import type { WeeklyScheduleConfig, ScheduleTheme, ScheduleEvent } from '../../types/schedule';

interface ScheduleEditorProps {
  schedule: WeeklyScheduleConfig;
  onStartDateChange: (date: string) => void;
  onToggleDay: (dayId: string) => void;
  onThemeChange: (theme: ScheduleTheme) => void;
  onUpdateEvent: (dayId: string, eventId: string, fields: Partial<ScheduleEvent>) => void;
  onAddEvent: (dayId: string) => void;
  onDeleteEvent: (dayId: string, eventId: string) => void;
}

export const ScheduleEditor = ({
  schedule,
  onStartDateChange,
  onToggleDay,
  onThemeChange,
  onUpdateEvent,
  onAddEvent,
  onDeleteEvent,
}: ScheduleEditorProps) => {
  const [expandedDay, setExpandedDay] = useState<string | null>('mon');
  const [pickerTarget, setPickerTarget] = useState<{
    dayId: string;
    eventId: string;
    currentEmoji: string;
  } | null>(null);

  const activeDays = schedule.days.filter((day) => day.isEnabled);

  const handleToggleDay = (dayId: string) => {
    if (expandedDay === dayId) {
      setExpandedDay(null);
    }
    onToggleDay(dayId);
  };

  return (
    <div className="w-full flex flex-col gap-7">
      <ScheduleSettings
        schedule={schedule}
        onStartDateChange={onStartDateChange}
        onThemeChange={onThemeChange}
        onToggleDay={handleToggleDay}
      />

      <div className="flex flex-col gap-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${UI_THEME.text.secondary}`}>
          Ateliere & Evenimente ({activeDays.length} {activeDays.length === 1 ? 'zi activă' : 'zile active'})
        </span>

        {activeDays.length === 0 ? (
          <div className={`p-6 border border-dashed border-[#2D2D42] ${UI_THEME.radii.card} text-center`}>
            <p className={`text-sm ${UI_THEME.text.muted}`}>
              Nu ai nicio zi selectată. Selectează cel puțin o zi din lista de sus pentru a adăuga ateliere.
            </p>
          </div>
        ) : (
          activeDays.map((day) => (
            <DayEditor
              key={day.id}
              day={day}
              isExpanded={expandedDay === day.id}
              onToggleExpand={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
              onAddEvent={onAddEvent}
              onUpdateEvent={onUpdateEvent}
              onDeleteEvent={onDeleteEvent}
              onOpenEmojiPicker={(dayId, eventId, currentEmoji) =>
                setPickerTarget({ dayId, eventId, currentEmoji })
              }
            />
          ))
        )}
      </div>

      {pickerTarget && (
        <AppleEmojiPickerModal
          isOpen={Boolean(pickerTarget)}
          currentEmoji={pickerTarget.currentEmoji}
          onClose={() => setPickerTarget(null)}
          onSelectEmoji={(selectedEmoji) => {
            onUpdateEvent(pickerTarget.dayId, pickerTarget.eventId, { emoji: selectedEmoji });
          }}
        />
      )}
    </div>
  );
};