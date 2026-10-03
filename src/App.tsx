import { useRef, useMemo, useState } from 'react';
import { useScheduleManager } from './hooks/useScheduleManager';
import { paginateScheduleDays } from './utils/paginationUtils';
import { ScheduleBoard } from './components/preview/ScheduleBoard';
import { ScheduleEditor } from './components/editor/ScheduleEditor';
import { ExportToolbar } from './components/preview/ExportToolbar';
import { UI_THEME } from './constants/uiThemeConfig';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function App() {
  const {
    schedule,
    handleStartDateChange,
    toggleDayEnabled,
    handleThemeChange,
    updateEvent,
    addEvent,
    deleteEvent,
  } = useScheduleManager();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const boardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = useMemo(() => paginateScheduleDays(schedule.days), [schedule.days]);
  const safePageIndex = activePageIndex >= pages.length ? 0 : activePageIndex;

  const getBoardElements = () => {
    return boardRefs.current.filter((el): el is HTMLDivElement => el !== null);
  };

  return (
    <div className={`min-h-screen ${UI_THEME.backgrounds.app} ${UI_THEME.text.primary} p-4 md:p-6 lg:p-8 flex justify-center`}>
      <main className="w-full max-w-[1550px] grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        
        <section className={`lg:col-span-6 xl:col-span-5 w-full ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.panel} ${UI_THEME.spacing.panelPadding} shadow-2xl`}>
          <ScheduleEditor
            schedule={schedule}
            onStartDateChange={handleStartDateChange}
            onToggleDay={toggleDayEnabled}
            onThemeChange={handleThemeChange}
            onUpdateEvent={updateEvent}
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
          />
        </section>

        <section className="lg:col-span-6 xl:col-span-7 w-full flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 sticky top-6">
          
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-full flex justify-center">
              {pages[safePageIndex] && (
                <ScheduleBoard
                  ref={(el) => {
                    boardRefs.current[safePageIndex] = el;
                  }}
                  config={schedule}
                  page={pages[safePageIndex]}
                />
              )}
            </div>
          </div>

          <div className="w-full max-w-[280px] shrink-0 flex flex-col gap-4">
            
            {pages.length > 1 && (
              <div className={`w-full ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.card} ${UI_THEME.spacing.cardPadding} shadow-xl flex flex-col gap-3.5`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${UI_THEME.text.secondary} flex items-center gap-1.5`}>
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Slide-uri
                  </span>
                  <span className="text-[10px] font-bold bg-[#171724] border border-[#262638] px-2 py-0.5 rounded-full text-neutral-400">
                    {safePageIndex + 1} / {pages.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {pages.map((p, idx) => (
                    <button
                      key={p.pageNumber}
                      type="button"
                      onClick={() => setActivePageIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 ${UI_THEME.radii.control} text-xs font-bold transition-all cursor-pointer border ${
                        safePageIndex === idx
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-[#171724] border-[#262638] text-neutral-400 hover:bg-[#202030]'
                      }`}
                    >
                      <span>Slide {idx + 1}</span>
                      <span className={`text-[10px] font-normal ${safePageIndex === idx ? 'text-indigo-200' : 'opacity-60'}`}>
                        {p.totalEvents} {p.totalEvents === 1 ? 'atelier' : 'ateliere'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    disabled={safePageIndex === 0}
                    onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                    className={`flex items-center justify-center py-2 ${UI_THEME.radii.control} bg-[#171724] border border-[#262638] text-neutral-400 disabled:opacity-30 hover:bg-[#202030] transition-colors cursor-pointer`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={safePageIndex === pages.length - 1}
                    onClick={() => setActivePageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                    className={`flex items-center justify-center py-2 ${UI_THEME.radii.control} bg-[#171724] border border-[#262638] text-neutral-400 disabled:opacity-30 hover:bg-[#202030] transition-colors cursor-pointer`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <ExportToolbar
              getBoardElements={getBoardElements}
              pagesCount={pages.length}
            />
          </div>

          <div
            style={{
              position: 'fixed',
              left: '-9999px',
              top: '-9999px',
              opacity: 0,
              pointerEvents: 'none',
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
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}