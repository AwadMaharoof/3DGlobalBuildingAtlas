import type { ColorMode } from '../../types/layerControls';
import {
  getViridisGradientCSS,
  getPlasmaGradientCSS,
  getNoDataColorCSS,
  getSourceColorMap,
} from '../../utils/colorScale';
import './Legend.css';

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
  const noDataColor = getNoDataColorCSS();

  // Height mode (default)
  if (colorMode === 'height') {
    return (
      <div className="legend">
        <div className="legend-title">Building Height</div>
        <div className="legend-scale">
          <div
            className="legend-gradient"
            style={{ background: getViridisGradientCSS() }}
          />
          <div className="legend-labels">
            {HEIGHT_LABELS.slice().reverse().map(h => (
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
        <div className="legend-title">Height Uncertainty</div>
        <div className="legend-subtitle">Lower = More Confident</div>
        <div className="legend-scale">
          <div
            className="legend-gradient"
            style={{ background: getPlasmaGradientCSS() }}
          />
          <div className="legend-labels">
            {VARIANCE_LABELS.slice().reverse().map(v => (
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
        <div className="legend-title">Polygon Source</div>
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
        <div className="legend-title">Footprint Area</div>
        <div className="legend-scale">
          <div
            className="legend-gradient"
            style={{ background: getViridisGradientCSS() }}
          />
          <div className="legend-labels">
            {AREA_LABELS.slice().reverse().map(a => (
              <span key={a} className="legend-label">{formatAreaLabel(a)} m²</span>
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
