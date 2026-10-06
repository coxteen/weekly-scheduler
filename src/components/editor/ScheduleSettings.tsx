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
    <div className="w-full flex flex-col gap-3 border-b border-[#252538] pb-6">
      
      {/* Input nativ ascuns pentru fișier */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col gap-3 w-full">
        
        {/* RÂNDUL 1 PE DESKTOP (Data+An în stânga, Butoane Acțiuni în dreapta) / PE MOBIL: Rând 1 (Data+An) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Componenta 1: Data + Opțiunea de An */}
          <div className="order-1 bg-[#151522] border border-[#252538] rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 flex-1 shadow-sm">
            <input
              type="date"
              value={schedule.startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={`w-full sm:w-auto flex-1 border border-[#2E2E44] ${UI_THEME.radii.control} px-3.5 py-2 text-sm ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus} scheme-dark cursor-pointer text-center font-mono font-medium`}
            />

            <label className="flex items-center gap-2 px-3.5 py-2 bg-[#101018] border border-[#222234] rounded-xl cursor-pointer select-none text-xs font-semibold text-neutral-200 hover:border-[#383852] transition-colors shrink-0">
              <span>+ An</span>
              <input
                type="checkbox"
                checked={Boolean(schedule.includeYear)}
                onChange={(e) => onIncludeYearChange?.(e.target.checked)}
                className="w-4 h-4 rounded bg-[#181824] border-[#333348] accent-indigo-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Componenta 2: Butoanele Import Excel & Reset (afișate pe desktop aici) */}
          <div className="hidden md:flex bg-[#151522] border border-[#252538] rounded-2xl p-2 sm:p-2.5 items-center gap-2 shadow-sm">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              title="Încarcă orar din Excel (.xlsx)"
              className="flex items-center justify-center gap-2 px-3.5 py-2 border border-[#2E2E44] rounded-xl bg-[#101018] hover:bg-[#1a1a2b] hover:border-emerald-600/50 active:scale-98 text-xs font-semibold text-neutral-200 transition cursor-pointer disabled:opacity-50 shrink-0"
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
              className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#2E2E44] rounded-xl bg-[#101018] hover:bg-[#1a1a2b] hover:border-amber-600/50 active:scale-98 text-xs font-semibold text-neutral-300 hover:text-amber-200 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* MOBIL RÂNDUL 2: Culorile + Import + Reset / DESKTOP: Culorile ocupă prima coloană */}
        <div className="order-2 flex flex-col md:grid md:grid-cols-12 gap-3 items-stretch w-full">
          
          <div className="md:col-span-4 flex items-stretch gap-2.5 w-full">
            {/* Culori pe două rânduri */}
            <div className="flex-1 bg-[#151522] border border-[#252538] rounded-2xl p-2.5 sm:p-3 flex items-center justify-center shadow-sm">
              <div className="bg-[#101018] p-2 rounded-xl border border-[#222234] flex items-center justify-center w-full">
                <div 
                  className="grid gap-2 justify-items-center"
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
            </div>

            {/* Butoanele de Import & Reset pe mobil */}
            <div className="md:hidden bg-[#151522] border border-[#252538] rounded-2xl p-2 flex items-center gap-1.5 shadow-sm">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                title="Încarcă orar din Excel (.xlsx)"
                className="h-full flex items-center justify-center gap-1.5 px-2.5 py-2 border border-[#2E2E44] rounded-xl bg-[#101018] hover:bg-[#1a1a2b] hover:border-emerald-600/50 active:scale-98 text-xs font-semibold text-neutral-200 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                )}
                <span>Import</span>
              </button>

              <button
                type="button"
                onClick={onResetSchedule}
                title="Resetează programul la datele de bază"
                className="h-full flex items-center justify-center p-2 border border-[#2E2E44] rounded-xl bg-[#101018] hover:bg-[#1a1a2b] hover:border-amber-600/50 active:scale-98 text-neutral-300 hover:text-amber-200 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* RÂNDUL 3 PE MOBIL: Slide-uri */}
          <div className="order-3 md:order-none md:col-span-4 bg-[#151522] border border-[#252538] rounded-2xl p-2.5 sm:p-3 flex items-center justify-center shadow-sm [&>*]:w-full">
            {paginationControls}
          </div>

          {/* RÂNDUL 4 PE MOBIL: Export */}
          <div className="order-4 md:order-none md:col-span-4 bg-[#151522] border border-[#252538] rounded-2xl p-2.5 sm:p-3 flex items-center justify-center shadow-sm [&>*]:w-full">
            {exportControls}
          </div>

        </div>

      </div>

      {/* Banner de feedback */}
      {importStatus && importStatus.state !== 'idle' && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
            importStatus.state === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : importStatus.state === 'error'
              ? 'bg-red-950/40 border-red-800 text-red-200'
              : 'bg-indigo-950/40 border-indigo-800 text-indigo-200'
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