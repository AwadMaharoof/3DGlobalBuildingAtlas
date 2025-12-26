import { useState, useCallback, useMemo } from 'react';
import { Map } from 'react-map-gl/maplibre';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { DeckGLOverlay } from './components/Map/DeckGLOverlay';
import { createBuildingLayer } from './components/Map/BuildingLayer';
import { useWFSData } from './hooks/useWFSData';
import type { BBox } from './types/building';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

const INITIAL_VIEW_STATE = {
  longitude: 11.576,
  latitude: 48.137,
  zoom: 15,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const WFS_LAYER = 'global3D:lod1_global';

function App() {
  const [bbox, setBbox] = useState<BBox | undefined>(undefined);

  const updateBbox = useCallback((map: MapLibreMap) => {
    const bounds = map.getBounds();
    const newBbox: BBox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];
    setBbox(newBbox);
  }, []);

  const handleLoad = useCallback((evt: { target: MapLibreMap }) => {
    updateBbox(evt.target);
  }, [updateBbox]);

  const handleMoveEnd = useCallback((evt: ViewStateChangeEvent) => {
    updateBbox(evt.target);
  }, [updateBbox]);

  const { data, loading, error } = useWFSData({
    typeName: WFS_LAYER,
    bbox
  });

  const layers = useMemo(() => {
    const layer = createBuildingLayer(data);
    return layer ? [layer] : [];
  }, [data]);

  return (
    <div id="map-container">
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        onLoad={handleLoad}
        onMoveEnd={handleMoveEnd}
      >
        <DeckGLOverlay layers={layers} />
      </Map>

      {error ? (
        <div className="status-overlay error">Error: {error.message}</div>
      ) : loading ? (
        <div className="status-overlay loading">Loading buildings...</div>
      ) : data ? (
        <div className="status-overlay info">
          {data.features.length} buildings loaded
        </div>
      ) : null}
    </div>
  );
}

export default App;
