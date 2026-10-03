export const POSTER_CONFIG = {
  layout: {
    maxWidth: '420px',
    aspectRatio: '9 / 19.5',
    minHeight: '850px',
    borderRadius: '36px',
    padding: {
      top: '54px',
      bottom: '48px',
      sides: '22px',
    },
    daysGap: '30px',
  },
  daySection: {
    cardBackgroundColor: 'rgba(0, 0, 0, 0.20)',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '16px',
    padding: '11px 14px',
    headerFontSize: '13.5px',
    headerLetterSpacing: '0.05em',
    eventsGap: '4px',
  },
  eventCard: {
    emojiSize: 28,
    gapBetweenEmojiAndText: '10px',
    titleFontSize: '14px',
    titleLineHeight: '1.15',
    featureFontSize: '12px',
    slashFontSize: '14px',
    timeFontSize: '11px',
    verticalPadding: '2px',
  },
  header: {
    titleSmallFontSize: '13px',
    titleSmallLetterSpacing: '0.22em',
    titleSmallOpacity: '0.9',
    periodFontSize: '30px',
  },
} as const;