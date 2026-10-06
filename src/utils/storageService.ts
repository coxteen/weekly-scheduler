import type { PosterCustomizableSettings, PosterPreset } from '../types/posterCustomizer';
import type { SlideCount } from './paginationUtils';
import { DEFAULT_POSTER_SETTINGS } from '../constants/posterThemeConfig';

const STORAGE_KEYS = {
  SLIDES_SETTINGS: 'zborhub_poster_slides_settings_v1',
  SLIDE_COUNT: 'zborhub_poster_slide_count_v1',
  PRESETS: 'zborhub_poster_presets_v1',
  ACTIVE_PRESET_ID: 'zborhub_poster_active_preset_id_v1',
} as const;

// Păstrăm exclusiv profilul Default ZborHub
export const BUILT_IN_PRESETS: PosterPreset[] = [
  {
    id: 'preset-default',
    name: 'Default ZborHub',
    isBuiltIn: true,
    isDefault: true,
    updatedAt: new Date().toISOString(),
    settings: {
      0: { ...DEFAULT_POSTER_SETTINGS },
      1: { ...DEFAULT_POSTER_SETTINGS },
      2: { ...DEFAULT_POSTER_SETTINGS },
    },
  },
];

export function mergeWithDefaultSettings(
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
    console.warn('[storageService] Nu s-au putut încărca setările:', error);
    return fallback;
  }
}

export function saveStoredSlidesSettings(
  settings: Record<number, PosterCustomizableSettings>
): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SLIDES_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('[storageService] Eroare la salvarea setărilor:', error);
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

// ======================== PRESET MANAGER ========================

export function loadStoredPresets(): PosterPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!raw) return BUILT_IN_PRESETS;

    const customPresets: PosterPreset[] = JSON.parse(raw);
    if (!Array.isArray(customPresets)) return BUILT_IN_PRESETS;

    // Fuzionăm doar preset-ul Default ZborHub cu eventualele preset-uri salvate manual de utilizator
    const merged = [...BUILT_IN_PRESETS];
    customPresets.forEach((cp) => {
      // Ignorăm vechile preset-uri 'preset-compact' și 'preset-airy' dacă au rămas în storage
      if (cp.id === 'preset-compact' || cp.id === 'preset-airy') return;

      if (!merged.some((p) => p.id === cp.id)) {
        merged.push({
          ...cp,
          settings: {
            0: mergeWithDefaultSettings(cp.settings?.[0]),
            1: mergeWithDefaultSettings(cp.settings?.[1]),
            2: mergeWithDefaultSettings(cp.settings?.[2]),
          },
        });
      }
    });
    return merged;
  } catch (error) {
    console.warn('[storageService] Eroare la încărcarea preset-urilor:', error);
    return BUILT_IN_PRESETS;
  }
}

export function saveStoredPresets(presets: PosterPreset[]): void {
  try {
    const userCreatedPresets = presets.filter((p) => !p.isBuiltIn);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(userCreatedPresets));
  } catch (error) {
    console.warn('[storageService] Eroare la salvarea preset-urilor:', error);
  }
}

export function loadStoredActivePresetId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PRESET_ID);
    if (!stored || stored === 'preset-compact' || stored === 'preset-airy') {
      return 'preset-default';
    }
    return stored;
  } catch {
    return 'preset-default';
  }
}

export function saveStoredActivePresetId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PRESET_ID, id);
  } catch (error) {
    console.warn('[storageService] Eroare la salvarea presetului activ:', error);
  }
}

export function exportPresetsToJson(presets: PosterPreset[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presets, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `zborhub-poster-presets-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}