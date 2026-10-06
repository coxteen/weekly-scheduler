import type { PosterCustomizableSettings } from '../types/posterCustomizer';

export const POSTER_FIXED_CONFIG = {
  layout: {
    aspectRatio: '9 / 16',
    borderRadius: '64px',
  },
  daySection: {
    cardBackgroundColor: 'rgba(0, 0, 0, 0.22)',
    border: '2px solid rgba(255, 255, 255, 0.08)',
    headerLetterSpacing: '0.06em',
  },
} as const;

export const DEFAULT_POSTER_SETTINGS: PosterCustomizableSettings = {
  layout: {
    paddingHorizontal: 72,
    paddingTop: 40,
    paddingBottom: 80,
    daysGap: 36,
  },
  header: {
    titleFontSize: 56,
    titleLetterSpacing: 0.16,
    periodFontSize: 68,
    periodLetterSpacing: 0.08,
  },
  daySection: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 28,
    eventsGap: 14,
    headerFontSize: 26,
  },
  eventCard: {
    emojiSize: 52,
    gapEmojiToContent: 24,
    gapTimeToTitle: 4,
    titleFontSize: 30,
    titleLineHeight: 34,
    featureFontSize: 24,
    slashFontSize: 24,
    timeFontSize: 22,
    paddingVertical: 4,
  },
};