import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppleEmojiPickerModal } from './AppleEmojiPickerModal';
import { ScheduleSettings } from './ScheduleSettings';
import { DayEditor } from './DayEditor';
import type { WeeklyScheduleConfig, ScheduleTheme, ScheduleEvent } from '../../types/schedule';

interface ScheduleEditorProps {
  schedule: WeeklyScheduleConfig;
  onStartDateChange: (date: string) => void;
  onIncludeYearChange?: (include: boolean) => void;
  onThemeChange: (theme: ScheduleTheme) => void;
  onUpdateEvent: (dayId: string, eventId: string, fields: Partial<ScheduleEvent>) => void;
  onAddEvent: (dayId: string) => void;
  onDeleteEvent: (dayId: string, eventId: string) => void;
  paginationControls?: ReactNode;
  exportControls?: ReactNode;
}

export const ScheduleEditor = ({
  schedule,
  onStartDateChange,
  onIncludeYearChange,
  onThemeChange,
  onUpdateEvent,
  onAddEvent,
  onDeleteEvent,
  paginationControls,
  exportControls,
}: ScheduleEditorProps) => {
  const [expandedDay, setExpandedDay] = useState<string | null>('mon');
  const [pickerTarget, setPickerTarget] = useState<{
    dayId: string;
    eventId: string;
    currentEmoji: string;
  } | null>(null);

  return (
    <div className="w-full flex flex-col gap-7">
      <ScheduleSettings
        schedule={schedule}
        onStartDateChange={onStartDateChange}
        onIncludeYearChange={onIncludeYearChange}
        onThemeChange={onThemeChange}
        paginationControls={paginationControls}
        exportControls={exportControls}
      />

      <div className="flex flex-col gap-4">
        {schedule.days.map((day) => (
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
        ))}
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