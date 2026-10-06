import { useRef } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { FileSpreadsheet, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PRESET_THEMES } from '../../data/themes';
import { UI_THEME } from '../../constants/uiThemeConfig';
import type { WeeklyScheduleConfig, ScheduleTheme } from '../../types/schedule';
import type { ImportStatus } from '../../hooks/useScheduleManager';

interface ScheduleSettingsProps {
  schedule: WeeklyScheduleConfig;
  onStartDateChange: (date: string) => void;
  onIncludeYearChange?: (include: boolean) => void;
  onThemeChange: (theme: ScheduleTheme) => void;
  onImportExcel?: (file: File) => void;
  onResetSchedule?: () => void;
  importStatus?: ImportStatus;
  paginationControls?: ReactNode;
  exportControls?: ReactNode;
}

export const ScheduleSettings = ({
  schedule,
  onStartDateChange,
  onIncludeYearChange,
  onThemeChange,
  onImportExcel,
  onResetSchedule,
  importStatus,
  paginationControls,
  exportControls,
}: ScheduleSettingsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportExcel) {
      onImportExcel(file);
    }
    e.target.value = '';
  };

  const isLoading = importStatus?.state === 'loading';

  return (
    <div className="w-full flex flex-col gap-3 pb-6 border-b border-[#252538]/60">
      
      {/* Input nativ ascuns pentru fișier */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col gap-3 w-full">
        
        {/* RÂNDUL 1: Data + Opțiunea de An (Desktop & Mobil) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Componenta 1: Data + Toggle An - Single Layer */}
          <div className="bg-[#151522] rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 flex-1 shadow-sm">
            <input
              type="date"
              value={schedule.startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={`w-full sm:w-auto flex-1 ${UI_THEME.radii.control} px-3.5 py-2 text-sm bg-[#101018] ${UI_THEME.text.primary} outline-none scheme-dark cursor-pointer text-center font-mono font-medium hover:bg-[#181824] transition-colors`}
            />

            <label className="flex items-center gap-2 px-3.5 py-2 bg-[#101018] rounded-xl cursor-pointer select-none text-xs font-semibold text-neutral-200 hover:bg-[#181824] transition-colors shrink-0">
              <span>+ An</span>
              <input
                type="checkbox"
                checked={Boolean(schedule.includeYear)}
                onChange={(e) => onIncludeYearChange?.(e.target.checked)}
                className="w-4 h-4 rounded bg-[#151522] accent-indigo-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Butoanele Import & Reset pe Desktop */}
          <div className="hidden md:flex bg-[#151522] rounded-2xl p-2.5 sm:p-3 items-center gap-2 shadow-sm">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              title="Încarcă orar din Excel (.xlsx)"
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#101018] hover:bg-[#1a1a2b] text-xs font-semibold text-neutral-200 transition cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isLoading ? 'Se încarcă...' : 'Import Excel'}</span>
            </button>

            <button
              type="button"
              onClick={onResetSchedule}
              title="Resetează programul la datele inițiale"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#101018] hover:bg-[#1a1a2b] text-xs font-semibold text-neutral-300 hover:text-amber-200 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* SECȚIUNEA 2: Culori pe Desktop / Rândurile 2-5 pe Mobil */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-3 items-stretch w-full">
          
          {/* Selectorul de Culori - Perfect centrat pe PC și aliniat pe mobil */}
          <div className="order-1 md:order-none md:col-span-4 bg-[#151522] rounded-2xl p-2.5 sm:p-3 flex items-center justify-center shadow-sm min-h-[64px] md:min-h-[84px]">
            <div
              className="flex flex-nowrap items-center justify-center gap-3 overflow-x-auto py-2.5 md:py-3.5 md:grid md:justify-center md:justify-items-center md:gap-x-4 md:gap-y-2 w-full md:w-auto"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(PRESET_THEMES.length / 2)}, minmax(0, auto))`,
              }}
            >
              {PRESET_THEMES.map((theme) => {
                const isSelected = schedule.theme.id === theme.id;
                return (
                  <div key={theme.id} className="py-1 px-0.5 flex items-center justify-center shrink-0">
                    <button
                      onClick={() => onThemeChange(theme)}
                      className={`w-5 h-5 rounded-full transition-all duration-150 hover:scale-115 cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#151522] scale-105'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: theme.backgroundColor }}
                      title={theme.name}
                      type="button"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBIL RÂNDUL 3: Import Excel + Reset (Vizibil doar pe mobil) */}
          <div className="order-2 md:hidden bg-[#151522] rounded-2xl p-2.5 flex items-center gap-2 shadow-sm">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              title="Încarcă orar din Excel (.xlsx)"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#101018] hover:bg-[#1a1a2b] text-xs font-semibold text-neutral-200 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isLoading ? 'Se încarcă...' : 'Import Excel'}</span>
            </button>

            <button
              type="button"
              onClick={onResetSchedule}
              title="Resetează programul la datele inițiale"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#101018] hover:bg-[#1a1a2b] text-xs font-semibold text-neutral-300 hover:text-amber-200 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>

          {/* MOBIL RÂNDUL 4 / DESKTOP: Coloana 2 - Slide-uri */}
          <div className="order-3 md:order-none md:col-span-4 bg-[#151522] rounded-2xl p-2.5 sm:p-3 flex items-center justify-center shadow-sm [&>*]:w-full">
            {paginationControls}
          </div>

          {/* MOBIL RÂNDUL 5 / DESKTOP: Coloana 3 - Export */}
          <div className="order-4 md:order-none md:col-span-4 bg-[#151522] rounded-2xl p-2.5 sm:p-3 flex items-center justify-center shadow-sm [&>*]:w-full">
            {exportControls}
          </div>

        </div>

      </div>

      {/* Banner de feedback */}
      {importStatus && importStatus.state !== 'idle' && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            importStatus.state === 'success'
              ? 'bg-emerald-950/60 text-emerald-200'
              : importStatus.state === 'error'
              ? 'bg-red-950/60 text-red-200'
              : 'bg-indigo-950/60 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.state === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {importStatus.state === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {importStatus.state === 'loading' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />}
            <span>{importStatus.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};