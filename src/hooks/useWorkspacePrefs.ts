import { useState, useEffect, useCallback } from 'react';
import { WorkspacePrefs, LayoutPreset, ThemeId, NastaliqFont, MarkerOption } from '../types/workspace';

const STORAGE_KEY = 'qalam_workspace_prefs';

const DEFAULT_PREFS: WorkspacePrefs = {
  theme: 'sepia',
  fontFamily: 'Noto Nastaliq Urdu',
  fontSize: 22,
  lineHeight: 2.5,
  isLocked: false,
  activePreset: 'classic',
  verticalSplitPct: 70, // 70% Right (Canvas), 30% Left (Tools)
  horizontalSplitPct: 18, // 18% Tray height
  qafiyaDockPosition: 'top',
  qafiyaZoom: 18,
  qafiyaMarkerStyle: 'strike',
  isZenMode: false,
  companionOpen: true,
  qafiyaTrayOpen: true,
  showLiveScansion: true,
};

export function useWorkspacePrefs() {
  const [prefs, setPrefs] = useState<WorkspacePrefs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse workspace prefs:', e);
    }
    return DEFAULT_PREFS;
  });

  // Save to localStorage whenever prefs change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save workspace prefs:', e);
    }
  }, [prefs]);

  // Apply theme class to document body / root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', prefs.theme);
  }, [prefs.theme]);

  const setTheme = useCallback((theme: ThemeId) => {
    setPrefs((prev) => ({ ...prev, theme }));
  }, []);

  const setFontFamily = useCallback((fontFamily: NastaliqFont) => {
    setPrefs((prev) => ({ ...prev, fontFamily }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setPrefs((prev) => ({ ...prev, fontSize: Math.max(16, Math.min(38, fontSize)) }));
  }, []);

  const setLineHeight = useCallback((lineHeight: number) => {
    setPrefs((prev) => ({ ...prev, lineHeight: Math.max(1.8, Math.min(3.4, lineHeight)) }));
  }, []);

  const toggleLock = useCallback(() => {
    setPrefs((prev) => ({ ...prev, isLocked: !prev.isLocked }));
  }, []);

  const setVerticalSplitPct = useCallback((pct: number) => {
    setPrefs((prev) => {
      if (prev.isLocked) return prev;
      return { ...prev, verticalSplitPct: Math.max(25, Math.min(85, pct)) };
    });
  }, []);

  const setHorizontalSplitPct = useCallback((pct: number) => {
    setPrefs((prev) => {
      if (prev.isLocked) return prev;
      return { ...prev, horizontalSplitPct: Math.max(10, Math.min(45, pct)) };
    });
  }, []);

  const setQafiyaZoom = useCallback((zoom: number) => {
    setPrefs((prev) => ({ ...prev, qafiyaZoom: Math.max(13, Math.min(28, zoom)) }));
  }, []);

  const setQafiyaMarkerStyle = useCallback((style: MarkerOption) => {
    setPrefs((prev) => ({ ...prev, qafiyaMarkerStyle: style }));
  }, []);

  const applyPreset = useCallback((preset: LayoutPreset) => {
    setPrefs((prev) => {
      switch (preset) {
        case 'zen':
          return {
            ...prev,
            activePreset: 'zen',
            isZenMode: true,
            companionOpen: false,
            qafiyaTrayOpen: false,
            verticalSplitPct: 100,
          };
        case 'swapped':
          return {
            ...prev,
            activePreset: 'swapped',
            isZenMode: false,
            companionOpen: true,
            qafiyaTrayOpen: true,
            verticalSplitPct: 30, // Tools on right/left swapped
          };
        case 'bottom_dock':
          return {
            ...prev,
            activePreset: 'bottom_dock',
            isZenMode: false,
            companionOpen: true,
            qafiyaTrayOpen: true,
            qafiyaDockPosition: 'bottom',
            verticalSplitPct: 70,
          };
        case 'classic':
        default:
          return {
            ...prev,
            activePreset: 'classic',
            isZenMode: false,
            companionOpen: true,
            qafiyaTrayOpen: true,
            qafiyaDockPosition: 'top',
            verticalSplitPct: 70,
          };
      }
    });
  }, []);

  const toggleZenMode = useCallback(() => {
    setPrefs((prev) => {
      const nextZen = !prev.isZenMode;
      return {
        ...prev,
        isZenMode: nextZen,
        companionOpen: !nextZen,
        qafiyaTrayOpen: !nextZen,
        verticalSplitPct: nextZen ? 100 : 70,
      };
    });
  }, []);

  const toggleCompanion = useCallback(() => {
    setPrefs((prev) => ({ ...prev, companionOpen: !prev.companionOpen }));
  }, []);

  const toggleQafiyaTray = useCallback(() => {
    setPrefs((prev) => ({ ...prev, qafiyaTrayOpen: !prev.qafiyaTrayOpen }));
  }, []);

  const toggleLiveScansion = useCallback(() => {
    setPrefs((prev) => ({ ...prev, showLiveScansion: !prev.showLiveScansion }));
  }, []);

  return {
    prefs,
    setTheme,
    setFontFamily,
    setFontSize,
    setLineHeight,
    toggleLock,
    setVerticalSplitPct,
    setHorizontalSplitPct,
    setQafiyaZoom,
    setQafiyaMarkerStyle,
    applyPreset,
    toggleZenMode,
    toggleCompanion,
    toggleQafiyaTray,
    toggleLiveScansion,
  };
}
