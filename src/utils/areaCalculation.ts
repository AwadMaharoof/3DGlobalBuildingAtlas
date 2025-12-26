import type { Position, Polygon, MultiPolygon } from 'geojson';

/**
 * Calculate the area of a polygon ring using the Shoelace formula.
 * Converts from degrees² to approximate square meters.
 */
function calculateRingArea(coordinates: Position[]): number {
  if (coordinates.length < 4) return 0; // Need at least 3 points + closing point

  const n = coordinates.length - 1; // Exclude closing point

  // Get reference point (first vertex) for relative coordinates
  // This improves numerical stability for the Shoelace formula
  const [refLon, refLat] = coordinates[0];

  // Calculate average latitude for the degree-to-meter conversion
  const avgLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
  const latRadians = (avgLat * Math.PI) / 180;

  // Convert degrees to meters at this latitude
  const metersPerDegreeLon = 111320 * Math.cos(latRadians);
  const metersPerDegreeLat = 111320;

  // Convert coordinates to meters relative to reference point
  const metersCoords: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const [lon, lat] = coordinates[i];
    metersCoords.push([
      (lon - refLon) * metersPerDegreeLon,
      (lat - refLat) * metersPerDegreeLat
    ]);
  }

  // Apply Shoelace formula in meters
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const [x1, y1] = metersCoords[i];
    const [x2, y2] = metersCoords[j];
    area += x1 * y2;
    area -= x2 * y1;
  }

  return Math.abs(area) / 2;
}

/**
 * Calculate polygon area from GeoJSON geometry.
 * Handles both Polygon and MultiPolygon types.
 * Returns area in square meters.
 */
export function calculatePolygonArea(geometry: Polygon | MultiPolygon): number {
  if (geometry.type === 'Polygon') {
    // Exterior ring area minus hole areas
    let area = calculateRingArea(geometry.coordinates[0]);
    for (let i = 1; i < geometry.coordinates.length; i++) {
      area -= calculateRingArea(geometry.coordinates[i]);
    }
    return area;
  } else if (geometry.type === 'MultiPolygon') {
    // Sum all polygon areas (each with holes subtracted)
    return geometry.coordinates.reduce((total, polygon) => {
      let area = calculateRingArea(polygon[0]);
      for (let i = 1; i < polygon.length; i++) {
        area -= calculateRingArea(polygon[i]);
      }
      return total + area;
    }, 0);
  }
  return 0;
}

// Cache for computed areas to avoid recalculation
const areaCache = new WeakMap<object, number>();

/**
 * Get cached area for a geometry, computing if necessary.
 * Uses WeakMap for automatic garbage collection when geometries are removed.
 */
export function getCachedArea(geometry: Polygon | MultiPolygon): number {
  let area = areaCache.get(geometry);
  if (area === undefined) {
    area = calculatePolygonArea(geometry);
    areaCache.set(geometry, area);
  }
  return area;
}
