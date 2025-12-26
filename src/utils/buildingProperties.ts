export const PROPERTY_LABELS: Record<string, string> = {
  ogc_fid: 'Feature ID',
  id: 'Building ID',
  height: 'Height',
  source: 'Data Source',
  region: 'Region',
  variance: 'Height Variance',
};

export function formatPropertyValue(key: string, value: unknown): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  if (key === 'height' || key === 'variance') {
    return `${Number(value).toFixed(1)} m`;
  }

  return String(value);
}
