import type { DaySchedule } from '../../types/schedule';
import type { PosterCustomizableSettings } from '../../types/posterCustomizer';
import { EventCard } from './EventCard';
import { POSTER_FIXED_CONFIG, DEFAULT_POSTER_SETTINGS } from '../../constants/posterThemeConfig';

interface DaySectionProps {
  day: DaySchedule;
  settings?: PosterCustomizableSettings;
  cardBackgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const DaySection = ({
  day,
  settings = DEFAULT_POSTER_SETTINGS,
  cardBackgroundColor,
  textColor = '#FFFFFF',
  accentColor = '#FFFFFF',
}: DaySectionProps) => {
  if (!day.isEnabled) return null;

  const fixed = POSTER_FIXED_CONFIG.daySection;
  const cfg = settings.daySection;

  const capitalizedMonth = day.monthName
    ? day.monthName.charAt(0).toUpperCase() + day.monthName.slice(1)
    : '';

  return (
    <div
      className="shadow-2xs flex flex-col transition-colors"
      style={{
        backgroundColor: cardBackgroundColor || fixed.cardBackgroundColor,
        border: fixed.border,
        borderRadius: `${cfg.borderRadius}px`,
        padding: `${cfg.paddingVertical}px ${cfg.paddingHorizontal}px`,
        color: textColor,
        gap: '8px',
      }}
    >
      <div>
        <span
          className="font-black uppercase block"
          style={{
            color: accentColor,
            fontSize: `${cfg.headerFontSize}px`,
            letterSpacing: fixed.headerLetterSpacing,
          }}
        >
          {day.dayName}, {day.dayNumber} {capitalizedMonth}
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: `${cfg.eventsGap}px` }}>
        {day.events.length === 0 ? (
          <p className="text-xs opacity-45 italic py-1">
            Fără ateliere programate
          </p>
        ) : (
          day.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              settings={settings}
              textColor={textColor}
            />
          ))
        )}
      </div>
    </div>
  );
};