import type { ChangeEvent } from 'react';

export interface PosterSliderControlProps {
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

export const PosterSliderControl = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  onChange,
  onInteractionStart,
  onInteractionEnd,
}: PosterSliderControlProps) => {
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
    <div className="flex flex-col gap-1.5 py-1.5">
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
            className="w-16 px-2 py-0.5 bg-[#101018] border border-[#26263a] rounded-lg text-xs text-neutral-100 text-right focus:outline-none focus:border-indigo-500 font-mono transition-colors"
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
          className="w-full h-1.5 bg-[#181826] rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none touch-none"
        />
      </div>
    </div>
  );
};