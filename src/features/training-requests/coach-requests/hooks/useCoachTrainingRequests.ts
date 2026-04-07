import { useEffect, useMemo } from "react";

import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { isCoachRole } from "@/shared/utils/profileRole";

import { useCoachTrainingRequestsApi } from "../../shared/api/coach-training-requests.api";
import { useTrainingRequestApi } from "../../shared/api/training-request.api";
import { useCoachTrainingRequestsActions } from "./useCoachTrainingRequestsActions";
import { useCoachTrainingRequestsData } from "./useCoachTrainingRequestsData";
import { useCoachTrainingRequestsPresentation } from "./useCoachTrainingRequestsPresentation";

export const useCoachTrainingRequests = () => {
  const { downloadTrainingPlanFile, getMyTrainingRequests } = useTrainingRequestApi();
  const {
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  } = useCoachTrainingRequestsApi();
  const { profile, loading: profileLoading } = useProfileQuery();
  const isCoach = isCoachRole(profile?.role);

  const presentation = useCoachTrainingRequestsPresentation();
  const {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    expandedApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    setExpandedApprovedRequestId,
    setTrainingPlanDrafts,
    toggleApprovedRequestEditor,
    trainingPlanDrafts,
    updateTrainingPlanDraft,
    hydratePresentationState,
  } = presentation;
  const data = useCoachTrainingRequestsData({
    getMyTrainingRequests,
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    isCoach,
    profileLoading,
    hydratePresentationState,
  });
  const dataState = useMemo(
    () => ({
      loadRequests: data.loadRequests,
      setApprovedRequests: data.setApprovedRequests,
      setClosedRequests: data.setClosedRequests,
      setError: data.setError,
      setOutgoingRequests: data.setOutgoingRequests,
      setPendingRequests: data.setPendingRequests,
      setRejectedRequests: data.setRejectedRequests,
    }),
    [
      data.loadRequests,
      data.setApprovedRequests,
      data.setClosedRequests,
      data.setError,
      data.setOutgoingRequests,
      data.setPendingRequests,
      data.setRejectedRequests,
    ]
  );
  const presentationState = useMemo(
    () => ({
      hydratePresentationState,
      setDecisionDescription,
      setExpandedApprovedRequestId,
      setTrainingPlanDrafts,
      trainingPlanDrafts,
    }),
    [
      hydratePresentationState,
      setDecisionDescription,
      setExpandedApprovedRequestId,
      setTrainingPlanDrafts,
      trainingPlanDrafts,
    ]
  );
  const actions = useCoachTrainingRequestsActions({
    downloadTrainingPlanFile,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
    dataState,
    presentationState,
  });

  useEffect(() => {
    setCoachViewMode(isCoach ? "coach" : "user");
  }, [isCoach, setCoachViewMode]);

  const visibleRequests = useMemo(() => {
    if (!isCoach || coachViewMode === "user") {
      return data.outgoingRequests;
    }

    switch (coachRequestFilter) {
      case "approved":
        return data.approvedRequests;
      case "rejected":
        return data.rejectedRequests;
      case "closed":
        return data.closedRequests;
      default:
        return data.pendingRequests;
    }
  }, [
    data.approvedRequests,
    data.closedRequests,
    data.outgoingRequests,
    data.pendingRequests,
    data.rejectedRequests,
    isCoach,
    coachRequestFilter,
    coachViewMode,
  ]);

  return {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    downloadingRequestId: actions.downloadingRequestId,
    downloadTrainingPlan: actions.downloadTrainingPlan,
    error: data.error,
    expandedApprovedRequestId,
    isCoach,
    loading: data.loading,
    profileLoading,
    saveTrainingPlan: actions.saveTrainingPlan,
    savingApprovedRequestId: actions.savingApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    toggleApprovedRequestEditor,
    trainingPlanDrafts,
    updateRequestStatus: actions.updateRequestStatus,
    updateTrainingPlanDraft,
    updatingRequestId: actions.updatingRequestId,
    visibleRequests,
  };
};

export type UseCoachTrainingRequestsResult = ReturnType<typeof useCoachTrainingRequests>;
