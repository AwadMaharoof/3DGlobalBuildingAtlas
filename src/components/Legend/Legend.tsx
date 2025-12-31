import { useState } from 'react';
import type { ColorMode } from '../../types/layerControls';
import {
  getViridisGradientCSS,
  getPlasmaGradientCSS,
  getNoDataColorCSS,
  getSourceColorMap,
} from '../../utils/colorScale';

import './Legend.css';

function toHorizontalGradient(verticalGradient: string): string {
  return verticalGradient.replace('to top', 'to right');
}

interface LegendProps {
  colorMode: ColorMode;
}

const HEIGHT_LABELS = [0, 25, 50, 75, 100];
const VARIANCE_LABELS = [0, 2.5, 5, 7.5, 10];
const AREA_LABELS = [20, 100, 500, 1000, 2000];

function formatAreaLabel(area: number): string {
  if (area >= 1000) return `${(area / 1000).toFixed(0)}k`;
  return `${area}`;
}

export function Legend({ colorMode }: LegendProps) {
  const [collapsed, setCollapsed] = useState(false);
  const noDataColor = getNoDataColorCSS();

  if (collapsed) {
    return (
      <button
        className="legend-collapsed"
        onClick={() => setCollapsed(false)}
        title="Expand legend"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </button>
    );
  }

  const collapseButton = (
    <button
      className="legend-collapse-btn"
      onClick={() => setCollapsed(true)}
      title="Collapse"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15L12 9L6 15" />
      </svg>
    </button>
  );

  // Height mode (default)
  if (colorMode === 'height') {
    return (
      <div className="legend">
        <div className="legend-header">
          <span className="legend-title">Building Height</span>
          {collapseButton}
        </div>
        <div className="legend-scale">
          <div
            className="legend-gradient"
            style={{ background: toHorizontalGradient(getViridisGradientCSS()) }}
          />
          <div className="legend-labels">
            {HEIGHT_LABELS.map(h => (
              <span key={h} className="legend-label">{h}m</span>
            ))}
          </div>
        </div>
        <div className="legend-no-data">
          <div className="legend-no-data-swatch" style={{ background: noDataColor }} />
          <span>No data</span>
        </div>
      </div>
    );
  }

  // Variance/Uncertainty mode
  if (colorMode === 'variance') {
    return (
      <div className="legend">
        <div className="legend-header">
          <div className="legend-header-text">
            <span className="legend-title">Height Uncertainty</span>
            <span className="legend-subtitle">Lower = More Confident</span>
          </div>
          {collapseButton}
        </div>
        <div className="legend-scale">
          <div
            className="legend-gradient"
            style={{ background: toHorizontalGradient(getPlasmaGradientCSS()) }}
          />
          <div className="legend-labels">
            {VARIANCE_LABELS.map(v => (
              <span key={v} className="legend-label">{v}m</span>
            ))}
          </div>
        </div>
        <div className="legend-no-data">
          <div className="legend-no-data-swatch" style={{ background: noDataColor }} />
          <span>No variance data</span>
        </div>
      </div>
    );
  }

  // Source mode (categorical)
  if (colorMode === 'source') {
    const sourceColors = getSourceColorMap();
    return (
      <div className="legend">
        <div className="legend-header">
          <span className="legend-title">Polygon Source</span>
          {collapseButton}
        </div>
        <div className="legend-categorical">
          {Array.from(sourceColors.entries()).map(([source, color]) => (
            <div key={source} className="legend-category-item">
              <div
                className="legend-category-swatch"
                style={{ background: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
              />
              <span className="legend-category-label">{source}</span>
            </div>
          ))}
          {sourceColors.size === 0 && (
            <div className="legend-empty">No sources in view</div>
          )}
        </div>
        <div className="legend-no-data">
          <div className="legend-no-data-swatch" style={{ background: noDataColor }} />
          <span>Unknown source</span>
        </div>
      </div>
    );
  }

  // Area mode
  if (colorMode === 'area') {
    return (
      <div className="legend">
        <div className="legend-header">
          <span className="legend-title">Footprint Area</span>
          {collapseButton}
        </div>
        <div className="legend-scale">
          <div
            className="legend-gradient"
            style={{ background: toHorizontalGradient(getViridisGradientCSS()) }}
          />
          <div className="legend-labels">
            {AREA_LABELS.map(a => (
              <span key={a} className="legend-label">{formatAreaLabel(a)}m²</span>
            ))}
          </div>
        </div>
        <div className="legend-no-data">
          <div className="legend-no-data-swatch" style={{ background: noDataColor }} />
          <span>No geometry</span>
        </div>
      </div>
    );
  }

  return null;
}
