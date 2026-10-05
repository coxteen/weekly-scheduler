import type { ChangeEvent } from 'react';
import type { PosterCustomizableSettings } from '../../types/posterCustomizer';
import { UI_THEME } from '../../constants/uiThemeConfig';
import { Sliders, RotateCcw } from 'lucide-react';
import { DEFAULT_POSTER_SETTINGS } from '../../constants/posterThemeConfig';

interface NumericControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

const NumericControl = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  onChange,
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
          className="w-full h-1.5 bg-[#1c1c2e] rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

interface PosterSettingsPanelProps {
  settings: PosterCustomizableSettings;
  onChange: (newSettings: PosterCustomizableSettings) => void;
}

export const PosterSettingsPanel = ({
  settings,
  onChange,
}: PosterSettingsPanelProps) => {
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

  return (
    <div
      className={`w-full max-w-[340px] ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.card} ${UI_THEME.spacing.cardPadding} shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto`}
    >
      <div className="flex items-center justify-between border-b border-[#262638] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Ajustare Poster
          </h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          title="Resetează la valorile implicite"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202030] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. LAYOUT GLOBAL */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
          1. Layout General
        </span>
        <div className="bg-[#12121c] p-2.5 rounded-xl border border-[#202032] flex flex-col divide-y divide-[#1e1e2f]">
          <NumericControl
            label="Margine Orizontală (Sides)"
            value={settings.layout.paddingHorizontal}
            min={0}
            max={80}
            onChange={(val) => updateField('layout', 'paddingHorizontal', val)}
          />
          <NumericControl
            label="Margine Sus (Padding Top)"
            value={settings.layout.paddingTop}
            min={0}
            max={120}
            onChange={(val) => updateField('layout', 'paddingTop', val)}
          />
          <NumericControl
            label="Margine Jos (Padding Bottom)"
            value={settings.layout.paddingBottom}
            min={0}
            max={120}
            onChange={(val) => updateField('layout', 'paddingBottom', val)}
          />
          <NumericControl
            label="Spațiu Între Zile (Days Gap)"
            value={settings.layout.daysGap}
            min={0}
            max={60}
            onChange={(val) => updateField('layout', 'daysGap', val)}
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
            min={12}
            max={36}
            onChange={(val) => updateField('header', 'titleFontSize', val)}
          />
          <NumericControl
            label="Spațiere Litere Titlu"
            value={settings.header.titleLetterSpacing}
            min={0}
            max={0.5}
            step={0.01}
            unit="em"
            onChange={(val) => updateField('header', 'titleLetterSpacing', val)}
          />
          <NumericControl
            label="Mărime Perioadă / Dată"
            value={settings.header.periodFontSize}
            min={18}
            max={56}
            onChange={(val) => updateField('header', 'periodFontSize', val)}
          />
          <NumericControl
            label="Spațiere Litere Perioadă / Dată"
            value={settings.header.periodLetterSpacing}
            min={0}
            max={0.5}
            step={0.01}
            unit="em"
            onChange={(val) => updateField('header', 'periodLetterSpacing', val)}
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
            max={32}
            onChange={(val) => updateField('daySection', 'borderRadius', val)}
          />
          <NumericControl
            label="Padding Vertical (Sus/Jos)"
            value={settings.daySection.paddingVertical}
            min={0}
            max={40}
            onChange={(val) => updateField('daySection', 'paddingVertical', val)}
          />
          <NumericControl
            label="Padding Orizontal (Stânga/Dreapta)"
            value={settings.daySection.paddingHorizontal}
            min={0}
            max={40}
            onChange={(val) => updateField('daySection', 'paddingHorizontal', val)}
          />
          <NumericControl
            label="Mărime Text Nume Zi"
            value={settings.daySection.headerFontSize}
            min={8}
            max={24}
            onChange={(val) => updateField('daySection', 'headerFontSize', val)}
          />
          <NumericControl
            label="Spațiu Între Evenimente"
            value={settings.daySection.eventsGap}
            min={0}
            max={30}
            onChange={(val) => updateField('daySection', 'eventsGap', val)}
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
            min={12}
            max={48}
            onChange={(val) => updateField('eventCard', 'emojiSize', val)}
          />
          <NumericControl
            label="Distanță Emoji - Text"
            value={settings.eventCard.gapEmojiToContent}
            min={0}
            max={32}
            onChange={(val) => updateField('eventCard', 'gapEmojiToContent', val)}
          />
          <NumericControl
            label="Distanță Oră - Titlu"
            value={settings.eventCard.gapTimeToTitle}
            min={0}
            max={20}
            onChange={(val) => updateField('eventCard', 'gapTimeToTitle', val)}
          />
          <NumericControl
            label="Padding Vertical Eveniment"
            value={settings.eventCard.paddingVertical}
            min={0}
            max={20}
            onChange={(val) => updateField('eventCard', 'paddingVertical', val)}
          />
          <NumericControl
            label="Mărime Font Titlu"
            value={settings.eventCard.titleFontSize}
            min={10}
            max={24}
            onChange={(val) => updateField('eventCard', 'titleFontSize', val)}
          />
          <NumericControl
            label="Înălțime Linie Titlu (Line Height)"
            value={settings.eventCard.titleLineHeight}
            min={10}
            max={36}
            onChange={(val) => updateField('eventCard', 'titleLineHeight', val)}
          />
          <NumericControl
            label="Mărime Font Detaliu (Feature)"
            value={settings.eventCard.featureFontSize}
            min={8}
            max={20}
            onChange={(val) => updateField('eventCard', 'featureFontSize', val)}
          />
          <NumericControl
            label="Mărime Caracter Separator (/)"
            value={settings.eventCard.slashFontSize}
            min={8}
            max={20}
            onChange={(val) => updateField('eventCard', 'slashFontSize', val)}
          />
          <NumericControl
            label="Mărime Font Oră"
            value={settings.eventCard.timeFontSize}
            min={8}
            max={18}
            onChange={(val) => updateField('eventCard', 'timeFontSize', val)}
          />
        </div>
      </div>
    </div>
  );
};