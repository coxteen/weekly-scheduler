import { forwardRef } from 'react';
import type { WeeklyScheduleConfig } from '../../types/schedule';
import type { SchedulePage } from '../../utils/paginationUtils';
import type { PosterCustomizableSettings } from '../../types/posterCustomizer';
import { formatPeriodHeader } from '../../utils/dateUtils';
import { DaySection } from './DaySection';
import { POSTER_FIXED_CONFIG, DEFAULT_POSTER_SETTINGS } from '../../constants/posterThemeConfig';

interface ScheduleBoardProps {
  config: WeeklyScheduleConfig;
  page: SchedulePage;
  settings?: PosterCustomizableSettings;
}

export const ScheduleBoard = forwardRef<HTMLDivElement, ScheduleBoardProps>(
  ({ config, page, settings = DEFAULT_POSTER_SETTINGS }, ref) => {
    const periodText = formatPeriodHeader(
      config.startDate, 
      config.endDate,
      config.includeYear ?? false
    );
    const { layout: fixedLayout } = POSTER_FIXED_CONFIG;
    const { layout, header } = settings;

    return (
      <div className="w-full flex justify-center items-center h-[82vh]">
        <div
          ref={ref}
          data-page-number={page.pageNumber}
          className="h-full aspect-[9/16] max-w-full shadow-2xl relative flex flex-col overflow-hidden shrink-0 select-none"
          style={{
            backgroundColor: config.theme.backgroundColor,
            color: config.theme.textColor,
            borderRadius: fixedLayout.borderRadius,
            paddingLeft: `${layout.paddingHorizontal}px`,
            paddingRight: `${layout.paddingHorizontal}px`,
            paddingTop: `${layout.paddingTop}px`,
            paddingBottom: `${layout.paddingBottom}px`,
          }}
        >
          <div 
            className="flex flex-col items-center justify-center w-full" 
            style={{ flexGrow: 2 }}
          >
            <div
              className="font-black text-white"
              style={{
                fontSize: `${header.titleFontSize}px`,
                letterSpacing: `${header.titleLetterSpacing}em`,
              }}
            >
              PROGRAM
            </div>
            <div
              className="font-bold text-white uppercase leading-none mt-1"
              style={{
                fontSize: `${header.periodFontSize}px`,
                letterSpacing: `${header.periodLetterSpacing}em`,
              }}
            >
              {periodText}
            </div>
          </div>

          <div 
            className="w-full flex-none flex flex-col justify-center"
            style={{ gap: `${layout.daysGap}px` }}
          >
            {page.days.map((day) => (
              <DaySection
                key={day.id}
                day={day}
                settings={settings}
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