import { useEffect, useState } from "react";
import { getCoachDirectory } from "../api/coach-directory.api";
import { mapCoachDirectoryResponsesToCards } from "../lib/coach-directory.mapper";
import type { CoachCardData } from "../model/training-request.types";

export const useCoachRequestPage = () => {
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
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

  const selectedCoach = coaches.find((coach) => coach.id === selectedCoachId) ?? null;

  return {
    coaches,
    selectedCoach,
    loading,
    error,
    selectCoach: (coachId: string) => setSelectedCoachId(coachId),
  };
};
