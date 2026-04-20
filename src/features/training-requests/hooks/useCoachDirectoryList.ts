import { useEffect, useState } from "react";

import { getCoachDirectory } from "../api/coach-directory.api";
import { mapCoachDirectoryResponsesToCards } from "../lib/coach-directory.mapper";
import type { CoachCardData } from "../types";

export const useCoachDirectoryList = () => {
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoaches = async () => {
      setLoading(true);

      try {
        const response = await getCoachDirectory();
        setCoaches(mapCoachDirectoryResponsesToCards(response));
      } catch {
        setCoaches([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCoaches();
  }, []);

  return {
    coaches,
    loading,
  };
};
