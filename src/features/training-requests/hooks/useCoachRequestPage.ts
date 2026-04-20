import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCoachDirectoryList } from "./useCoachDirectoryList";

export const useCoachRequestPage = () => {
  const navigate = useNavigate();
  const { coaches, loading } = useCoachDirectoryList();
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const selectedCoach = coaches.find((coach) => coach.id === selectedCoachId) ?? null;

  return {
    coaches,
    selectedCoach,
    loading,
    canContinue: selectedCoach !== null,
    selectCoach: (coachId: string) => setSelectedCoachId(coachId),
    openTrainingRequestForm: () => {
      if (!selectedCoach) {
        return;
      }

      navigate(`/training-request/${selectedCoach.id}`);
    },
  };
};

