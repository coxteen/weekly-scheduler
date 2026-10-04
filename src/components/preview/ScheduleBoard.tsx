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
          className="w-full shadow-2xl relative flex flex-col overflow-hidden"
          style={{
            backgroundColor: config.theme.backgroundColor,
            color: config.theme.textColor,
            maxWidth: layout.maxWidth,
            aspectRatio: layout.aspectRatio,
            minHeight: layout.minHeight,
            borderRadius: layout.borderRadius,
            paddingLeft: layout.padding.sides,
            paddingRight: layout.padding.sides,
            paddingBottom: layout.padding.bottom,
          }}
        >
          <div 
            className="flex flex-col items-center justify-center w-full" 
            style={{ flexGrow: 2 }}
          >
            <div
              className="font-black text-white"
              style={{
                fontSize: header.titleSmallFontSize,
                letterSpacing: header.titleSmallLetterSpacing,
                opacity: header.titleSmallOpacity,
              }}
            >
              PROGRAM
            </div>
            <div
              className="font-bold text-white uppercase leading-none mt-1"
              style={{
                fontSize: header.periodFontSize,
              }}
            >
              {periodText}
            </div>
          </div>

          <div 
            className="w-full flex-none flex flex-col"
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

          <div className="w-full" style={{ flexGrow: 1 }} aria-hidden="true" />
        </div>
      </div>
    );
  }
);

ScheduleBoard.displayName = 'ScheduleBoard';