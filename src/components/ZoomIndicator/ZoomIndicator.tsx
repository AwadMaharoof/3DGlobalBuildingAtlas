import './ZoomIndicator.css';

interface ZoomIndicatorProps {
  zoom: number;
  threshold?: number;
  loading?: boolean;
  buildingCount?: number;
  error?: Error | null;
}

export function ZoomIndicator({
  zoom,
  threshold = 13,
  loading,
  buildingCount,
  error
}: ZoomIndicatorProps) {
  const isDetailMode = zoom >= threshold;
  const mode = isDetailMode ? '3D Buildings' : 'Volume Raster';

  const getStatusText = () => {
    if (!isDetailMode) {
      return `Zoom in for 3D (${Math.round(zoom)}/${threshold})`;
    }
    if (error) {
      return `Error: ${error.message}`;
    }
    if (buildingCount !== undefined) {
      return `${buildingCount.toLocaleString()} buildings`;
    }
    return null;
  };

  const statusText = getStatusText();

  return (
    <div className={`zoom-indicator ${isDetailMode ? 'detail' : 'overview'} ${error ? 'error' : ''}`}>
      <div className="zoom-indicator-icon">
        {loading ? (
          <div className="loading-dot" />
        ) : isDetailMode ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9H6v-9l6-4.5z"/>
            <rect x="10" y="13" width="4" height="6"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          </svg>
        )}
      </div>
      <div className="zoom-indicator-content">
        <span className="zoom-indicator-mode">{mode}</span>
        {statusText && (
          <span className={`zoom-indicator-status ${error ? 'error' : ''}`}>
            {statusText}
          </span>
        )}
      </div>
    </div>
  );
}
