import { useState } from 'react';
import { Toggle } from '../ui/Toggle/Toggle';
import { Slider } from '../ui/Slider/Slider';
import { RangeSlider } from '../ui/RangeSlider/RangeSlider';
import type { BasemapStyle } from '../../types/layerControls';
import './LayerPanel.css';

interface LayerPanelProps {
  wireframeMode: boolean;
  onWireframeModeChange: (enabled: boolean) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  heightRange: [number, number];
  onHeightRangeChange: (range: [number, number]) => void;
  basemap: BasemapStyle;
  onBasemapChange: (style: BasemapStyle) => void;
  filteredCount: number;
  totalCount: number;
}

export function LayerPanel({
  wireframeMode,
  onWireframeModeChange,
  opacity,
  onOpacityChange,
  heightRange,
  onHeightRangeChange,
  basemap,
  onBasemapChange,
  filteredCount,
  totalCount
}: LayerPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        className="layer-panel-collapsed"
        onClick={() => setCollapsed(false)}
        title="Expand layer controls"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L12 22M2 12L22 12" />
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
    );
  }

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <span className="layer-panel-title">Layer Controls</span>
        <button
          className="layer-panel-collapse-btn"
          onClick={() => setCollapsed(true)}
          title="Collapse"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15L12 9L6 15" />
          </svg>
        </button>
      </div>

      <div className="layer-panel-section">
        <Toggle
          label="Wireframe Mode"
          checked={wireframeMode}
          onChange={onWireframeModeChange}
        />
      </div>

      <div className="layer-panel-section">
        <Slider
          label="Opacity"
          value={opacity}
          min={0}
          max={100}
          step={5}
          onChange={onOpacityChange}
        />
      </div>

      <div className="layer-panel-section">
        <RangeSlider
          label="Height Filter"
          minValue={heightRange[0]}
          maxValue={heightRange[1]}
          min={0}
          max={100}
          step={5}
          onChange={onHeightRangeChange}
        />
        <div className="layer-panel-filter-count">
          {filteredCount} / {totalCount} buildings
        </div>
      </div>

      <div className="layer-panel-section layer-panel-section-last">
        <div className="layer-panel-section-label">Basemap</div>
        <div className="basemap-buttons">
          <button
            className={`basemap-btn ${basemap === 'light' ? 'basemap-btn-active' : ''}`}
            onClick={() => onBasemapChange('light')}
          >
            Light
          </button>
          <button
            className={`basemap-btn ${basemap === 'dark' ? 'basemap-btn-active' : ''}`}
            onClick={() => onBasemapChange('dark')}
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
