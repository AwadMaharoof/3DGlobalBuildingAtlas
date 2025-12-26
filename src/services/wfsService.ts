import type { BuildingCollection, BBox } from '../types/building';

const WFS_BASE_URL = 'https://tubvsig-so2sat-vm1.srv.mwn.de/geoserver/ows';

interface WFSParams {
  typeName: string;
  bbox?: BBox;
  maxFeatures?: number;
  srsName?: string;
}

export function buildWFSUrl(params: WFSParams): string {
  const {
    typeName,
    bbox,
    maxFeatures,
    srsName = 'EPSG:4326'
  } = params;

  const urlParams = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeName,
    outputFormat: 'application/json',
    srsName: srsName
  });

  if (maxFeatures !== undefined) {
    urlParams.append('count', maxFeatures.toString());
  }

  if (bbox) {
    urlParams.append('bbox', `${bbox.join(',')},${srsName}`);
  }

  return `${WFS_BASE_URL}?${urlParams.toString()}`;
}

export async function fetchBuildingData(
  typeName: string,
  bbox?: BBox,
  signal?: AbortSignal
): Promise<BuildingCollection> {
  const url = buildWFSUrl({ typeName, bbox });
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`WFS request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
