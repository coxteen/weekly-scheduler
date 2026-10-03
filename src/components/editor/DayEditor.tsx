import { AppleEmoji } from '../common/AppleEmoji';
import { UI_THEME } from '../../constants/uiThemeConfig';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { DaySchedule, ScheduleEvent } from '../../types/schedule';

interface DayEditorProps {
  day: DaySchedule;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddEvent: (dayId: string) => void;
  onUpdateEvent: (dayId: string, eventId: string, fields: Partial<ScheduleEvent>) => void;
  onDeleteEvent: (dayId: string, eventId: string) => void;
  onOpenEmojiPicker: (dayId: string, eventId: string, currentEmoji: string) => void;
}

export const DayEditor = ({
  day,
  isExpanded,
  onToggleExpand,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onOpenEmojiPicker,
}: DayEditorProps) => {
  return (
    <div className={`border ${UI_THEME.radii.card} transition-colors overflow-hidden border-[#28283C] bg-[#161622]`}>
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-[#1B1B2A] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className={`font-bold text-sm ${UI_THEME.text.primary}`}>
            {day.dayName}
          </span>
          <span className={`text-xs ${UI_THEME.text.muted}`}>
            {day.dayNumber} {day.monthName} • {day.events.length} {day.events.length === 1 ? 'atelier' : 'ateliere'}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </div>

      {isExpanded && (
        <div className="p-4 pt-1 border-t border-[#222234] flex flex-col gap-3.5">
          {day.events.length === 0 ? (
            <p className={`text-xs ${UI_THEME.text.muted} italic py-1`}>
              Niciun atelier configurat pentru această zi.
            </p>
          ) : (
            day.events.map((event) => (
              <div key={event.id} className="p-3.5 rounded-xl bg-[#1A1A28] border border-[#2B2B3E] flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenEmojiPicker(day.id, event.id, event.emoji)}
                    className="h-10 w-10 flex items-center justify-center border border-[#34344C] rounded-xl bg-[#232334] hover:bg-[#2C2C42] transition-colors shadow-xs shrink-0 cursor-pointer"
                    title="Alege emoji Apple"
                  >
                    <AppleEmoji emoji={event.emoji} size={24} />
                  </button>

                  <input
                    type="text"
                    value={event.title}
                    placeholder="Titlu atelier"
                    onChange={(e) => onUpdateEvent(day.id, event.id, { title: e.target.value })}
                    className={`flex-1 text-xs md:text-sm font-bold border border-[#2F2F45] ${UI_THEME.radii.control} px-3 py-2 ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus}`}
                  />

                  <button
                    type="button"
                    onClick={() => onDeleteEvent(day.id, event.id)}
                    className="text-neutral-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Șterge atelier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={event.feature || ''}
                    placeholder="Subtitlu / Gazdă"
                    onChange={(e) => onUpdateEvent(day.id, event.id, { feature: e.target.value })}
                    className={`text-xs italic border border-[#2F2F45] ${UI_THEME.radii.control} px-3 py-2 ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus}`}
                  />
                  <input
                    type="text"
                    value={event.time || ''}
                    placeholder="Interval orar (ex: 18:00 - 20:00)"
                    onChange={(e) => onUpdateEvent(day.id, event.id, { time: e.target.value })}
                    className={`text-xs border border-[#2F2F45] ${UI_THEME.radii.control} px-3 py-2 ${UI_THEME.backgrounds.input} ${UI_THEME.text.primary} outline-none ${UI_THEME.backgrounds.inputFocus}`}
                  />
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() => onAddEvent(day.id)}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-[#34344C] rounded-xl text-xs font-semibold text-neutral-300 hover:bg-[#202030] hover:border-neutral-400 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Adaugă Atelier
          </button>
        </div>
      )}
    </div>
  );
};