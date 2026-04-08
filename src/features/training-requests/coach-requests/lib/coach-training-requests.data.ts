import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
} from "../../shared/api/training-request.dto";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
} from "../../shared/lib/training-request.mapper";
import type { TrainingPlanDraft } from "../model/coach-training-request.model";
import type { CoachTrainingRequestsLoadPayload } from "../state/coach-training-requests.state";
import {
  createTrainingPlanDraft,
  dedupeRequests,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
} from "./coach-training-requests.utils";

interface BuildLoadPayloadParams {
  approvedResponse: TrainingRequestResponseDto[];
  closedResponse: ClosedTrainingRequestResponseDto[];
  outgoingResponse: TrainingRequestResponseDto[];
  pendingResponse: TrainingRequestResponseDto[];
  previousDecisionDescriptions: Record<string, string>;
  previousTrainingPlanDrafts: Record<string, TrainingPlanDraft>;
  rejectedResponse: TrainingRequestResponseDto[];
}

export const buildCoachTrainingRequestsLoadPayload = ({
  approvedResponse,
  closedResponse,
  outgoingResponse,
  pendingResponse,
  previousDecisionDescriptions,
  previousTrainingPlanDrafts,
  rejectedResponse,
}: BuildLoadPayloadParams): CoachTrainingRequestsLoadPayload => {
  const outgoingRequests = outgoingResponse.map(mapTrainingRequestDtoToModel);
  const pendingRequests = dedupeRequests(pendingResponse.map(mapTrainingRequestDtoToModel));
  const approvedRequests = dedupeRequests(approvedResponse.map(mapTrainingRequestDtoToModel));
  const closedRequests = dedupeRequests(closedResponse.map(mapClosedTrainingRequestDtoToModel));
  const rejectedRequests = dedupeRequests(rejectedResponse.map(mapTrainingRequestDtoToModel));
  const requests = [
    ...outgoingRequests,
    ...pendingRequests,
    ...approvedRequests,
    ...closedRequests,
    ...rejectedRequests,
  ];

  const decisionDescriptions = { ...previousDecisionDescriptions };
  const trainingPlanDrafts = { ...previousTrainingPlanDrafts };

  requests.forEach((request) => {
    if (!(request.id in decisionDescriptions)) {
      decisionDescriptions[request.id] = getDecisionDescription(request);
    }
  });

  requests
    .filter((request) => request.status === "APPROVED")
    .forEach((request) => {
      if (!trainingPlanDrafts[request.id]) {
        const draft = createTrainingPlanDraft(request);
        trainingPlanDrafts[request.id] = {
          ...draft,
          planName: draft.planName || getTrainingPlanName(request),
          existingFileName: draft.existingFileName || getTrainingPlanFileName(request),
          planDescription: draft.planDescription || getTrainingPlanDescription(request),
        };
      }
    });

  return {
    approvedRequests,
    closedRequests,
    decisionDescriptions,
    outgoingRequests,
    pendingRequests,
    rejectedRequests,
    trainingPlanDrafts,
  };
};

export const getVisibleCoachTrainingRequests = (
  isCoach: boolean,
  coachViewMode: "coach" | "user",
  coachRequestFilter: "pending" | "approved" | "rejected" | "closed",
  payload: Pick<
    CoachTrainingRequestsLoadPayload,
    "approvedRequests" | "closedRequests" | "outgoingRequests" | "pendingRequests" | "rejectedRequests"
  >
) => {
  if (!isCoach || coachViewMode === "user") {
    return payload.outgoingRequests;
  }

  switch (coachRequestFilter) {
    case "approved":
      return payload.approvedRequests;
    case "rejected":
      return payload.rejectedRequests;
    case "closed":
      return payload.closedRequests;
    default:
      return payload.pendingRequests;
  }
};
