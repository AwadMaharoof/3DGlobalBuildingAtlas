import { useMemo, useState } from 'react';
import type { BuildingCollection } from '../../types/building';
import { computeBuildingStats } from '../../utils/statsUtils';
import { getColorForHeightCSS } from '../../utils/colorScale';
import './BuildingStats.css';

interface BuildingStatsProps {
  data: BuildingCollection | null;
  loading?: boolean;
  zoom: number;
  threshold?: number;
  error?: Error | null;
}

export function BuildingStats({ data, loading, zoom, threshold = 13, error }: BuildingStatsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const stats = useMemo(() => computeBuildingStats(data), [data]);
  const isDetailMode = zoom >= threshold;
  const mode = isDetailMode ? '3D Buildings' : 'Volume Raster';

  const getStatusText = () => {
    if (!isDetailMode) {
      return `Zoom in for 3D (${Math.round(zoom)}/${threshold})`;
    }
    if (error) {
      return `Error: ${error.message}`;
    }
    if (data?.features.length !== undefined) {
      return `${data.features.length.toLocaleString()} buildings`;
    }
    return null;
  };

  const statusText = getStatusText();
  const maxPercentage = stats ? Math.max(...stats.histogram.map(b => b.percentage), 1) : 1;

  if (collapsed) {
    return (
      <button
        className="building-stats-collapsed"
        onClick={() => setCollapsed(false)}
        title="Expand statistics"
      >
        {loading ? (
          <div className="loading-dot" />
        ) : isDetailMode ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9H6v-9l6-4.5z"/>
            <rect x="10" y="13" width="4" height="6"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="building-stats">
      <div className="building-stats-header">
        <div className="building-stats-mode-info">
          <span className="building-stats-mode">{mode}</span>
          {statusText && (
            <span className={`building-stats-status ${error ? 'error' : ''}`}>
              {statusText}
            </span>
          )}
        </div>
        <button
          className="building-stats-collapse-btn"
          onClick={() => setCollapsed(true)}
          title="Collapse"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15L12 9L6 15" />
          </svg>
        </button>
      </div>

      {isDetailMode && stats && (
        <>
          <div className="building-stats-heights-inline">
            <div className="height-stat">
              <span className="height-stat-value">{stats.min.toFixed(0)}m</span>
              <span className="height-stat-label">min</span>
            </div>
            <div className="height-stat">
              <span className="height-stat-value">{stats.avg.toFixed(0)}m</span>
              <span className="height-stat-label">avg</span>
            </div>
            <div className="height-stat">
              <span className="height-stat-value">{stats.max.toFixed(0)}m</span>
              <span className="height-stat-label">max</span>
            </div>
          </div>

          <div className="building-stats-histogram">
            <div className="building-stats-histogram-title">Height Distribution</div>
            {stats.histogram.map(bin => (
              <div key={bin.label} className="histogram-row">
                <span className="histogram-label">{bin.label}</span>
                <div className="histogram-bar-container">
                  <div
                    className="histogram-bar"
                    style={{
                      width: `${(bin.percentage / maxPercentage) * 100}%`,
                      backgroundColor: getColorForHeightCSS((bin.min + bin.max) / 2),
                    }}
                  />
                </div>
                <span className="histogram-count">{bin.count}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {isDetailMode && loading && (
        <div className="building-stats-loading">Loading statistics...</div>
      )}
    </div>
  );
}
