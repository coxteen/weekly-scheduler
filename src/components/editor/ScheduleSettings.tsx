import { PRESET_THEMES } from '../../data/themes';
import { UI_THEME } from '../../constants/uiThemeConfig';
import type { WeeklyScheduleConfig, ScheduleTheme } from '../../types/schedule';
import type { ReactNode } from 'react';

interface ScheduleSettingsProps {
  schedule: WeeklyScheduleConfig;
  onStartDateChange: (date: string) => void;
  onIncludeYearChange?: (include: boolean) => void;
  onThemeChange: (theme: ScheduleTheme) => void;
  paginationControls?: ReactNode;
  exportControls?: ReactNode;
}

export const ScheduleSettings = ({
  schedule,
  onStartDateChange,
  onIncludeYearChange,
  onThemeChange,
  paginationControls,
  exportControls,
}: ScheduleSettingsProps) => {
  return (
    <div className="flex flex-col gap-6 border-b border-[#252538] pb-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 w-full items-stretch">
        
        <div className="flex flex-col gap-3 w-full h-full">
          <input
            type="date"
            value={schedule.startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={`w-full border border-[#2E2E44] ${UI_THEME.radii.control} px-4 py-2.5 text-sm ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus} scheme-dark text-center cursor-pointer`}
          />

          <label className="flex items-center justify-between px-3 py-1.5 bg-[#171724] border border-[#26263A] rounded-lg cursor-pointer select-none">
            <span className="text-xs text-neutral-300 font-medium">Include An</span>
            <input
              type="checkbox"
              checked={Boolean(schedule.includeYear)}
              onChange={(e) => onIncludeYearChange?.(e.target.checked)}
              className="w-4 h-4 rounded border-[#2E2E44] bg-[#121218] accent-indigo-600 cursor-pointer"
            />
          </label>

          <div className="w-full flex-1 bg-[#181825] p-3 rounded-xl border border-[#26263A] flex justify-center items-center shadow-inner">
            <div 
              className="grid gap-3 justify-items-center w-full"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(PRESET_THEMES.length / 2)}, minmax(0, 1fr))`,
              }}
            >
              {PRESET_THEMES.map((theme) => {
                const isSelected = schedule.theme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme)}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 cursor-pointer shrink-0 ${
                      isSelected ? 'border-white scale-110 ring-2 ring-indigo-500/60 shadow-md' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: theme.backgroundColor }}
                    title={theme.name}
                    type="button"
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full h-full">
          {paginationControls}
        </div>

        <div className="flex flex-col w-full h-full">
          {exportControls}
        </div>

      </div>
    </div>
  );
};