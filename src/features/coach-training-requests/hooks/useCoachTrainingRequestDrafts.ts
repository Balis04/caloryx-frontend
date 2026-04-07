import {
  useCallback,
  useMemo,
  useState,
  type SetStateAction,
} from "react";
import {
  createTrainingPlanDraft,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
} from "../lib/coach-training-requests.utils";
import type {
  CoachTrainingRequest,
  TrainingPlanDraft,
} from "../model/coach-training-request.model";

interface Params {
  approvedRequests: CoachTrainingRequest[];
  closedRequests: CoachTrainingRequest[];
  pendingRequests: CoachTrainingRequest[];
  rejectedRequests: CoachTrainingRequest[];
}

const areDraftsEqual = (left?: TrainingPlanDraft, right?: TrainingPlanDraft) =>
  left?.planName === right?.planName &&
  left?.planDescription === right?.planDescription &&
  left?.existingFileName === right?.existingFileName &&
  left?.file === right?.file;

const resolveStateAction = <T,>(action: SetStateAction<T>, currentState: T) =>
  typeof action === "function"
    ? (action as (previousState: T) => T)(currentState)
    : action;

export const useCoachTrainingRequestDrafts = ({
  approvedRequests,
  closedRequests,
  pendingRequests,
  rejectedRequests,
}: Params) => {
  const [decisionDescriptionOverrides, setDecisionDescriptionOverrides] = useState<
    Record<string, string>
  >({});
  const [trainingPlanDraftOverrides, setTrainingPlanDraftOverrides] = useState<
    Record<string, TrainingPlanDraft>
  >({});
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<string | null>(null);

  const baseDecisionDescriptions = useMemo(() => {
    const next: Record<string, string> = {};

    [...pendingRequests, ...approvedRequests, ...closedRequests, ...rejectedRequests].forEach(
      (requestItem) => {
        next[requestItem.id] = getDecisionDescription(requestItem);
      }
    );

    return next;
  }, [approvedRequests, closedRequests, pendingRequests, rejectedRequests]);

  const baseTrainingPlanDrafts = useMemo(() => {
    const next: Record<string, TrainingPlanDraft> = {};

    approvedRequests.forEach((requestItem) => {
      const draft = createTrainingPlanDraft(requestItem);
      next[requestItem.id] = {
        ...draft,
        planName: draft.planName || getTrainingPlanName(requestItem),
        existingFileName:
          draft.existingFileName || getTrainingPlanFileName(requestItem),
        planDescription:
          draft.planDescription || getTrainingPlanDescription(requestItem),
      };
    });

    return next;
  }, [approvedRequests]);

  const decisionDescriptions = useMemo(
    () => ({ ...baseDecisionDescriptions, ...decisionDescriptionOverrides }),
    [baseDecisionDescriptions, decisionDescriptionOverrides]
  );

  const trainingPlanDrafts = useMemo(
    () => ({ ...baseTrainingPlanDrafts, ...trainingPlanDraftOverrides }),
    [baseTrainingPlanDrafts, trainingPlanDraftOverrides]
  );

  const setDecisionDescriptions = useCallback(
    (action: SetStateAction<Record<string, string>>) => {
      setDecisionDescriptionOverrides((previousOverrides) => {
        const currentState = { ...baseDecisionDescriptions, ...previousOverrides };
        const nextState = resolveStateAction(action, currentState);
        const nextOverrides: Record<string, string> = {};

        Object.entries(nextState).forEach(([key, value]) => {
          if (value !== (baseDecisionDescriptions[key] ?? "")) {
            nextOverrides[key] = value;
          }
        });

        return nextOverrides;
      });
    },
    [baseDecisionDescriptions]
  );

  const setTrainingPlanDrafts = useCallback(
    (action: SetStateAction<Record<string, TrainingPlanDraft>>) => {
      setTrainingPlanDraftOverrides((previousOverrides) => {
        const currentState = { ...baseTrainingPlanDrafts, ...previousOverrides };
        const nextState = resolveStateAction(action, currentState);
        const nextOverrides: Record<string, TrainingPlanDraft> = {};

        Object.entries(nextState).forEach(([key, value]) => {
          if (!areDraftsEqual(value, baseTrainingPlanDrafts[key])) {
            nextOverrides[key] = value;
          }
        });

        return nextOverrides;
      });
    },
    [baseTrainingPlanDrafts]
  );

  return {
    decisionDescriptions,
    expandedApprovedRequestId,
    setDecisionDescriptions,
    setExpandedApprovedRequestId,
    setTrainingPlanDrafts,
    trainingPlanDrafts,
  };
};
