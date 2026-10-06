export interface PosterCustomizableSettings {
  layout: {
    paddingHorizontal: number;
    paddingTop: number;
    paddingBottom: number;
    daysGap: number;
  };
  header: {
    titleFontSize: number;
    titleLetterSpacing: number;
    periodFontSize: number;
    periodLetterSpacing: number;
  };
  daySection: {
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    eventsGap: number;
    headerFontSize: number;
  };
  eventCard: {
    emojiSize: number;
    gapEmojiToContent: number;
    gapTimeToTitle: number;
    titleFontSize: number;
    titleLineHeight: number;
    featureFontSize: number;
    slashFontSize: number;
    timeFontSize: number;
    paddingVertical: number;
  };
}

export interface PosterPreset {
  id: string;
  name: string;
  isBuiltIn?: boolean;
  settings: Record<number, PosterCustomizableSettings>;
  updatedAt: string;
}