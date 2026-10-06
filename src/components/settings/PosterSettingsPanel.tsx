import { useState, useRef, type ChangeEvent } from 'react';
import type { PosterCustomizableSettings, PosterPreset } from '../../types/posterCustomizer';
import { PosterSliderControl } from './PosterSliderControl';
import {
  Sliders,
  RotateCcw,
  Copy,
  Check,
  Bookmark,
  Plus,
  Trash2,
  Download,
  Upload,
  Save,
} from 'lucide-react';
import { DEFAULT_POSTER_SETTINGS } from '../../constants/posterThemeConfig';

interface PosterSettingsPanelProps {
  settings: PosterCustomizableSettings;
  onChange: (newSettings: PosterCustomizableSettings) => void;
  activePageIndex: number;
  totalPages: number;
  onCopySettingsToSlide: (targetSlideIndex: number) => void;
  presets: PosterPreset[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onSaveNewPreset: (name: string) => void;
  onUpdateActivePreset: () => void;
  onDeletePreset: (presetId: string) => void;
  onExportPresets: () => void;
  onImportPresets: (imported: PosterPreset[]) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export const PosterSettingsPanel = ({
  settings,
  onChange,
  activePageIndex,
  totalPages,
  onCopySettingsToSlide,
  presets,
  activePresetId,
  onSelectPreset,
  onSaveNewPreset,
  onUpdateActivePreset,
  onDeletePreset,
  onExportPresets,
  onImportPresets,
  onInteractionStart,
  onInteractionEnd,
}: PosterSettingsPanelProps) => {
  const [copiedTo, setCopiedTo] = useState<number | null>(null);
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePreset = presets.find((p) => p.id === activePresetId) || presets[0];

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2000);
  };

