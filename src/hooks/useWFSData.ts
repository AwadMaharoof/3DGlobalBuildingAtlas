import { useState, useEffect, useRef } from 'react';
import type { BuildingCollection, BBox } from '../types/building';
import { fetchBuildingData } from '../services/wfsService';

interface UseWFSDataOptions {
  typeName: string;
  bbox?: BBox;
  debounceMs?: number;
}

interface UseWFSDataResult {
  data: BuildingCollection | null;
  loading: boolean;
  error: Error | null;
}

export function useWFSData(options: UseWFSDataOptions): UseWFSDataResult {
  const { typeName, bbox, debounceMs = 500 } = options;
  const [data, setData] = useState<BuildingCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!bbox) return;

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const geojson = await fetchBuildingData(typeName, bbox, controller.signal);
        if (!controller.signal.aborted) {
          setData(geojson);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err instanceof Error && err.name !== 'AbortError') {
            setError(err);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [typeName, bbox?.join(','), debounceMs]);

  return { data, loading, error };
}
