import type {
  CoachRequestFilter,
  CoachRequestViewMode,
} from "../types";
import type { TrainingRequestsListData } from "../hooks/useTrainingRequestsList";

export const getVisibleTrainingRequests = (
  isCoach: boolean,
  coachViewMode: CoachRequestViewMode,
  coachRequestFilter: CoachRequestFilter,
  requests: TrainingRequestsListData
) => {
  if (!isCoach || coachViewMode === "user") {
    return requests.outgoingRequests;
  }

  switch (coachRequestFilter) {
    case "approved":
      return requests.approvedRequests;
    case "rejected":
      return requests.rejectedRequests;
    case "closed":
      return requests.closedRequests;
    default:
      return requests.pendingRequests;
  }
};

export const getTrainingRequestsEmptyMessage = (
  showCoachIncomingRequests: boolean,
  coachRequestFilter: CoachRequestFilter
) => {
  if (!showCoachIncomingRequests) {
    return "You have not sent any training plan requests yet.";
  }

  return {
    pending: "There are currently no pending requests.",
    approved: "There are currently no approved requests.",
    rejected: "There are currently no rejected requests.",
    closed: "There are currently no completed requests.",
  }[coachRequestFilter];
};
