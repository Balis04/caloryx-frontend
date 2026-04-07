import { useCallback, useState } from "react";

import {
  createTrainingPlanDraft,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
} from "../lib/coach-training-requests.utils";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
  TrainingPlanDraft,
} from "../model/coach-training-request.model";

export const useCoachTrainingRequestsPresentation = () => {
  const [coachViewMode, setCoachViewMode] = useState<CoachRequestViewMode>("coach");
  const [coachRequestFilter, setCoachRequestFilter] =
    useState<CoachRequestFilter>("pending");
  const [decisionDescriptions, setDecisionDescriptions] = useState<Record<string, string>>(
    {}
  );
  const [trainingPlanDrafts, setTrainingPlanDrafts] = useState<
    Record<string, TrainingPlanDraft>
  >({});
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<string | null>(
    null
  );

  const hydratePresentationState = useCallback((requests: CoachTrainingRequest[]) => {
    setDecisionDescriptions((previous) => {
      const next = { ...previous };

      requests.forEach((request) => {
        if (!(request.id in next)) {
          next[request.id] = getDecisionDescription(request);
        }
      });

      return next;
    });

    setTrainingPlanDrafts((previous) => {
      const next = { ...previous };

      requests
        .filter((request) => request.status === "APPROVED")
        .forEach((request) => {
          if (next[request.id]) {
            return;
          }

          const draft = createTrainingPlanDraft(request);
          next[request.id] = {
            ...draft,
            planName: draft.planName || getTrainingPlanName(request),
            existingFileName: draft.existingFileName || getTrainingPlanFileName(request),
            planDescription: draft.planDescription || getTrainingPlanDescription(request),
          };
        });

      return next;
    });
  }, []);

  const setDecisionDescription = useCallback((requestId: string, value: string) => {
    setDecisionDescriptions((previous) => ({
      ...previous,
      [requestId]: value,
    }));
  }, []);

  const updateTrainingPlanDraft = useCallback((requestId: string, draft: TrainingPlanDraft) => {
    setTrainingPlanDrafts((previous) => ({
      ...previous,
      [requestId]: draft,
    }));
  }, []);

  const toggleApprovedRequestEditor = useCallback((requestId: string) => {
    setExpandedApprovedRequestId((previous) => (previous === requestId ? null : requestId));
  }, []);

  return {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    expandedApprovedRequestId,
    hydratePresentationState,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    setExpandedApprovedRequestId,
    setTrainingPlanDrafts,
    toggleApprovedRequestEditor,
    trainingPlanDrafts,
    updateTrainingPlanDraft,
  };
};
