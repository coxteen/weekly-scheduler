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
  const cfgDay = settings.daySection;
  const trimmedFeature = event.feature?.trim() || '';
  const isHighlighted = Boolean(event.isHighlighted);

  // Culori dinamice pentru contrast optim
  const activeTextColor = isHighlighted ? '#181820' : textColor;
  const activeTitleColor = isHighlighted ? '#0d0d12' : '#FFFFFF';
  const activeTimeColor = isHighlighted ? '#3b3b4a' : '#FFFFFF';
  const activeSlashColor = isHighlighted ? '#727282' : '#FFFFFF';

  // Calcul depășire bordură: anulăm padding-ul secțiunii de zi + 6px extra în afară
  const bleedAmount = cfgDay.paddingHorizontal + 6;

  return (
    <div
      className="flex items-stretch transition-all relative"
      style={{
        color: activeTextColor,
        gap: `${cfg.gapEmojiToContent}px`,
        paddingTop: isHighlighted ? `${cfg.paddingVertical + 7}px` : `${cfg.paddingVertical}px`,
        paddingBottom: isHighlighted ? `${cfg.paddingVertical + 7}px` : `${cfg.paddingVertical}px`,
        paddingLeft: isHighlighted ? `${cfgDay.paddingHorizontal + 6}px` : '0px',
        paddingRight: isHighlighted ? `${cfgDay.paddingHorizontal + 6}px` : '0px',
        marginLeft: isHighlighted ? `-${bleedAmount}px` : '0px',
        marginRight: isHighlighted ? `-${bleedAmount}px` : '0px',
        backgroundColor: isHighlighted ? '#F3F4F6' : 'transparent',
        borderRadius: isHighlighted ? `${cfgDay.borderRadius + 2}px` : '0px',
        boxShadow: isHighlighted ? '0 6px 18px rgba(0, 0, 0, 0.28)' : 'none',
        border: isHighlighted ? '1.5px solid rgba(255, 255, 255, 0.95)' : 'none',
        zIndex: isHighlighted ? 10 : 1,
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
            className="font-bold tracking-tight inline"
            style={{ 
              fontSize: `${cfg.titleFontSize}px`,
              color: activeTitleColor,
            }}
          >
            {event.title}
          </span>

          {trimmedFeature && (
            <>
              <span
                className="font-bold select-none inline"
                style={{ 
                  fontSize: `${cfg.slashFontSize}px`,
                  color: activeSlashColor,
                }}
              >
                /
              </span>
              <span
                className="italic inline"
                style={{ 
                  fontSize: `${cfg.featureFontSize}px`,
                  color: activeTextColor,
                }}
              >
                {trimmedFeature}
              </span>
            </>
          )}
        </div>

        {event.time && (
          <span
            className="font-semibold tracking-wide mt-1 block"
            style={{
              fontSize: `${cfg.timeFontSize}px`,
              lineHeight: 1.2,
              color: activeTimeColor,
            }}
          >
            {event.time}
          </span>
        )}
      </div>
    </div>
  );
};