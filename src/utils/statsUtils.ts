import type { BuildingCollection } from '../types/building';

export interface HistogramBin {
  label: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface HeightStats {
  count: number;
  withHeight: number;
  noHeight: number;
  min: number;
  max: number;
  avg: number;
  histogram: HistogramBin[];
}

const HISTOGRAM_BINS = [
  { min: 0, max: 10, label: '0-10m' },
  { min: 10, max: 20, label: '10-20m' },
  { min: 20, max: 30, label: '20-30m' },
  { min: 30, max: 50, label: '30-50m' },
  { min: 50, max: 100, label: '50-100m' },
  { min: 100, max: Infinity, label: '100m+' },
];

export function computeBuildingStats(data: BuildingCollection | null): HeightStats | null {
  if (!data || data.features.length === 0) return null;

  const heights: number[] = [];
  let noHeightCount = 0;

  for (const feature of data.features) {
    const h = feature.properties.height;
    if (h !== null && h !== undefined && h > 0) {
      heights.push(h);
    } else {
      noHeightCount++;
    }
  }

  if (heights.length === 0) {
    return {
      count: data.features.length,
      withHeight: 0,
      noHeight: noHeightCount,
      min: 0,
      max: 0,
      avg: 0,
      histogram: HISTOGRAM_BINS.map(bin => ({
        ...bin,
        count: 0,
        percentage: 0,
      })),
    };
  }

  const min = Math.min(...heights);
  const max = Math.max(...heights);
  const avg = heights.reduce((a, b) => a + b, 0) / heights.length;

  const histogram: HistogramBin[] = HISTOGRAM_BINS.map(bin => {
    const count = heights.filter(h => h >= bin.min && h < bin.max).length;
    return {
      ...bin,
      count,
      percentage: (count / heights.length) * 100,
    };
  });

  return {
    count: data.features.length,
    withHeight: heights.length,
    noHeight: noHeightCount,
    min,
    max,
    avg,
    histogram,
  };
}
