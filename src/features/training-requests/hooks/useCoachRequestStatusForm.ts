import { useCallback, useState } from "react";

import { updateCoachTrainingRequestStatus } from "../api/training-requests.api";
import { mapTrainingRequestStatusToRequest } from "../lib/training-requests.mapper";
import type { TrainingRequestStatus } from "../types";

export const useCoachRequestStatusForm = () => {
  const [decisionDescriptions, setDecisionDescriptions] = useState<
    Record<string, string>
  >({});
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(
    null
  );

  const setDecisionDescription = useCallback((requestId: string, value: string) => {
    setDecisionDescriptions((current) => ({
      ...current,
      [requestId]: value,
    }));
  }, []);

  const submitRequestStatus = useCallback(
    async (
      trainingRequestId: string,
      status: TrainingRequestStatus,
      coachResponse: string,
      onRequestsChanged: () => Promise<void>
    ) => {
      if (status === "PENDING" || status === "CLOSED") {
        return false;
      }

      if (!coachResponse.trim()) {
        return false;
      }

      setUpdatingRequestId(trainingRequestId);

      try {
        await updateCoachTrainingRequestStatus(
          trainingRequestId,
          mapTrainingRequestStatusToRequest(status, coachResponse.trim())
        );

        setDecisionDescriptions((current) => ({
          ...current,
          [trainingRequestId]: coachResponse.trim(),
        }));

        await onRequestsChanged();
        return true;
      } catch {
        return false;
      } finally {
        setUpdatingRequestId(null);
      }
    },
    []
  );

  return {
    decisionDescriptions,
    setDecisionDescription,
    submitRequestStatus,
    updatingRequestId,
  };
};
