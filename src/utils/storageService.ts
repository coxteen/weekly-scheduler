import type { PosterCustomizableSettings } from '../types/posterCustomizer';
import type { SlideCount } from './paginationUtils';
import { DEFAULT_POSTER_SETTINGS } from '../constants/posterThemeConfig';

const STORAGE_KEYS = {
  SLIDES_SETTINGS: 'zborhub_poster_slides_settings_v1',
  SLIDE_COUNT: 'zborhub_poster_slide_count_v1',
} as const;

function mergeWithDefaultSettings(
  partial?: Partial<PosterCustomizableSettings>
): PosterCustomizableSettings {
  if (!partial || typeof partial !== 'object') {
    return { ...DEFAULT_POSTER_SETTINGS };
  }

  return {
    layout: {
      ...DEFAULT_POSTER_SETTINGS.layout,
      ...(partial.layout || {}),
    },
    header: {
      ...DEFAULT_POSTER_SETTINGS.header,
      ...(partial.header || {}),
    },
    daySection: {
      ...DEFAULT_POSTER_SETTINGS.daySection,
      ...(partial.daySection || {}),
    },
    eventCard: {
      ...DEFAULT_POSTER_SETTINGS.eventCard,
      ...(partial.eventCard || {}),
    },
  };
}

export function loadStoredSlidesSettings(): Record<number, PosterCustomizableSettings> {
  const fallback: Record<number, PosterCustomizableSettings> = {
    0: { ...DEFAULT_POSTER_SETTINGS },
    1: { ...DEFAULT_POSTER_SETTINGS },
    2: { ...DEFAULT_POSTER_SETTINGS },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLIDES_SETTINGS);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;

    return {
      0: mergeWithDefaultSettings(parsed[0]),
      1: mergeWithDefaultSettings(parsed[1]),
      2: mergeWithDefaultSettings(parsed[2]),
    };
  } catch (error) {
    console.warn('[storageService] Nu s-au putut încărca setările din localStorage:', error);
    return fallback;
  }
}

export function saveStoredSlidesSettings(
  settings: Record<number, PosterCustomizableSettings>
): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SLIDES_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('[storageService] Eroare la salvarea setărilor în localStorage:', error);
  }
}

export function loadStoredSlideCount(): SlideCount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLIDE_COUNT);
    if (raw === '3') return 3;
    return 2;
  } catch {
    return 2;
  }
}

export function saveStoredSlideCount(count: SlideCount): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SLIDE_COUNT, String(count));
  } catch (error) {
    console.warn('[storageService] Eroare la salvarea numărului de slide-uri:', error);
  }
}