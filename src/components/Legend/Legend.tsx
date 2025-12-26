import { getViridisGradientCSS, getNoDataColorCSS } from '../../utils/colorScale';
import './Legend.css';

const HEIGHT_LABELS = [0, 25, 50, 75, 100];

export function Legend() {
  const gradient = getViridisGradientCSS();
  const noDataColor = getNoDataColorCSS();

  return (
    <div className="legend">
      <div className="legend-title">Building Height</div>

      <div className="legend-scale">
        <div
          className="legend-gradient"
          style={{ background: gradient }}
        />
        <div className="legend-labels">
          {HEIGHT_LABELS.slice().reverse().map(height => (
            <span key={height} className="legend-label">
              {height}m
            </span>
          ))}
        </div>
      </div>

      <div className="legend-no-data">
        <div
          className="legend-no-data-swatch"
          style={{ background: noDataColor }}
        />
        <span>No data</span>
      </div>
    </div>
  );
}
