import { GeoJsonLayer } from '@deck.gl/layers';
import type { BuildingCollection, BuildingFeature } from '../../types/building';
import type { ColorMode } from '../../types/layerControls';
import {
  getColorForHeight,
  getColorForVariance,
  getColorForSource,
  getColorForArea,
} from '../../utils/colorScale';
import { getCachedArea } from '../../utils/areaCalculation';
import { filterBuildingsByHeight } from '../../utils/filterBuildings';

const DEFAULT_HEIGHT = 10;

export interface BuildingLayerOptions {
  wireframeMode?: boolean; // true = wireframe only, false = filled with edges
  opacity?: number; // 0-1
  heightRange?: [number, number];
  darkMode?: boolean;
  colorMode?: ColorMode;
}

type ColorGetter = (feature: BuildingFeature) => [number, number, number, number];

function getColorGetter(colorMode: ColorMode): ColorGetter {
  switch (colorMode) {
    case 'height':
      return (feature) => getColorForHeight(feature.properties.height);
    case 'variance':
      return (feature) => getColorForVariance(feature.properties.var);
    case 'source':
      return (feature) => getColorForSource(feature.properties.source);
    case 'area':
      return (feature) => getColorForArea(getCachedArea(feature.geometry));
    default:
      return (feature) => getColorForHeight(feature.properties.height);
  }
}

export function createBuildingLayer(
  data: BuildingCollection | null,
  options: BuildingLayerOptions = {},
  id: string = 'buildings-3d'
) {
  if (!data) return null;

  const {
    wireframeMode = false,
    opacity = 1,
    heightRange = [0, Infinity],
    darkMode = false,
    colorMode = 'height'
  } = options;

  // Wireframe color: black for light mode, white for dark mode
  const wireframeColor: [number, number, number, number] = darkMode
    ? [255, 255, 255, Math.round(255 * opacity)]
    : [0, 0, 0, Math.round(255 * opacity)];

  // Client-side height filtering using shared utility
  const filteredData = filterBuildingsByHeight(data, heightRange);

  // Get color function based on current mode
  const colorGetter = getColorGetter(colorMode);

  return new GeoJsonLayer({
    id,
    data: filteredData,

    // 3D Extrusion
    extruded: true,
    getElevation: (feature) =>
      (feature as BuildingFeature).properties.height ?? DEFAULT_HEIGHT,

    // Fill color based on selected color mode (disabled in wireframe mode)
    filled: !wireframeMode,
    getFillColor: (feature) => {
      const color = colorGetter(feature as BuildingFeature);
      return [color[0], color[1], color[2], Math.round(color[3] * opacity)] as [number, number, number, number];
    },

    // Wireframe edges (always on)
    wireframe: true,
    getLineColor: wireframeColor,
    lineWidthMinPixels: 1,

    // 3D lighting material
    material: {
      ambient: 0.35,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [60, 64, 70]
    },

    // Interactivity
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 200, 0, 180],

    // Enable color transitions
    updateTriggers: {
      getFillColor: [filteredData, opacity, wireframeMode, colorMode],
      getLineColor: [opacity, darkMode]
    }
  });
}
