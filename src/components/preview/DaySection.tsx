import type { DaySchedule } from '../../types/schedule';
import { EventCard } from './EventCard';
import { POSTER_CONFIG } from '../../constants/posterThemeConfig';

interface DaySectionProps {
  day: DaySchedule;
  cardBackgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const DaySection = ({
  day,
  cardBackgroundColor,
  textColor = '#FFFFFF',
  accentColor = '#FFFFFF',
}: DaySectionProps) => {
  if (!day.isEnabled) return null;

  const cfg = POSTER_CONFIG.daySection;

  const capitalizedMonth = day.monthName
    ? day.monthName.charAt(0).toUpperCase() + day.monthName.slice(1)
    : '';

  return (
    <div
      className="shadow-2xs flex flex-col transition-colors"
      style={{
        backgroundColor: cardBackgroundColor || cfg.cardBackgroundColor,
        border: cfg.border,
        borderRadius: cfg.borderRadius,
        padding: cfg.padding,
        color: textColor,
        gap: '8px',
      }}
    >
      <div>
        <span
          className="font-black uppercase opacity-95 block"
          style={{
            color: accentColor,
            fontSize: cfg.headerFontSize,
            letterSpacing: cfg.headerLetterSpacing,
          }}
        >
          {day.dayName}, {day.dayNumber} {capitalizedMonth}
        </span>
      </div>

      <div className="flex flex-col" style={{ gap: cfg.eventsGap }}>
        {day.events.length === 0 ? (
          <p className="text-xs opacity-45 italic py-1">
            Fără ateliere programate
          </p>
        ) : (
          day.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              textColor={textColor}
              // AM ȘTERS accentColor și delayIndex de aici!
            />
          ))
        )}
      </div>
    </div>
  );
};