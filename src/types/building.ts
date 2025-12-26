import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface BuildingProperties {
  ogc_fid?: number;
  id?: string;
  height: number;
  source?: string;
  region?: string;
  var?: number;
}

export type BuildingFeature = Feature<Polygon | MultiPolygon, BuildingProperties>;
export type BuildingCollection = FeatureCollection<Polygon | MultiPolygon, BuildingProperties>;

export type BBox = [number, number, number, number]; // [minX, minY, maxX, maxY]
