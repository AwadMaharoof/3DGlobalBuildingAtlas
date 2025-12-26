export const PROPERTY_LABELS: Record<string, string> = {
  ogc_fid: 'Feature ID',
  id: 'Building ID',
  height: 'Height',
  source: 'Polygon Source',
  region: 'Region',
  var: 'Height Uncertainty',
};

export function formatPropertyValue(key: string, value: unknown): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  if (key === 'height' || key === 'var') {
    return `${Number(value).toFixed(1)} m`;
  }

  return String(value);
}
