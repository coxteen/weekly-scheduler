import type { ScheduleEvent } from '../../types/schedule';
import { AppleEmoji } from '../common/AppleEmoji';
import { POSTER_CONFIG } from '../../constants/posterThemeConfig';

interface EventCardProps {
  event: ScheduleEvent;
  textColor?: string;
}

export const EventCard = ({
  event,
  textColor = '#FFFFFF',
}: EventCardProps) => {
  const cfg = POSTER_CONFIG.eventCard;
  const trimmedFeature = event.feature?.trim() || '';

  return (
    <div
      className="flex items-start"
      style={{
        color: textColor,
        gap: cfg.gapBetweenEmojiAndText,
        paddingTop: cfg.verticalPadding,
        paddingBottom: cfg.verticalPadding,
      }}
    >
      <div className="shrink-0 flex items-center justify-center pt-0.5">
        <AppleEmoji emoji={event.emoji} size={cfg.emojiSize} />
      </div>

      <div
        className="flex flex-col min-w-0 flex-1"
        style={{ lineHeight: cfg.titleLineHeight }}
      >
        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
          <span
            className="font-bold tracking-tight inline text-white"
            style={{ fontSize: cfg.titleFontSize }}
          >
            {event.title}
          </span>

          {trimmedFeature && (
            <>
              <span
                className="font-bold select-none inline text-white"
                style={{ fontSize: cfg.slashFontSize }}
              >
                /
              </span>
              <span
                className="italic inline text-white"
                style={{ fontSize: cfg.featureFontSize }}
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
              fontSize: cfg.timeFontSize,
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