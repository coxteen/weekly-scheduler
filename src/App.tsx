import { useRef, useMemo, useState, useEffect } from 'react';
import { useScheduleManager } from './hooks/useScheduleManager';
import { paginateScheduleDays, type SlideCount } from './utils/paginationUtils';
import { ScheduleBoard } from './components/preview/ScheduleBoard';
import { ScheduleEditor } from './components/editor/ScheduleEditor';
import { ExportToolbar } from './components/preview/ExportToolbar';
import { PosterSettingsPanel } from './components/settings/PosterSettingsPanel';
import { DEFAULT_POSTER_SETTINGS } from './constants/posterThemeConfig';
import type { PosterCustomizableSettings, PosterPreset } from './types/posterCustomizer';
import { UI_THEME } from './constants/uiThemeConfig';
import { PenTool, Eye, Sliders } from 'lucide-react';
import {
  loadStoredSlidesSettings,
  saveStoredSlidesSettings,
  loadStoredSlideCount,
  saveStoredSlideCount,
  loadStoredPresets,
  saveStoredPresets,
  loadStoredActivePresetId,
  saveStoredActivePresetId,
  exportPresetsToJson,
} from './utils/storageService';

type MobileView = 'editor' | 'preview' | 'settings';

export default function App() {
  const {
    schedule,
    handleStartDateChange,
    handleIncludeYearToggle,
    handleThemeChange,
    updateEvent,
    addEvent,
    deleteEvent,
    importFromExcel,
    importStatus,
    resetToDefaultSchedule,
  } = useScheduleManager();

  const [slideCount, setSlideCount] = useState<SlideCount>(() => loadStoredSlideCount());
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [mobileView, setMobileView] = useState<MobileView>('editor');

  // Stare pentru Peek Preview pe mobil (activă doar când tragi de slider)
  const [isPeekingPreview, setIsPeekingPreview] = useState(false);

  const [presets, setPresets] = useState<PosterPreset[]>(() => loadStoredPresets());
  const [activePresetId, setActivePresetId] = useState<string>(() => loadStoredActivePresetId());

  const [slidesSettings, setSlidesSettings] = useState<Record<number, PosterCustomizableSettings>>(() => {
    return loadStoredSlidesSettings();
  });

  const boardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    saveStoredSlidesSettings(slidesSettings);
  }, [slidesSettings]);

  useEffect(() => {
    saveStoredSlideCount(slideCount);
  }, [slideCount]);

  useEffect(() => {
    saveStoredPresets(presets);
  }, [presets]);

  useEffect(() => {
    saveStoredActivePresetId(activePresetId);
  }, [activePresetId]);

  const pages = useMemo(
    () => paginateScheduleDays(schedule.days, slideCount),
    [schedule.days, slideCount]
  );

  const safePageIndex = activePageIndex >= pages.length ? 0 : activePageIndex;

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

  const handleSelectPreset = (presetId: string) => {
    const selected = presets.find((p) => p.id === presetId);
    if (!selected) return;

    setActivePresetId(presetId);
    setSlidesSettings(JSON.parse(JSON.stringify(selected.settings)));
  };

  const handleSaveNewPreset = (name: string) => {
    const newId = `preset-${Date.now()}`;
    const newPreset: PosterPreset = {
      id: newId,
      name,
      isBuiltIn: false,
      updatedAt: new Date().toISOString(),
      settings: JSON.parse(JSON.stringify(slidesSettings)),
    };

    setPresets((prev) => [...prev, newPreset]);
    setActivePresetId(newId);
  };

  const handleUpdateActivePreset = () => {
    setPresets((prev) =>
      prev.map((p) =>
        p.id === activePresetId
          ? {
              ...p,
              updatedAt: new Date().toISOString(),
              settings: JSON.parse(JSON.stringify(slidesSettings)),
            }
          : p
      )
    );
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
    setActivePresetId('preset-default');
    const defaultPreset = presets.find((p) => p.id === 'preset-default');
    if (defaultPreset) {
      setSlidesSettings(JSON.parse(JSON.stringify(defaultPreset.settings)));
    }
  };

  const handleImportPresets = (imported: PosterPreset[]) => {
    setPresets(imported);
    if (imported.length > 0) {
      setActivePresetId(imported[0].id);
      setSlidesSettings(JSON.parse(JSON.stringify(imported[0].settings)));
    }
  };

  const getActiveBoardElement = () => {
    return boardRefs.current[safePageIndex] || null;
  };

  const paginationControls = (
    <div className="flex flex-col justify-between h-full gap-2.5">
      <div className="grid grid-cols-2 gap-1 bg-[#101018] p-1 rounded-xl border border-[#222234]">
        {([2, 3] as SlideCount[]).map((count) => {
          const isSelected = slideCount === count;
          return (
            <button
              key={count}
              type="button"
              onClick={() => {
                setSlideCount(count);
                setActivePageIndex(0);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-[#1a1a28]'
              }`}
            >
              {count} Slide-uri
            </button>
          );
        })}
      </div>

      <div className="flex bg-[#101018] border border-[#222234] rounded-xl p-1 gap-1">
        {pages.map((p, idx) => {
          const isSelected = safePageIndex === idx;
          return (
            <button
              key={p.pageNumber}
              type="button"
              onClick={() => setActivePageIndex(idx)}
              className={`flex-1 py-2 text-sm font-black transition-all cursor-pointer rounded-lg text-center ${
                isSelected
                  ? 'bg-neutral-100 text-neutral-950 shadow-sm scale-[1.02]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#1a1a28]'
              }`}
              title={`Afișează Slide ${p.pageNumber}`}
            >
              {p.pageNumber}
            </button>
          );
        })}
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
      className={`min-h-screen xl:h-screen xl:max-h-screen xl:overflow-hidden ${UI_THEME.backgrounds.app} ${UI_THEME.text.primary} p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center relative`}
    >
      {/* 1. Bară navigare mobil (sub ecran xl) */}
      <div className="xl:hidden w-full max-w-lg mb-4 sticky top-2 z-40">
        <div className="grid grid-cols-3 gap-1 bg-[#151522]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#262638] shadow-2xl">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileView === 'editor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileView === 'preview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Previzualizare</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileView('settings')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileView === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ajustare</span>
          </button>
        </div>
      </div>

      {/* 2. HUD PEEK PREVIEW PE MOBIL */}
      {isPeekingPreview && mobileView === 'settings' && (
        <div className="xl:hidden fixed top-16 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-[#12121c]/90 backdrop-blur-xl border border-indigo-500/40 rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-[280px] w-full flex flex-col items-center">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">
              Live Preview
            </span>
            <div className="w-full h-[38vh] flex items-center justify-center">
              {pages[safePageIndex] && (
                <ScheduleBoard
                  config={schedule}
                  page={pages[safePageIndex]}
                  settings={currentSlideSettings}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Conținutul principal ancorat la înălțimea viewport-ului pe desktop */}
      <main className="w-full max-w-[1850px] flex-1 xl:h-[calc(100vh-3.5rem)] xl:max-h-[calc(100vh-3.5rem)] grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6 items-stretch min-h-0">
        
        {/* COLOANA 1: Editor (Stânga - 5 cols) */}
        <section
          className={`xl:col-span-5 w-full xl:h-full xl:min-h-0 ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.panel} ${UI_THEME.spacing.panelPadding} shadow-2xl flex flex-col overflow-hidden ${
            mobileView === 'editor' ? 'flex' : 'hidden xl:flex'
          }`}
        >
          <div className="w-full flex-1 overflow-y-auto min-h-0 pr-1.5 scrollbar-thin scrollbar-thumb-[#28283c] scrollbar-track-transparent">
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
              onImportExcel={importFromExcel}
              importStatus={importStatus}
              onResetSchedule={resetToDefaultSchedule}
            />
          </div>
        </section>

        {/* COLOANA 2: Previzualizare Poster - Direct pe canvas, fără card exterior */}
        <section
          className={`xl:col-span-4 w-full xl:h-full xl:min-h-0 flex flex-col items-center justify-center overflow-hidden ${
            mobileView === 'preview' ? 'flex' : 'hidden xl:flex'
          }`}
        >
          <div className="w-full h-full flex-1 min-h-0 flex items-center justify-center relative">
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

        {/* COLOANA 3: Panou Reglaje Poster (Dreapta) */}
        <section
          className={`xl:col-span-3 w-full xl:h-full xl:min-h-0 ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.panel} ${UI_THEME.spacing.panelPadding} shadow-2xl flex flex-col overflow-hidden ${
            mobileView === 'settings' ? 'flex' : 'hidden xl:flex'
          }`}
        >
          {/* Scroll intern pentru setări */}
          <div className="w-full flex-1 overflow-y-auto min-h-0 pr-1.5 scrollbar-thin scrollbar-thumb-[#28283c] scrollbar-track-transparent">
            <PosterSettingsPanel
              settings={currentSlideSettings}
              onChange={handleUpdateCurrentSlideSettings}
              activePageIndex={safePageIndex}
              totalPages={pages.length}
              onCopySettingsToSlide={handleCopySettingsToSlide}
              presets={presets}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onSaveNewPreset={handleSaveNewPreset}
              onUpdateActivePreset={handleUpdateActivePreset}
              onDeletePreset={handleDeletePreset}
              onExportPresets={() => exportPresetsToJson(presets)}
              onImportPresets={handleImportPresets}
              onInteractionStart={() => setIsPeekingPreview(true)}
              onInteractionEnd={() => setIsPeekingPreview(false)}
            />
          </div>
        </section>

      </main>
    </div>
  );
}