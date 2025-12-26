export interface LayerSettings {
  visible: boolean;
  wireframe: boolean;
  opacity: number; // 0-100
  heightRange: [number, number]; // [min, max] in meters
}

export type BasemapStyle = 'light' | 'dark';

export interface BasemapOption {
  id: BasemapStyle;
  label: string;
  url: string;
}

export const BASEMAP_STYLES: Record<BasemapStyle, string> = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};
