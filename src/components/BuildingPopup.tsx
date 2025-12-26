import type { BuildingFeature } from '../types/building';
import { PROPERTY_LABELS, formatPropertyValue } from '../utils/buildingProperties';
import './BuildingPopup.css';

interface BuildingPopupProps {
  feature: BuildingFeature;
  x: number;
  y: number;
}

export function BuildingPopup({ feature, x, y }: BuildingPopupProps) {
  const { properties } = feature;

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
      <table className="building-popup-table">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className="building-popup-label">
                {PROPERTY_LABELS[key] || key}
              </td>
              <td className="building-popup-value">
                {formatPropertyValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
