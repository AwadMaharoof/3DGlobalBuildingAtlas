import { GeoJsonLayer } from '@deck.gl/layers';
import type { BuildingCollection } from '../../types/building';

const DEFAULT_HEIGHT = 10;

export function createBuildingLayer(
  data: BuildingCollection | null,
  id: string = 'buildings-3d'
) {
  if (!data) return null;

  return new GeoJsonLayer({
    id,
    data,

    // 3D Extrusion
    extruded: true,
    getElevation: (feature: { properties?: { height?: number } }) =>
      feature.properties?.height ?? DEFAULT_HEIGHT,

    // Fill color
    filled: true,
    getFillColor: [74, 140, 200, 200],

    // Wireframe for edges
    wireframe: true,
    getLineColor: [50, 50, 50, 255],
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
    highlightColor: [255, 200, 0, 180]
  });
}
