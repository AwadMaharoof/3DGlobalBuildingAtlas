import type { BuildingFeature } from '../types/building';
import './BuildingPopup.css';

interface BuildingPopupProps {
  feature: BuildingFeature;
  x: number;
  y: number;
  onClose: () => void;
}

const PROPERTY_LABELS: Record<string, string> = {
  ogc_fid: 'Feature ID',
  id: 'Building ID',
  height: 'Height',
  source: 'Data Source',
  region: 'Region',
  variance: 'Height Variance',
};

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  if (key === 'height' || key === 'variance') {
    return `${Number(value).toFixed(1)} m`;
  }

  return String(value);
}

export function BuildingPopup({ feature, x, y, onClose }: BuildingPopupProps) {
  const { properties } = feature;

  // Get all property entries, filtering out undefined
  const entries = Object.entries(properties).filter(
    ([, value]) => value !== undefined
  );

  return (
    <div
      className="building-popup"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="building-popup-header">
        <span className="building-popup-title">Building Properties</span>
        <button
          className="building-popup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          &times;
        </button>
      </div>
      <div className="building-popup-content">
        <table className="building-popup-table">
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key}>
                <td className="building-popup-label">
                  {PROPERTY_LABELS[key] || key}
                </td>
                <td className="building-popup-value">
                  {formatValue(key, value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
