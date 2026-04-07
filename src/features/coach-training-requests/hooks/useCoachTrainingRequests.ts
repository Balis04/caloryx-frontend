import { useCoachTrainingRequestActions } from "./useCoachTrainingRequestActions";
import { useCoachTrainingRequestsData } from "./useCoachTrainingRequestsData";
import { useCoachTrainingRequestDrafts } from "./useCoachTrainingRequestDrafts";

export const useCoachTrainingRequests = () => {
  const data = useCoachTrainingRequestsData();
  const drafts = useCoachTrainingRequestDrafts({
    approvedRequests: data.approvedRequests,
    closedRequests: data.closedRequests,
    pendingRequests: data.pendingRequests,
    rejectedRequests: data.rejectedRequests,
  });
  const actions = useCoachTrainingRequestActions({
    loadRequests: data.loadRequests,
    setApprovedRequests: data.setApprovedRequests,
    setClosedRequests: data.setClosedRequests,
    setDecisionDescriptions: drafts.setDecisionDescriptions,
    setError: data.setError,
    setExpandedApprovedRequestId: drafts.setExpandedApprovedRequestId,
    setOutgoingRequests: data.setOutgoingRequests,
    setPendingRequests: data.setPendingRequests,
    setRejectedRequests: data.setRejectedRequests,
    setTrainingPlanDrafts: drafts.setTrainingPlanDrafts,
    trainingPlanDrafts: drafts.trainingPlanDrafts,
  });

  return {
    coachRequestFilter: data.coachRequestFilter,
    coachViewMode: data.coachViewMode,
    decisionDescriptions: drafts.decisionDescriptions,
    downloadingRequestId: actions.downloadingRequestId,
    downloadTrainingPlan: actions.downloadTrainingPlan,
    error: data.error,
    expandedApprovedRequestId: drafts.expandedApprovedRequestId,
    isCoach: data.isCoach,
    loading: data.loading,
    profileLoading: data.profileLoading,
    saveTrainingPlan: actions.saveTrainingPlan,
    savingApprovedRequestId: actions.savingApprovedRequestId,
    setCoachRequestFilter: data.setCoachRequestFilter,
    setCoachViewMode: data.setCoachViewMode,
    setDecisionDescriptions: drafts.setDecisionDescriptions,
    setExpandedApprovedRequestId: drafts.setExpandedApprovedRequestId,
    setTrainingPlanDrafts: drafts.setTrainingPlanDrafts,
    trainingPlanDrafts: drafts.trainingPlanDrafts,
    updateRequestStatus: actions.updateRequestStatus,
    updatingRequestId: actions.updatingRequestId,
    visibleRequests: data.visibleRequests,
  };
};

export type UseCoachTrainingRequestsResult = ReturnType<typeof useCoachTrainingRequests>;
