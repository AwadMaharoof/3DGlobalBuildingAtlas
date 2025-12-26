import { GeoJsonLayer } from '@deck.gl/layers';
import type { BuildingCollection, BuildingFeature } from '../../types/building';
import { getColorForHeight } from '../../utils/colorScale';
import { filterBuildingsByHeight } from '../../utils/filterBuildings';

const DEFAULT_HEIGHT = 10;

export interface BuildingLayerOptions {
  wireframeMode?: boolean; // true = wireframe only, false = filled with edges
  opacity?: number; // 0-1
  heightRange?: [number, number];
  darkMode?: boolean;
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
    darkMode = false
  } = options;

  // Wireframe color: black for light mode, white for dark mode
  const wireframeColor: [number, number, number, number] = darkMode
    ? [255, 255, 255, Math.round(255 * opacity)]
    : [0, 0, 0, Math.round(255 * opacity)];

  // Client-side height filtering using shared utility
  const filteredData = filterBuildingsByHeight(data, heightRange);

  return new GeoJsonLayer({
    id,
    data: filteredData,

    // 3D Extrusion
    extruded: true,
    getElevation: (feature) =>
      (feature as BuildingFeature).properties.height ?? DEFAULT_HEIGHT,

    // Fill color - Viridis scale based on height (disabled in wireframe mode)
    filled: !wireframeMode,
    getFillColor: (feature) => {
      const color = getColorForHeight((feature as BuildingFeature).properties.height);
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
      getFillColor: [filteredData, opacity, wireframeMode],
      getLineColor: [opacity, darkMode]
    }
  });
}
