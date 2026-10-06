import { forwardRef, useRef, useState, useLayoutEffect } from 'react';
import type { WeeklyScheduleConfig } from '../../types/schedule';
import type { SchedulePage } from '../../utils/paginationUtils';
import type { PosterCustomizableSettings } from '../../types/posterCustomizer';
import { formatPeriodHeader } from '../../utils/dateUtils';
import { DaySection } from './DaySection';
import { POSTER_FIXED_CONFIG, DEFAULT_POSTER_SETTINGS } from '../../constants/posterThemeConfig';

// Rezoluția de referință 9:16
const VIRTUAL_WIDTH = 1080;
const VIRTUAL_HEIGHT = 1920;

interface ScheduleBoardProps {
  config: WeeklyScheduleConfig;
  page: SchedulePage;
  settings?: PosterCustomizableSettings;
}

export const ScheduleBoard = forwardRef<HTMLDivElement, ScheduleBoardProps>(
  ({ config, page, settings = DEFAULT_POSTER_SETTINGS }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const periodText = formatPeriodHeader(
      config.startDate,
      config.endDate,
      config.includeYear ?? false
    );
    const { layout: fixedLayout } = POSTER_FIXED_CONFIG;
    const { layout, header } = settings;

    // Recalculează automat scara pe baza raportului disponibil, indiferent de rezoluție
    useLayoutEffect(() => {
      const updateScale = () => {
        if (!containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;

        // Raport de scalare uniform care încape perfect în spațiu
        const scaleX = clientWidth / VIRTUAL_WIDTH;
        const scaleY = clientHeight / VIRTUAL_HEIGHT;
        const optimalScale = Math.min(scaleX, scaleY);

        if (optimalScale > 0) {
          setScale(optimalScale);
        }
      };

      updateScale();

      const observer = new ResizeObserver(updateScale);
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      window.addEventListener('resize', updateScale);
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateScale);
      };
    }, []);

    return (
      // 1. Container exterior flexibil: ocupă înălțimea disponibilă din viewport și menține proporția
      <div
        ref={containerRef}
        className="w-full h-[70vh] md:h-[82vh] flex items-center justify-center overflow-hidden relative"
      >
        {/* 2. Wrapper scalat care își păstrează bounding-box-ul exact în fluxul DOM */}
        <div
          style={{
            width: `${VIRTUAL_WIDTH * scale}px`,
            height: `${VIRTUAL_HEIGHT * scale}px`,
          }}
          className="relative shrink-0 shadow-2xl flex items-center justify-center"
        >
          {/* 3. Canvasul intern fix 1080x1920: scalează unitar din colțul stânga-sus */}
          <div
            ref={ref}
            data-page-number={page.pageNumber}
            className="flex flex-col overflow-hidden select-none absolute left-0 top-0"
            style={{
              width: `${VIRTUAL_WIDTH}px`,
              height: `${VIRTUAL_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              backgroundColor: config.theme.backgroundColor,
              color: config.theme.textColor,
              borderRadius: fixedLayout.borderRadius,
              paddingLeft: `${layout.paddingHorizontal}px`,
              paddingRight: `${layout.paddingHorizontal}px`,
              paddingTop: `${layout.paddingTop}px`,
              paddingBottom: `${layout.paddingBottom}px`,
            }}
          >
            {/* Header */}
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
                className="font-bold text-white uppercase leading-none mt-2"
                style={{
                  fontSize: `${header.periodFontSize}px`,
                  letterSpacing: `${header.periodLetterSpacing}em`,
                }}
              >
                {periodText}
              </div>
            </div>

            {/* Zile */}
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

            {/* Spacer inferior */}
            <div className="w-full" style={{ flexGrow: 1 }} aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }
);

ScheduleBoard.displayName = 'ScheduleBoard';