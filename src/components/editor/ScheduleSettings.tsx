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
    <div className="w-full flex flex-col gap-4 border-b border-[#252538] pb-6">
      {/* Grilă bazată pe 12 coloane pentru reglaj fin al lățimilor */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 w-full items-stretch">
        
        {/* Card 1: Dată, Teme & Include An -> 5 din 12 (ușor îngustat) */}
        <div className="md:col-span-5 bg-[#151522] border border-[#252538] rounded-2xl p-3 flex flex-col justify-between gap-2.5 shadow-inner">
          <input
            type="date"
            value={schedule.startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={`w-full border border-[#2E2E44] ${UI_THEME.radii.control} px-3 py-2 text-sm ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus} scheme-dark cursor-pointer text-center font-mono font-medium`}
          />

          <div className="grid grid-cols-2 gap-2.5 items-center">
            {/* Culori pe 2 rânduri */}
            <div className="bg-[#101018] p-2 rounded-xl border border-[#222234] flex items-center justify-center">
              <div 
                className="grid gap-2 justify-items-center w-full"
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
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-115 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#101018] scale-110'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: theme.backgroundColor }}
                      title={theme.name}
                      type="button"
                    />
                  );
                })}
              </div>
            </div>

            {/* Toggle Include An */}
            <label className="flex items-center justify-between px-3 py-3 bg-[#101018] border border-[#222234] rounded-xl cursor-pointer select-none text-xs font-semibold text-neutral-200 hover:border-[#383852] transition-colors">
              <span>+ An</span>
              <input
                type="checkbox"
                checked={Boolean(schedule.includeYear)}
                onChange={(e) => onIncludeYearChange?.(e.target.checked)}
                className="w-4 h-4 rounded bg-[#181824] border-[#333348] accent-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Card 2: Paginare Slide-uri -> 3 din 12 (mai lat și confortabil) */}
        <div className="md:col-span-3 bg-[#151522] border border-[#252538] rounded-2xl p-3 flex flex-col justify-center shadow-inner">
          {paginationControls}
        </div>

        {/* Card 3: Export -> 4 din 12 */}
        <div className="md:col-span-4 bg-[#151522] border border-[#252538] rounded-2xl p-3 flex flex-col justify-center shadow-inner">
          {exportControls}
        </div>

      </div>
    </div>
  );
};