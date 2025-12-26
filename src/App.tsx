import { useState, useCallback, useMemo } from 'react';
import { Map } from 'react-map-gl/maplibre';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { PickingInfo } from '@deck.gl/core';
import { DeckGLOverlay } from './components/Map/DeckGLOverlay';
import { createBuildingLayer } from './components/Map/BuildingLayer';
import { createVolumeLayer } from './components/Map/VolumeLayer';
import { BuildingPopup } from './components/BuildingPopup';
import { Legend } from './components/Legend/Legend';
import { ZoomIndicator } from './components/ZoomIndicator/ZoomIndicator';
import { BuildingStats } from './components/BuildingStats/BuildingStats';
import { LayerPanel } from './components/LayerPanel/LayerPanel';
import { useWFSData } from './hooks/useWFSData';
import type { BBox, BuildingFeature } from './types/building';
import type { BasemapStyle } from './types/layerControls';
import { BASEMAP_STYLES } from './types/layerControls';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

const INITIAL_VIEW_STATE = {
  longitude: 11.576,
  latitude: 48.137,
  zoom: 15,
  pitch: 45,
  bearing: 0
};

const WFS_LAYER = 'global3D:lod1_global';
const ZOOM_THRESHOLD = 13;

interface PopupInfo {
  feature: BuildingFeature;
  x: number;
  y: number;
}

function App() {
  const [bbox, setBbox] = useState<BBox | undefined>(undefined);
  const [zoom, setZoom] = useState(INITIAL_VIEW_STATE.zoom);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  // Layer control state
  const [wireframeMode, setWireframeMode] = useState(false);
  const [buildingOpacity, setBuildingOpacity] = useState(100);
  const [heightRange, setHeightRange] = useState<[number, number]>([0, 100]);
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('light');

  const updateViewState = useCallback((map: MapLibreMap) => {
    const bounds = map.getBounds();
    const newBbox: BBox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];
    setBbox(newBbox);
    setZoom(map.getZoom());
  }, []);

  const handleLoad = useCallback((evt: { target: MapLibreMap }) => {
    updateViewState(evt.target);
  }, [updateViewState]);

  const handleMoveEnd = useCallback((evt: ViewStateChangeEvent) => {
    updateViewState(evt.target);
  }, [updateViewState]);

  const handleClick = useCallback((info: PickingInfo) => {
    if (info.object && info.x !== undefined && info.y !== undefined) {
      setPopupInfo({
        feature: info.object as BuildingFeature,
        x: info.x,
        y: info.y,
      });
    } else {
      setPopupInfo(null);
    }
  }, []);

  const handleClosePopup = useCallback(() => {
    setPopupInfo(null);
  }, []);

  const showBuildings = zoom >= ZOOM_THRESHOLD;

  const { data, loading, error } = useWFSData({
    typeName: WFS_LAYER,
    bbox,
    enabled: showBuildings
  });

  // Calculate filtered count for display
  const filteredCount = useMemo(() => {
    if (!data) return 0;
    return data.features.filter(f => {
      const h = f.properties.height ?? 0;
      return h >= heightRange[0] && h <= heightRange[1];
    }).length;
  }, [data, heightRange]);

  const layers = useMemo(() => {
    if (!showBuildings) {
      return [createVolumeLayer()];
    }
    const layer = createBuildingLayer(data, {
      wireframeMode,
      opacity: buildingOpacity / 100,
      heightRange,
      darkMode: basemapStyle === 'dark'
    });
    return layer ? [layer] : [];
  }, [data, showBuildings, wireframeMode, buildingOpacity, heightRange, basemapStyle]);

  return (
    <div id="map-container">
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={BASEMAP_STYLES[basemapStyle]}
        onLoad={handleLoad}
        onMoveEnd={handleMoveEnd}
      >
        <DeckGLOverlay layers={layers} onClick={handleClick} />
      </Map>

      {popupInfo && (
        <BuildingPopup
          feature={popupInfo.feature}
          x={popupInfo.x}
          y={popupInfo.y}
          onClose={handleClosePopup}
        />
      )}

      <ZoomIndicator
        zoom={zoom}
        threshold={ZOOM_THRESHOLD}
        loading={loading}
        buildingCount={data?.features.length}
        error={error}
      />

      {showBuildings && (
        <LayerPanel
          wireframeMode={wireframeMode}
          onWireframeModeChange={setWireframeMode}
          opacity={buildingOpacity}
          onOpacityChange={setBuildingOpacity}
          heightRange={heightRange}
          onHeightRangeChange={setHeightRange}
          basemap={basemapStyle}
          onBasemapChange={setBasemapStyle}
          filteredCount={filteredCount}
          totalCount={data?.features.length ?? 0}
        />
      )}

      {showBuildings && <Legend />}
      {showBuildings && <BuildingStats data={data} loading={loading} />}
    </div>
  );
}

export default App;
