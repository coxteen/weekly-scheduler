import { PRESET_THEMES } from '../../data/themes';
import { UI_THEME } from '../../constants/uiThemeConfig';
import { Calendar, Palette } from 'lucide-react';
import type { WeeklyScheduleConfig, ScheduleTheme } from '../../types/schedule';

interface ScheduleSettingsProps {
  schedule: WeeklyScheduleConfig;
  onStartDateChange: (date: string) => void;
  onThemeChange: (theme: ScheduleTheme) => void;
  onToggleDay: (dayId: string) => void;
}

export const ScheduleSettings = ({
  schedule,
  onStartDateChange,
  onThemeChange,
  onToggleDay,
}: ScheduleSettingsProps) => {
  return (
    <div className="flex flex-col gap-6 border-b border-[#252538] pb-6">
      <h3 className={`text-base font-bold ${UI_THEME.text.primary} flex items-center gap-2.5`}>
        <Calendar className="w-4 h-4 text-indigo-400" />
        Configurare Săptămână & Temă
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        <div className="md:col-span-5 flex flex-col justify-between gap-2">
          <label className={`flex flex-col gap-2 text-xs font-semibold ${UI_THEME.text.secondary}`}>
            Dată început (Luni):
            <input
              type="date"
              value={schedule.startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={`border border-[#2E2E44] ${UI_THEME.radii.control} px-3.5 py-2.5 text-sm ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus} scheme-dark`}
            />
          </label>
          <div className="text-[11px] text-neutral-500 italic mt-auto">
            Perioada este calculată automat pentru întreaga săptămână.
          </div>
        </div>

        <div className={`md:col-span-7 flex flex-col gap-2 text-xs font-semibold ${UI_THEME.text.secondary}`}>
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" /> Alege Culoarea Predominantă:
          </span>
          <div className="w-full h-full min-h-[85px] bg-[#181825] p-3 rounded-xl border border-[#26263A] flex items-center justify-center">
            <div
              className="grid grid-flow-row auto-rows-max gap-3 justify-items-center"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(PRESET_THEMES.length / 2)}, minmax(0, 1fr))`,
                maxWidth: '380px',
                width: '100%',
              }}
            >
              {PRESET_THEMES.map((theme) => {
                const isSelected = schedule.theme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme)}
                    className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${
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
      </div>

      <div className="flex flex-col gap-3">
        <span className={`text-xs font-bold uppercase tracking-wider text-center ${UI_THEME.text.secondary}`}>
          Zile Incluse în Program
        </span>
        <div className="flex justify-center w-full">
          <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-[420px]">
            {schedule.days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => onToggleDay(day.id)}
                className={`min-w-[85px] px-3 py-2 ${UI_THEME.radii.control} text-xs font-semibold text-center transition-all cursor-pointer border ${
                  day.isEnabled
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-xs'
                    : 'bg-[#191926] border-[#29293E] text-neutral-500 line-through hover:bg-[#222234]'
                }`}
              >
                {day.dayName.substring(0, 3)} ({day.dayNumber})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};