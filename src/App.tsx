import { useState, useCallback, useMemo, useRef } from 'react';
import { Map } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
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
import { countBuildingsInHeightRange } from './utils/filterBuildings';
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
  const mapRef = useRef<MapRef>(null);
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

  const handleResetView = useCallback(() => {
    mapRef.current?.easeTo({
      bearing: 0,
      pitch: 0,
      duration: 500
    });
  }, []);

  const showBuildings = zoom >= ZOOM_THRESHOLD;

  const { data, loading, error } = useWFSData({
    typeName: WFS_LAYER,
    bbox,
    enabled: showBuildings
  });

  // Calculate filtered count for display (using efficient counting without array allocation)
  const filteredCount = useMemo(() => {
    if (!data) return 0;
    return countBuildingsInHeightRange(data.features, heightRange);
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
    <div id="map-container" className={basemapStyle === 'dark' ? 'dark-theme' : ''}>
      <Map
        ref={mapRef}
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
          onResetView={handleResetView}
        />
      )}

      {showBuildings && <Legend />}
      {showBuildings && <BuildingStats data={data} loading={loading} />}

      <a
        href="https://github.com/AwadMaharoof/3DGlobalBuildingAtlas"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="View source on GitHub"
      >
        <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>
    </div>
  );
}

export default App;
