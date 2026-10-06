import { useState, useRef, type ChangeEvent } from 'react';
import type { PosterCustomizableSettings, PosterPreset } from '../../types/posterCustomizer';
import { UI_THEME } from '../../constants/uiThemeConfig';
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

interface NumericControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

const NumericControl = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  onChange,
  onInteractionStart,
  onInteractionEnd,
}: NumericControlProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!Number.isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-neutral-300 font-medium select-none truncate">
          {label}
        </label>
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-16 px-2 py-0.5 bg-[#171724] border border-[#2a2a3e] rounded text-xs text-neutral-100 text-right focus:outline-none focus:border-indigo-500 font-mono transition-colors"
          />
          <span className="text-[10px] text-neutral-500 w-5 select-none font-mono">
            {unit}
          </span>
        </div>
      </div>

      <div className="w-full flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          onTouchStart={onInteractionStart}
          onTouchEnd={onInteractionEnd}
          onTouchCancel={onInteractionEnd}
          onMouseDown={onInteractionStart}
          onMouseUp={onInteractionEnd}
          className="w-full h-2 bg-[#1c1c2e] rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none touch-none"
        />
      </div>
    </div>
  );
};

interface PosterSettingsPanelProps {
  settings: PosterCustomizableSettings;
  onChange: (newSettings: PosterCustomizableSettings) => void;
  activePageIndex: number;
  totalPages: number;
  onCopySettingsToSlide: (targetSlideIndex: number) => void;
  // Preset Props
  presets: PosterPreset[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onSaveNewPreset: (name: string) => void;
  onUpdateActivePreset: () => void;
  onDeletePreset: (presetId: string) => void;
  onExportPresets: () => void;
  onImportPresets: (imported: PosterPreset[]) => void;
  // Callback-uri pentru Peek Preview pe mobil
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

  return (
    <div
      className={`w-full max-w-[340px] ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.card} ${UI_THEME.spacing.cardPadding} shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto`}
    >
      {/* 0. PRESET MANAGER SECTION */}
      <div className="flex flex-col gap-2.5 border-b border-[#262638] pb-3.5">
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
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#202030] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Importă preseturi (JSON)"
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#202030] transition-colors cursor-pointer"
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
        <div className="flex items-center gap-1.5">
          <select
            value={activePresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="flex-1 bg-[#171724] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-indigo-500 font-medium"
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
            className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer border border-indigo-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Formular adăugare profil nou */}
        {isCreatingPreset && (
          <form onSubmit={handleSaveNewSubmit} className="flex gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Nume profil..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="flex-1 px-2.5 py-1 bg-[#12121c] border border-indigo-500/50 rounded-md text-xs text-white outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-indigo-600 rounded-md text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
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
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Suprascrie cu setările curente"
            >
              <Save className="w-3 h-3 text-indigo-400" />
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
              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Șterge preset"
            >
              <Trash2 className="w-3 h-3" />
              <span>Șterge</span>
            </button>
          )}
        </div>

        {actionNotice && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] py-1 px-2 rounded text-center">
            {actionNotice}
          </div>
        )}
      </div>

      {/* HEADER AJUSTARE SLIDE CURENT */}
      <div className="flex flex-col gap-2 border-b border-[#262638] pb-3">
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
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202030] transition-colors cursor-pointer"
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                    isJustCopied
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#181826] border-[#2c2c42] text-neutral-300 hover:border-indigo-500 hover:text-white'
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
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          1. Layout General
        </span>
        <div className="bg-[#12121c] p-2.5 rounded-xl border border-[#202032] flex flex-col divide-y divide-[#1e1e2f]">
          <NumericControl
            label="Margine Orizontală (Sides)"
            value={settings.layout.paddingHorizontal}
            min={10}
            max={200}
            onChange={(val) => updateField('layout', 'paddingHorizontal', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Margine Sus (Padding Top)"
            value={settings.layout.paddingTop}
            min={0}
            max={200}
            onChange={(val) => updateField('layout', 'paddingTop', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Margine Jos (Padding Bottom)"
            value={settings.layout.paddingBottom}
            min={10}
            max={250}
            onChange={(val) => updateField('layout', 'paddingBottom', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Spațiu Între Zile (Days Gap)"
            value={settings.layout.daysGap}
            min={0}
            max={120}
            onChange={(val) => updateField('layout', 'daysGap', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          2. Header (Antet)
        </span>
        <div className="bg-[#12121c] p-2.5 rounded-xl border border-[#202032] flex flex-col divide-y divide-[#1e1e2f]">
          <NumericControl
            label="Mărime Titlu (PROGRAM)"
            value={settings.header.titleFontSize}
            min={24}
            max={100}
            onChange={(val) => updateField('header', 'titleFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Spațiere Litere Titlu"
            value={settings.header.titleLetterSpacing}
            min={0}
            max={0.5}
            step={0.01}
            unit="em"
            onChange={(val) => updateField('header', 'titleLetterSpacing', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Mărime Perioadă / Dată"
            value={settings.header.periodFontSize}
            min={30}
            max={120}
            onChange={(val) => updateField('header', 'periodFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Spațiere Litere Perioadă / Dată"
            value={settings.header.periodLetterSpacing}
            min={0}
            max={0.5}
            step={0.01}
            unit="em"
            onChange={(val) => updateField('header', 'periodLetterSpacing', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </div>

      {/* 3. DAY SECTION */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          3. Secțiune Zi (Card)
        </span>
        <div className="bg-[#12121c] p-2.5 rounded-xl border border-[#202032] flex flex-col divide-y divide-[#1e1e2f]">
          <NumericControl
            label="Rotunjire Colțuri (Radius)"
            value={settings.daySection.borderRadius}
            min={0}
            max={64}
            onChange={(val) => updateField('daySection', 'borderRadius', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Padding Vertical (Sus/Jos)"
            value={settings.daySection.paddingVertical}
            min={0}
            max={80}
            onChange={(val) => updateField('daySection', 'paddingVertical', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Padding Orizontal (Stânga/Dreapta)"
            value={settings.daySection.paddingHorizontal}
            min={0}
            max={80}
            onChange={(val) => updateField('daySection', 'paddingHorizontal', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Mărime Text Nume Zi"
            value={settings.daySection.headerFontSize}
            min={14}
            max={48}
            onChange={(val) => updateField('daySection', 'headerFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Spațiu Între Evenimente"
            value={settings.daySection.eventsGap}
            min={0}
            max={60}
            onChange={(val) => updateField('daySection', 'eventsGap', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </div>

      {/* 4. EVENT CARD */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          4. Eveniment Individual
        </span>
        <div className="bg-[#12121c] p-2.5 rounded-xl border border-[#202032] flex flex-col divide-y divide-[#1e1e2f]">
          <NumericControl
            label="Mărime Emoji"
            value={settings.eventCard.emojiSize}
            min={20}
            max={96}
            onChange={(val) => updateField('eventCard', 'emojiSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Distanță Emoji - Text"
            value={settings.eventCard.gapEmojiToContent}
            min={0}
            max={64}
            onChange={(val) => updateField('eventCard', 'gapEmojiToContent', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Distanță Oră - Titlu"
            value={settings.eventCard.gapTimeToTitle}
            min={0}
            max={40}
            onChange={(val) => updateField('eventCard', 'gapTimeToTitle', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Padding Vertical Eveniment"
            value={settings.eventCard.paddingVertical}
            min={0}
            max={40}
            onChange={(val) => updateField('eventCard', 'paddingVertical', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Mărime Font Titlu"
            value={settings.eventCard.titleFontSize}
            min={16}
            max={56}
            onChange={(val) => updateField('eventCard', 'titleFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Înălțime Linie Titlu (Line Height)"
            value={settings.eventCard.titleLineHeight}
            min={16}
            max={72}
            onChange={(val) => updateField('eventCard', 'titleLineHeight', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Mărime Font Detaliu (Feature)"
            value={settings.eventCard.featureFontSize}
            min={14}
            max={48}
            onChange={(val) => updateField('eventCard', 'featureFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Mărime Caracter Separator (/)"
            value={settings.eventCard.slashFontSize}
            min={14}
            max={48}
            onChange={(val) => updateField('eventCard', 'slashFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
          <NumericControl
            label="Mărime Font Oră"
            value={settings.eventCard.timeFontSize}
            min={12}
            max={40}
            onChange={(val) => updateField('eventCard', 'timeFontSize', val)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </div>
    </div>
  );
};