  const updateField = <
    Section extends keyof PosterCustomizableSettings,
    Field extends keyof PosterCustomizableSettings[Section]
  >(
    section: Section,
    field: Field,
    value: PosterCustomizableSettings[Section][Field]
  ) => {
    onChange({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const handleReset = () => {
    onChange(DEFAULT_POSTER_SETTINGS);
  };

  const handleCopy = (targetIndex: number) => {
    onCopySettingsToSlide(targetIndex);
    setCopiedTo(targetIndex);
    setTimeout(() => setCopiedTo(null), 1800);
  };

  const handleSaveNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    onSaveNewPreset(newPresetName.trim());
    setNewPresetName('');
    setIsCreatingPreset(false);
    showNotification('Preset salvat cu succes!');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportPresets(parsed);
          showNotification('Preseturi importate cu succes!');
        } else {
          alert('Format fișier invalid.');
        }
      } catch {
        alert('Nu s-a putut citi fișierul JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const otherSlideIndices = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => i !== activePageIndex
  );

  // Helper generic pentru a randa controalele fără repetare de props
  const renderControl = <
    Section extends keyof PosterCustomizableSettings,
    Field extends keyof PosterCustomizableSettings[Section]
  >(
    section: Section,
    field: Field,
    label: string,
    min: number,
    max: number,
    step: number = 1,
    unit: string = 'px'
  ) => (
    <PosterSliderControl
      key={String(field)}
      label={label}
      value={settings[section][field] as unknown as number}
      min={min}
      max={max}
      step={step}
      unit={unit}
      onChange={(val) => updateField(section, field, val as unknown as PosterCustomizableSettings[Section][Field])}
      onInteractionStart={onInteractionStart}
      onInteractionEnd={onInteractionEnd}
    />
  );

  return (
    <div className="w-full flex flex-col gap-5 pb-6">
      {/* 0. PRESET MANAGER SECTION */}
      <div className="flex flex-col gap-3 pb-4 border-b border-[#252538]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Profile de Setări
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onExportPresets}
              title="Exportă preseturi (JSON)"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#181826] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Importă preseturi (JSON)"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#181826] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Dropdown selector preset */}
        <div className="flex items-center gap-2">
          <select
            value={activePresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="flex-1 bg-[#101018] border border-[#252538] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-indigo-500 font-medium transition-colors"
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsCreatingPreset(!isCreatingPreset)}
            title="Salvează ca profil nou"
            className="p-2 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer border border-indigo-500/30 shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Formular adăugare profil nou */}
        {isCreatingPreset && (
          <form onSubmit={handleSaveNewSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Nume profil..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#101018] border border-indigo-500/50 rounded-xl text-xs text-white outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 rounded-xl text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer transition-colors"
            >
              Salvați
            </button>
          </form>
        )}

        {/* Acțiuni pentru presetul selectat */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
          {!activePreset?.isBuiltIn ? (
            <button
              type="button"
              onClick={() => {
                onUpdateActivePreset();
                showNotification('Profil actualizat!');
              }}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Suprascrie cu setările curente"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>Actualizează profilul</span>
            </button>
          ) : (
            <span className="text-[11px] text-neutral-500 italic">Profil de sistem</span>
          )}

          {!activePreset?.isBuiltIn && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Sigur vrei să ștergi presetul "${activePreset?.name}"?`)) {
                  onDeletePreset(activePresetId);
                }
              }}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Șterge preset"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Șterge</span>
            </button>
          )}
        </div>

        {actionNotice && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] py-1.5 px-2.5 rounded-xl text-center">
            {actionNotice}
          </div>
        )}
      </div>

      {/* HEADER AJUSTARE SLIDE CURENT */}
      <div className="flex flex-col gap-2.5 pb-4 border-b border-[#252538]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Ajustare Slide {activePageIndex + 1}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            title="Resetează slide-ul curent la valorile implicite"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#181826] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {otherSlideIndices.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {otherSlideIndices.map((targetIdx) => {
              const isJustCopied = copiedTo === targetIdx;
              return (
                <button
                  key={targetIdx}
                  type="button"
                  onClick={() => handleCopy(targetIdx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    isJustCopied
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-[#101018] border border-[#252538] text-neutral-300 hover:border-indigo-500 hover:text-white'
                  }`}
                >
                  {isJustCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiat pe Slide {targetIdx + 1}!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-indigo-400" />
                      <span>Copiază pe Slide {targetIdx + 1}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 1. LAYOUT GENERAL */}
      <div className="flex flex-col gap-2.5 pb-4 border-b border-[#252538]/60">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          1. Layout General
        </span>
        <div className="flex flex-col gap-1">
          {renderControl('layout', 'paddingHorizontal', 'Margine Orizontală (Sides)', 10, 200)}
          {renderControl('layout', 'paddingTop', 'Margine Sus (Padding Top)', 0, 200)}
          {renderControl('layout', 'paddingBottom', 'Margine Jos (Padding Bottom)', 10, 250)}
          {renderControl('layout', 'daysGap', 'Spațiu Între Zile (Days Gap)', 0, 120)}
        </div>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col gap-2.5 pb-4 border-b border-[#252538]/60">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          2. Header (Antet)
        </span>
        <div className="flex flex-col gap-1">
          {renderControl('header', 'titleFontSize', 'Mărime Titlu (PROGRAM)', 24, 100)}
          {renderControl('header', 'titleLetterSpacing', 'Spațiere Litere Titlu', 0, 0.5, 0.01, 'em')}
          {renderControl('header', 'periodFontSize', 'Mărime Perioadă / Dată', 30, 120)}
          {renderControl('header', 'periodLetterSpacing', 'Spațiere Litere Perioadă / Dată', 0, 0.5, 0.01, 'em')}
        </div>
      </div>

      {/* 3. DAY SECTION */}
      <div className="flex flex-col gap-2.5 pb-4 border-b border-[#252538]/60">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          3. Secțiune Zi (Card)
        </span>
        <div className="flex flex-col gap-1">
          {renderControl('daySection', 'borderRadius', 'Rotunjire Colțuri (Radius)', 0, 64)}
          {renderControl('daySection', 'paddingVertical', 'Padding Vertical (Sus/Jos)', 0, 80)}
          {renderControl('daySection', 'paddingHorizontal', 'Padding Orizontal (Stânga/Dreapta)', 0, 80)}
          {renderControl('daySection', 'headerFontSize', 'Mărime Text Nume Zi', 14, 48)}
          {renderControl('daySection', 'eventsGap', 'Spațiu Între Evenimente', 0, 60)}
        </div>
      </div>

      {/* 4. EVENT CARD */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          4. Eveniment Individual
        </span>
        <div className="flex flex-col gap-1">
          {renderControl('eventCard', 'emojiSize', 'Mărime Emoji', 20, 96)}
          {renderControl('eventCard', 'gapEmojiToContent', 'Distanță Emoji - Text', 0, 64)}
          {renderControl('eventCard', 'gapTimeToTitle', 'Distanță Oră - Titlu', 0, 40)}
          {renderControl('eventCard', 'paddingVertical', 'Padding Vertical Eveniment', 0, 40)}
          {renderControl('eventCard', 'titleFontSize', 'Mărime Font Titlu', 16, 56)}
          {renderControl('eventCard', 'titleLineHeight', 'Înălțime Linie Titlu (Line Height)', 16, 72)}
          {renderControl('eventCard', 'featureFontSize', 'Mărime Font Detaliu (Feature)', 14, 48)}
          {renderControl('eventCard', 'slashFontSize', 'Mărime Caracter Separator (/)', 14, 48)}
          {renderControl('eventCard', 'timeFontSize', 'Mărime Font Oră', 12, 40)}
        </div>
      </div>
    </div>
  );
};