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

  const [slideCount, setSlideCount] = useState<SlideCount>(() => loadStoredSlideCount());
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Preseturi și ID preset activ
  const [presets, setPresets] = useState<PosterPreset[]>(() => loadStoredPresets());
  const [activePresetId, setActivePresetId] = useState<string>(() => loadStoredActivePresetId());

  // Setări slide-uri curente
  const [slidesSettings, setSlidesSettings] = useState<Record<number, PosterCustomizableSettings>>(() => {
    const stored = loadStoredSlidesSettings();
    return stored;
  });

  const boardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-save setări slide-uri
  useEffect(() => {
    saveStoredSlidesSettings(slidesSettings);
  }, [slidesSettings]);

  // Auto-save număr slide-uri
  useEffect(() => {
    saveStoredSlideCount(slideCount);
  }, [slideCount]);

  // Auto-save preset-uri
  useEffect(() => {
    saveStoredPresets(presets);
  }, [presets]);

  // Auto-save active preset id
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

  // --- Handlere Preset-uri ---
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
      isDefault: false,
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

  const handleSetDefaultPreset = (presetId: string) => {
    setPresets((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === presetId,
      }))
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
      const defaultOne = imported.find((p) => p.isDefault) || imported[0];
      setActivePresetId(defaultOne.id);
      setSlidesSettings(JSON.parse(JSON.stringify(defaultOne.settings)));
    }
  };

  const getActiveBoardElement = () => {
    return boardRefs.current[safePageIndex] || null;
  };

  const paginationControls = (
    <div className="flex flex-col justify-between h-full gap-2.5">
      {/* Selector mod slide-uri (2 sau 3) */}
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

      {/* Selector slide curent: doar 1, 2, 3 */}
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
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            onSaveNewPreset={handleSaveNewPreset}
            onUpdateActivePreset={handleUpdateActivePreset}
            onSetDefaultPreset={handleSetDefaultPreset}
            onDeletePreset={handleDeletePreset}
            onExportPresets={() => exportPresetsToJson(presets)}
            onImportPresets={handleImportPresets}
          />
        </section>
      </main>
    </div>
  );
}