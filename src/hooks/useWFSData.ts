import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { BuildingCollection, BBox } from '../types/building';
import { fetchBuildingData } from '../services/wfsService';

interface UseWFSDataOptions {
  typeName: string;
  bbox?: BBox;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseWFSDataResult {
  data: BuildingCollection | null;
  loading: boolean;
  error: Error | null;
}

// Round bbox to ~100m grid for better cache hits
function quantizeBbox(bbox: BBox): string {
  const precision = 3; // ~100m at equator
  return bbox.map(v => v.toFixed(precision)).join(',');
}

export function useWFSData(options: UseWFSDataOptions): UseWFSDataResult {
  const { typeName, bbox, debounceMs = 500, enabled = true } = options;
  const [debouncedBbox, setDebouncedBbox] = useState<BBox | undefined>(bbox);

  // Debounce bbox changes
  useEffect(() => {
    if (!bbox) {
      setDebouncedBbox(undefined);
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedBbox(bbox);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [bbox?.join(','), debounceMs]);

  const queryKey = debouncedBbox
    ? ['wfs', typeName, quantizeBbox(debouncedBbox)]
    : ['wfs', typeName, 'none'];

  const { data, isFetching, error } = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchBuildingData(typeName, debouncedBbox, signal),
    enabled: enabled && !!debouncedBbox,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    data: data ?? null,
    loading: isFetching,
    error: error as Error | null,
  };
}
