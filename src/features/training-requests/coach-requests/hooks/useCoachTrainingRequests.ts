import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { isCoachRole } from "@/shared/utils/profileRole";

import { useCoachTrainingRequestsApi } from "../../shared/api/coach-training-requests.api";
import { useTrainingRequestApi } from "../../shared/api/training-request.api";
import {
  buildCoachTrainingRequestsLoadPayload,
  getVisibleCoachTrainingRequests,
} from "../lib/coach-training-requests.data";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
} from "../model/coach-training-request.model";
import { useCoachTrainingRequestsActions } from "./useCoachTrainingRequestsActions";
import {
  coachTrainingRequestsReducer,
  initialCoachTrainingRequestsState,
} from "../state/coach-training-requests.state";

export const useCoachTrainingRequests = () => {
  const { downloadTrainingPlanFile, getMyTrainingRequests } = useTrainingRequestApi();
  const {
    getClosedCoachTrainingRequests,
    getCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  } = useCoachTrainingRequestsApi();
  const { profile, loading: profileLoading } = useProfileQuery();
  const isCoach = isCoachRole(profile?.role);
  const [state, dispatch] = useReducer(
    coachTrainingRequestsReducer,
    initialCoachTrainingRequestsState
  );
  const decisionDescriptionsRef = useRef(state.decisionDescriptions);
  const trainingPlanDraftsRef = useRef(state.trainingPlanDrafts);

  useEffect(() => {
    dispatch({ type: "set-view", payload: isCoach ? "coach" : "user" });
  }, [isCoach]);

  useEffect(() => {
    decisionDescriptionsRef.current = state.decisionDescriptions;
    trainingPlanDraftsRef.current = state.trainingPlanDrafts;
  }, [state.decisionDescriptions, state.trainingPlanDrafts]);

  const loadRequests = useCallback(async () => {
    dispatch({ type: "load/start" });

    try {
      const [
        outgoingResponse,
        pendingResponse,
        approvedResponse,
        closedResponse,
        rejectedResponse,
      ] = await Promise.all([
        getMyTrainingRequests(),
        isCoach ? getCoachTrainingRequests("PENDING") : Promise.resolve([]),
        isCoach ? getCoachTrainingRequests("APPROVED") : Promise.resolve([]),
        isCoach ? getClosedCoachTrainingRequests() : Promise.resolve([]),
        isCoach ? getCoachTrainingRequests("REJECTED") : Promise.resolve([]),
      ]);

      dispatch({
        type: "load/success",
        payload: buildCoachTrainingRequestsLoadPayload({
          approvedResponse,
          closedResponse,
          outgoingResponse,
          pendingResponse,
          previousDecisionDescriptions: decisionDescriptionsRef.current,
          previousTrainingPlanDrafts: trainingPlanDraftsRef.current,
          rejectedResponse,
        }),
      });
    } catch (error) {
      dispatch({
        type: "load/error",
        payload: error instanceof Error ? error.message : "Failed to load requests.",
      });
    }
  }, [getClosedCoachTrainingRequests, getCoachTrainingRequests, getMyTrainingRequests, isCoach]);

  useEffect(() => {
    if (!profileLoading) {
      void loadRequests();
    }
  }, [loadRequests, profileLoading]);

  const visibleRequests = useMemo(
    () =>
      getVisibleCoachTrainingRequests(
        isCoach,
        state.coachViewMode,
        state.coachRequestFilter,
        state
      ),
    [isCoach, state]
  );

  const {
    downloadTrainingPlan,
    saveTrainingPlan,
    setDecisionDescription,
    toggleApprovedRequestEditor,
    updateRequestStatus,
    updateTrainingPlanDraft,
  } = useCoachTrainingRequestsActions({
    downloadTrainingPlanFile,
    dispatch,
    loadRequests,
    state,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  });

  const setCoachRequestFilter = useCallback(
    (value: CoachRequestFilter) => dispatch({ type: "set-filter", payload: value }),
    []
  );

  const setCoachViewMode = useCallback(
    (value: CoachRequestViewMode) => dispatch({ type: "set-view", payload: value }),
    []
  );

  return {
    coachRequestFilter: state.coachRequestFilter,
    coachViewMode: state.coachViewMode,
    decisionDescriptions: state.decisionDescriptions,
    downloadingRequestId: state.downloadingRequestId,
    downloadTrainingPlan,
    error: state.error,
    expandedApprovedRequestId: state.expandedApprovedRequestId,
    isCoach,
    loading: state.loading,
    profileLoading,
    saveTrainingPlan,
    savingApprovedRequestId: state.savingApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    toggleApprovedRequestEditor,
    trainingPlanDrafts: state.trainingPlanDrafts,
    updateRequestStatus,
    updateTrainingPlanDraft,
    updatingRequestId: state.updatingRequestId,
    visibleRequests,
  };
};

export type UseCoachTrainingRequestsResult = ReturnType<typeof useCoachTrainingRequests>;
