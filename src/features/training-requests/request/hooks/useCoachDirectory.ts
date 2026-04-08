import { useCallback, useEffect, useState } from "react";

import { useCoachDirectoryApi } from "../api/coach-directory.api";
import { mapCoachDirectoryDtosToCards } from "../lib/coach-directory.mapper";
import type { CoachCardData } from "../types/coach.types";

export interface UseCoachDirectoryResult {
  coaches: CoachCardData[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const useCoachDirectory = (): UseCoachDirectoryResult => {
  const { getCoachDirectory } = useCoachDirectoryApi();
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoaches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCoachDirectory();
      setCoaches(mapCoachDirectoryDtosToCards(response));
    } catch {
      setCoaches([]);
      setError("Failed to load the coach list from the backend.");
    } finally {
      setLoading(false);
    }
  }, [getCoachDirectory]);

  useEffect(() => {
    void loadCoaches();
  }, [loadCoaches]);

  return {
    coaches,
    loading,
    error,
    reload: loadCoaches,
  };
};
