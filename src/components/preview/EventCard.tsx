import type { ScheduleEvent } from '../../types/schedule';
import type { PosterCustomizableSettings } from '../../types/posterCustomizer';
import { AppleEmoji } from '../common/AppleEmoji';
import { DEFAULT_POSTER_SETTINGS } from '../../constants/posterThemeConfig';

interface EventCardProps {
  event: ScheduleEvent;
  settings?: PosterCustomizableSettings;
  textColor?: string;
}

export const EventCard = ({
  event,
  settings = DEFAULT_POSTER_SETTINGS,
  textColor = '#FFFFFF',
}: EventCardProps) => {
  const cfg = settings.eventCard;
  const trimmedFeature = event.feature?.trim() || '';

  return (
    <div
      className="flex items-stretch"
      style={{
        color: textColor,
        gap: `${cfg.gapEmojiToContent}px`,
        paddingTop: `${cfg.paddingVertical}px`,
        paddingBottom: `${cfg.paddingVertical}px`,
      }}
    >
      <div 
        className="shrink-0 flex items-center justify-center"
        style={{ minHeight: `${cfg.emojiSize}px` }}
      >
        <AppleEmoji emoji={event.emoji} size={cfg.emojiSize} />
      </div>

      <div
        className={`flex flex-col min-w-0 flex-1 ${event.time ? 'justify-between' : 'justify-center'}`}
        style={{
          lineHeight: `${cfg.titleLineHeight}px`,
          gap: `${cfg.gapTimeToTitle}px`,
        }}
      >
        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
          <span
            className="font-bold tracking-tight inline text-white"
            style={{ fontSize: `${cfg.titleFontSize}px` }}
          >
            {event.title}
          </span>

          {trimmedFeature && (
            <>
              <span
                className="font-bold select-none inline text-white"
                style={{ fontSize: `${cfg.slashFontSize}px` }}
              >
                /
              </span>
              <span
                className="italic inline text-white"
                style={{ fontSize: `${cfg.featureFontSize}px` }}
              >
                {trimmedFeature}
              </span>
            </>
          )}
        </div>

        {event.time && (
          <span
            className="font-normal tracking-wide mt-1 block text-white"
            style={{
              fontSize: `${cfg.timeFontSize}px`,
              lineHeight: 1.2,
            }}
          >
            {event.time}
          </span>
        )}
      </div>
    </div>
  );
};