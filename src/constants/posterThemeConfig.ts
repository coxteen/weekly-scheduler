import type { PosterCustomizableSettings } from '../types/posterCustomizer';

export const POSTER_FIXED_CONFIG = {
  layout: {
    aspectRatio: '9 / 16',
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
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 32,
    daysGap: 16,
  },
  header: {
    titleFontSize: 24,
    titleLetterSpacing: 0.16,
    periodFontSize: 28,
    periodLetterSpacing: 0.08,
  },
  daySection: {
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    eventsGap: 6,
    headerFontSize: 11,
  },
  eventCard: {
    emojiSize: 22,
    gapEmojiToContent: 10,
    gapTimeToTitle: 0,
    titleFontSize: 13,
    titleLineHeight: 14,
    featureFontSize: 11,
    slashFontSize: 11,
    timeFontSize: 10,
    paddingVertical: 0,
  },
};