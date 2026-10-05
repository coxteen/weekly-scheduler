import type { PosterCustomizableSettings } from '../types/posterCustomizer';

export const POSTER_FIXED_CONFIG = {
  layout: {
    maxWidth: '420px',
    aspectRatio: '9 / 19.5',
    minHeight: '850px',
    borderRadius: '30px',
  },
  daySection: {
    cardBackgroundColor: 'rgba(0, 0, 0, 0.20)',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    headerLetterSpacing: '0.05em',
  },
} as const;

export const DEFAULT_POSTER_SETTINGS: PosterCustomizableSettings = {
  layout: {
    paddingHorizontal: 30,
    paddingTop: 0,
    paddingBottom: 40,
    daysGap: 20,
  },
  header: {
    titleFontSize: 20,
    titleLetterSpacing: 0.16,
    periodFontSize: 36,
  },
  daySection: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    eventsGap: 8,
    headerFontSize: 12,
  },
  eventCard: {
    emojiSize: 24,
    gapEmojiToContent: 12,
    gapTimeToTitle: 0,
    titleFontSize: 14,
    titleLineHeight: 14,
    featureFontSize: 12,
    slashFontSize: 12,
    timeFontSize: 10,
    paddingVertical: 0,
  },
};