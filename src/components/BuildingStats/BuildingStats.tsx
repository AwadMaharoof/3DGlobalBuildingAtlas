import { useMemo } from 'react';
import type { BuildingCollection } from '../../types/building';
import { computeBuildingStats } from '../../utils/statsUtils';
import { getColorForHeightCSS } from '../../utils/colorScale';
import './BuildingStats.css';

interface BuildingStatsProps {
  data: BuildingCollection | null;
  loading?: boolean;
}

export function BuildingStats({ data, loading }: BuildingStatsProps) {
  const stats = useMemo(() => computeBuildingStats(data), [data]);

  if (loading) {
    return (
      <div className="building-stats">
        <div className="building-stats-title">Statistics</div>
        <div className="building-stats-loading">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const maxPercentage = Math.max(...stats.histogram.map(b => b.percentage), 1);

  return (
    <div className="building-stats">
      <div className="building-stats-title">Building Statistics</div>

      <div className="building-stats-summary">
        <div className="building-stats-row">
          <span className="building-stats-label">Count</span>
          <span className="building-stats-value">{stats.count.toLocaleString()}</span>
        </div>
        <div className="building-stats-row">
          <span className="building-stats-label">With height</span>
          <span className="building-stats-value">{stats.withHeight.toLocaleString()}</span>
        </div>
        {stats.noHeight > 0 && (
          <div className="building-stats-row">
            <span className="building-stats-label">No data</span>
            <span className="building-stats-value muted">{stats.noHeight.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="building-stats-heights">
        <div className="building-stats-row">
          <span className="building-stats-label">Min</span>
          <span className="building-stats-value">{stats.min.toFixed(1)}m</span>
        </div>
        <div className="building-stats-row">
          <span className="building-stats-label">Max</span>
          <span className="building-stats-value">{stats.max.toFixed(1)}m</span>
        </div>
        <div className="building-stats-row">
          <span className="building-stats-label">Avg</span>
          <span className="building-stats-value">{stats.avg.toFixed(1)}m</span>
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
    </div>
  );
}
