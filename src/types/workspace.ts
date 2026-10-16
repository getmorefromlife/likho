export type ThemeId = 'sepia' | 'dark' | 'white';

export type NastaliqFont =
  | 'Noto Nastaliq Urdu'
  | 'Jameel Noori Nastaliq'
  | 'Mehr Nastaliq Web'
  | 'Gulzar';

export type LayoutPreset = 'classic' | 'zen' | 'swapped' | 'bottom_dock';

export type MarkerOption = 'strike' | 'glow' | 'check';

export interface WorkspacePrefs {
  theme: ThemeId;
  fontFamily: NastaliqFont;
  fontSize: number; // 16 to 36
  lineHeight: number; // 2.0 to 3.2
  isLocked: boolean;
  activePreset: LayoutPreset;
  verticalSplitPct: number; // Percentage for Editor Canvas (e.g. 70 means 70% canvas, 30% companion)
  horizontalSplitPct: number; // Percentage for Top Tray vs Workspace (e.g. 20 means 20% tray)
  qafiyaDockPosition: 'top' | 'bottom';
  qafiyaZoom: number; // Zoom percentage/multiplier for tray chips (e.g. 14 to 26 px)
  qafiyaMarkerStyle: MarkerOption;
  isZenMode: boolean;
  companionOpen: boolean;
  qafiyaTrayOpen: boolean;
  showLiveScansion: boolean;
}
