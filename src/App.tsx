import { useRef, useMemo, useState } from 'react';
import { useScheduleManager } from './hooks/useScheduleManager';
import { paginateScheduleDays } from './utils/paginationUtils';
import { ScheduleBoard } from './components/preview/ScheduleBoard';
import { ScheduleEditor } from './components/editor/ScheduleEditor';
import { ExportToolbar } from './components/preview/ExportToolbar';
import { PosterSettingsPanel } from './components/settings/PosterSettingsPanel';
import { DEFAULT_POSTER_SETTINGS } from './constants/posterThemeConfig';
import type { PosterCustomizableSettings } from './types/posterCustomizer';
import { UI_THEME } from './constants/uiThemeConfig';

export default function App() {
  const {
    schedule,
    handleStartDateChange,
    handleIncludeYearToggle,
    handleThemeChange,
    updateEvent,
    addEvent,
    deleteEvent,
  } = useScheduleManager();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [posterSettings, setPosterSettings] =
    useState<PosterCustomizableSettings>(DEFAULT_POSTER_SETTINGS);

  const boardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = useMemo(
    () => paginateScheduleDays(schedule.days),
    [schedule.days]
  );
  const safePageIndex = activePageIndex >= pages.length ? 0 : activePageIndex;

  const getBoardElements = () => {
    return boardRefs.current.filter((el): el is HTMLDivElement => el !== null);
  };

  const paginationControls =
    pages.length > 1 ? (
      <div className="flex flex-col bg-[#171724] border border-[#262638] rounded-lg overflow-hidden p-1 shadow-inner h-full">
        {pages.map((p, idx) => (
          <button
            key={p.pageNumber}
            type="button"
            onClick={() => setActivePageIndex(idx)}
            className={`flex-1 flex items-center justify-center py-2 px-2 text-xs font-bold transition-all cursor-pointer rounded-md ${
              safePageIndex === idx
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#202030]'
            }`}
          >
            Slide {idx + 1}
          </button>
        ))}
      </div>
    ) : null;

  const exportControls = (
    <ExportToolbar getBoardElements={getBoardElements} />
  );

  return (
    <div
      className={`min-h-screen ${UI_THEME.backgrounds.app} ${UI_THEME.text.primary} p-4 md:p-6 lg:p-8 flex justify-center`}
    >
      <main className="w-full max-w-[1750px] grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
        <section
          className={`xl:col-span-5 w-full ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.panel} ${UI_THEME.spacing.panelPadding} shadow-2xl`}
        >
          <ScheduleEditor
            schedule={schedule}
            onStartDateChange={handleStartDateChange}
            onIncludeYearChange={handleIncludeYearToggle}
            onThemeChange={handleThemeChange}
            onUpdateEvent={updateEvent}
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
            paginationControls={paginationControls}
            exportControls={exportControls}
          />
        </section>

        {/* Preview coloana centru */}
        <section className="xl:col-span-4 w-full flex justify-center sticky top-6">
          <div className="w-full flex justify-center">
            {pages[safePageIndex] && (
              <ScheduleBoard
                ref={(el) => {
                  boardRefs.current[safePageIndex] = el;
                }}
                config={schedule}
                page={pages[safePageIndex]}
                settings={posterSettings}
              />
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '0',
              pointerEvents: 'none',
              zIndex: -999,
            }}
            aria-hidden="true"
          >
            {pages.map((p, idx) => {
              if (idx === safePageIndex) return null;
              return (
                <ScheduleBoard
                  key={p.pageNumber}
                  ref={(el) => {
                    boardRefs.current[idx] = el;
                  }}
                  config={schedule}
                  page={p}
                  settings={posterSettings}
                />
              );
            })}
          </div>
        </section>

        {/* Panou setari poster coloana dreapta */}
        <section className="xl:col-span-3 w-full flex justify-center xl:justify-start sticky top-6">
          <PosterSettingsPanel
            settings={posterSettings}
            onChange={setPosterSettings}
          />
        </section>
      </main>
    </div>
  );
}