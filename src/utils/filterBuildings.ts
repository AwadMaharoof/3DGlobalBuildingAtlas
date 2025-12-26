import type { BuildingCollection, BuildingFeature } from '../types/building';

/**
 * Filters buildings by height range.
 * @param data - Building collection to filter
 * @param heightRange - [min, max] height range in meters
 * @returns Filtered building collection
 */
export function filterBuildingsByHeight(
  data: BuildingCollection,
  heightRange: [number, number]
): BuildingCollection {
  return {
    ...data,
    features: data.features.filter(feature => {
      const height = feature.properties.height ?? 0;
      return height >= heightRange[0] && height <= heightRange[1];
    })
  };
}

/**
 * Counts buildings within a height range without creating a new array.
 * More efficient than filtering when you only need the count.
 */
export function countBuildingsInHeightRange(
  features: BuildingFeature[],
  heightRange: [number, number]
): number {
  let count = 0;
  for (const feature of features) {
    const height = feature.properties.height ?? 0;
    if (height >= heightRange[0] && height <= heightRange[1]) {
      count++;
    }
  }
  return count;
}
