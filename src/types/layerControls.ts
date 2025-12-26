export interface LayerSettings {
  visible: boolean;
  wireframe: boolean;
  opacity: number; // 0-100
  heightRange: [number, number]; // [min, max] in meters
  colorMode: ColorMode;
}

export type ColorMode = 'height' | 'variance' | 'source' | 'area';

export const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  height: 'Height',
  variance: 'Uncertainty',
  source: 'Polygon Source',
  area: 'Footprint Area',
};

export const COLOR_MODE_DESCRIPTIONS: Record<ColorMode, string> = {
  height: 'Building height estimated from satellite imagery using a model trained on LiDAR data',
  variance: 'Height uncertainty - variance across 4 predictions. Higher = less confident',
  source: 'Building footprint source: OSM, Google, Microsoft, or other datasets',
  area: 'Building footprint area calculated from polygon geometry',
};

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
