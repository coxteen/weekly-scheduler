export const POSTER_CONFIG = {
  layout: {
    maxWidth: '420px',
    aspectRatio: '9 / 19.5',
    minHeight: '850px',
    borderRadius: '36px',
    padding: {
      sides: '20px',
      bottom: '40px',
    },
    daysGap: '16px',
  },
  daySection: {
    cardBackgroundColor: 'rgba(0, 0, 0, 0.20)',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '14px',
    padding: '8px 12px',
    headerFontSize: '12px',
    headerLetterSpacing: '0.05em',
    eventsGap: '8px',
  },
  eventCard: {
    emojiSize: 24,
    gapBetweenEmojiAndText: '12px',
    gapBetweenTimeAndTitle: '0px',
    titleFontSize: '14px',
    titleLineHeight: '1',
    featureFontSize: '12px',
    slashFontSize: '12px',
    timeFontSize: '10px',
    verticalPadding: '0px',
  },
  header: {
    titleSmallFontSize: '20px', 
    titleSmallLetterSpacing: '0.16em',
    titleSmallOpacity: '1',
    periodFontSize: '36px',
  },
} as const;