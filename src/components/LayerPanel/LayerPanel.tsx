import { useState } from 'react';
import { Slider } from '../ui/Slider/Slider';
import { RangeSlider } from '../ui/RangeSlider/RangeSlider';
import type { BasemapStyle, ColorMode } from '../../types/layerControls';
import { COLOR_MODE_LABELS, COLOR_MODE_DESCRIPTIONS } from '../../types/layerControls';
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
  onResetView: () => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

const COLOR_MODES: ColorMode[] = ['height', 'variance', 'source', 'area'];

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
  totalCount,
  onResetView,
  colorMode,
  onColorModeChange
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
        <div className="layer-panel-section-label">Color By</div>
        <div className="color-mode-buttons">
          {COLOR_MODES.map((mode) => (
            <button
              key={mode}
              className={`color-mode-btn ${colorMode === mode ? 'color-mode-btn-active' : ''}`}
              onClick={() => onColorModeChange(mode)}
              title={COLOR_MODE_DESCRIPTIONS[mode]}
            >
              {COLOR_MODE_LABELS[mode]}
            </button>
          ))}
        </div>
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

      <div className="layer-panel-toolbar">
        <button
          className={`toolbar-icon-btn ${wireframeMode ? 'toolbar-icon-btn-active' : ''}`}
          onClick={() => onWireframeModeChange(!wireframeMode)}
          title="Wireframe"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
        </button>
        <button
          className={`toolbar-icon-btn ${basemap === 'dark' ? 'toolbar-icon-btn-active' : ''}`}
          onClick={() => onBasemapChange(basemap === 'dark' ? 'light' : 'dark')}
          title={basemap === 'dark' ? 'Dark Basemap' : 'Light Basemap'}
        >
          {basemap === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
        <button
          className="toolbar-icon-btn"
          onClick={onResetView}
          title="Reset North"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 20,20 12,16 4,20" />
          </svg>
        </button>
      </div>
    </div>
  );
}
