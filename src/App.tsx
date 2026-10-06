import { useRef, useMemo, useState } from 'react';
import { useScheduleManager } from './hooks/useScheduleManager';
import { paginateScheduleDays, type SlideCount } from './utils/paginationUtils';
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

  const [slideCount, setSlideCount] = useState<SlideCount>(2);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Stocare setări independente per index de slide
  const [slidesSettings, setSlidesSettings] = useState<
    Record<number, PosterCustomizableSettings>
  >({
    0: { ...DEFAULT_POSTER_SETTINGS },
    1: { ...DEFAULT_POSTER_SETTINGS },
    2: { ...DEFAULT_POSTER_SETTINGS },
  });

  const boardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = useMemo(
    () => paginateScheduleDays(schedule.days, slideCount),
    [schedule.days, slideCount]
  );

  const safePageIndex = activePageIndex >= pages.length ? 0 : activePageIndex;

  // Setările slide-ului activ curent
  const currentSlideSettings =
    slidesSettings[safePageIndex] || DEFAULT_POSTER_SETTINGS;

  const handleUpdateCurrentSlideSettings = (
    newSettings: PosterCustomizableSettings
  ) => {
    setSlidesSettings((prev) => ({
      ...prev,
      [safePageIndex]: newSettings,
    }));
  };

  const handleCopySettingsToSlide = (targetSlideIndex: number) => {
    setSlidesSettings((prev) => ({
      ...prev,
      [targetSlideIndex]: JSON.parse(JSON.stringify(currentSlideSettings)),
    }));
  };

  const getActiveBoardElement = () => {
    return boardRefs.current[safePageIndex] || null;
  };

  const paginationControls = (
    <div className="flex flex-col gap-2 h-full justify-between">
      <div className="flex bg-[#12121c] p-1 rounded-xl border border-[#26263A]">
        {([2, 3] as SlideCount[]).map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => {
              setSlideCount(count);
              setActivePageIndex(0);
            }}
            className={`flex-1 py-1.5 text-xs font-bold transition-all rounded-lg cursor-pointer ${
              slideCount === count
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a28]'
            }`}
          >
            {count} Slide-uri
          </button>
        ))}
      </div>

      <div className="flex bg-[#171724] border border-[#262638] rounded-xl p-1 gap-1">
        {pages.map((p, idx) => (
          <button
            key={p.pageNumber}
            type="button"
            onClick={() => setActivePageIndex(idx)}
            className={`flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-lg ${
              safePageIndex === idx
                ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#202030]'
            }`}
          >
            Slide {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );

  const exportControls = (
    <ExportToolbar
      getActiveBoardElement={getActiveBoardElement}
      activePageIndex={safePageIndex}
    />
  );

  return (
    <div
      className={`min-h-screen ${UI_THEME.backgrounds.app} ${UI_THEME.text.primary} p-4 md:p-6 lg:p-8 flex justify-center`}
    >
      <main className="w-full max-w-[1750px] grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Editor coloana stanga */}
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
                settings={currentSlideSettings}
              />
            )}
          </div>
        </section>

        {/* Panou setari poster coloana dreapta */}
        <section className="xl:col-span-3 w-full flex justify-center xl:justify-start sticky top-6">
          <PosterSettingsPanel
            settings={currentSlideSettings}
            onChange={handleUpdateCurrentSlideSettings}
            activePageIndex={safePageIndex}
            totalPages={pages.length}
            onCopySettingsToSlide={handleCopySettingsToSlide}
          />
        </section>
      </main>
    </div>
  );
}