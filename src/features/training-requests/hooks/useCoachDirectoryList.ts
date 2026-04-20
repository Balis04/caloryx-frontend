import { useEffect, useState } from "react";

import { getCoachDirectory } from "../api/coach-directory.api";
import { mapCoachDirectoryResponsesToCards } from "../lib/coach-directory.mapper";
import type { CoachCardData } from "../types";

export const useCoachDirectoryList = () => {
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoaches = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCoachDirectory();
        setCoaches(mapCoachDirectoryResponsesToCards(response));
      } catch {
        setCoaches([]);
        setError("Failed to load the coach list from the backend.");
      } finally {
        setLoading(false);
      }
    };

    void loadCoaches();
  }, []);

  return {
    coaches,
    error,
    loading,
  };
};
