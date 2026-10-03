import { forwardRef } from 'react';
import type { WeeklyScheduleConfig } from '../../types/schedule';
import type { SchedulePage } from '../../utils/paginationUtils';
import { formatPeriodHeader } from '../../utils/dateUtils';
import { DaySection } from './DaySection';
import { POSTER_CONFIG } from '../../constants/posterThemeConfig';

interface ScheduleBoardProps {
  config: WeeklyScheduleConfig;
  page: SchedulePage;
}

export const ScheduleBoard = forwardRef<HTMLDivElement, ScheduleBoardProps>(
  ({ config, page }, ref) => {
    const periodText = formatPeriodHeader(config.startDate, config.endDate);
    const { layout, header } = POSTER_CONFIG;

    return (
      <div className="w-full max-w-[420px] flex justify-center">
        <div
          ref={ref}
          data-page-number={page.pageNumber}
          className="w-full shadow-2xl relative flex flex-col items-center overflow-hidden"
          style={{
            backgroundColor: config.theme.backgroundColor,
            color: config.theme.textColor,
            maxWidth: layout.maxWidth,
            aspectRatio: layout.aspectRatio,
            minHeight: layout.minHeight,
            borderRadius: layout.borderRadius,
            paddingLeft: layout.padding.sides,
            paddingRight: layout.padding.sides,
            paddingTop: layout.padding.top,
            paddingBottom: layout.padding.bottom,
          }}
        >
          <div className="flex-1 w-full flex items-center justify-center">
            <header className="text-center flex flex-col items-center">
              <span
                className="font-bold uppercase text-white"
                style={{
                  fontSize: header.titleSmallFontSize,
                  letterSpacing: header.titleSmallLetterSpacing,
                  opacity: header.titleSmallOpacity,
                }}
              >
                {config.title}
              </span>
              <h1
                className="font-black tracking-tight uppercase mt-0.5 text-white"
                style={{
                  fontSize: header.periodFontSize,
                }}
              >
                {periodText}
              </h1>
            </header>
          </div>

          <div
            className="w-full shrink-0 flex flex-col"
            style={{ gap: layout.daysGap }}
          >
            {page.days.map((day) => (
              <DaySection
                key={day.id}
                day={day}
                cardBackgroundColor={POSTER_CONFIG.daySection.cardBackgroundColor}
                textColor={config.theme.textColor}
                accentColor={config.theme.accentColor}
              />
            ))}
          </div>

          <div className="flex-1 w-full" aria-hidden="true" />
        </div>
      </div>
    );
  }
);

ScheduleBoard.displayName = 'ScheduleBoard';