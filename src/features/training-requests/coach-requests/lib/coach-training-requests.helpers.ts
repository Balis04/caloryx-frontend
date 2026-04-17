import { API_BASE_URL } from "@/lib/api-client";
import type {
  CoachRequestFilter,
  CoachTrainingRequest,
  TrainingPlanDraft,
  TrainingRequestStatus,
} from "@/features/training-requests/types";

export const statusLabelMap: Record<TrainingRequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CLOSED: "Closed",
};

export const coachRequestFilterLabelMap: Record<CoachRequestFilter, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  closed: "Closed",
};

export const statusVariantMap: Record<
  TrainingRequestStatus,
  "secondary" | "default" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  REJECTED: "secondary",
  CLOSED: "secondary",
};

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getDecisionDescription = (request: CoachTrainingRequest) =>
  request.coachResponse.trim() || "";
export const getTrainingPlanDescription = (request: CoachTrainingRequest) =>
  request.planDescription?.trim() || "";
export const getTrainingPlanFileName = (request: CoachTrainingRequest) =>
  request.fileName?.trim() || "";
export const getTrainingPlanName = (request: CoachTrainingRequest) =>
  request.planName?.trim() || getTrainingPlanFileName(request).replace(/\.[^.]+$/, "");

export const createTrainingPlanDraft = (
  request: CoachTrainingRequest
): TrainingPlanDraft => ({
  planName: getTrainingPlanName(request),
  planDescription: getTrainingPlanDescription(request),
  file: null,
  existingFileName: getTrainingPlanFileName(request),
});

export const upsertRequest = (
  list: CoachTrainingRequest[],
  nextRequest: CoachTrainingRequest
) => {
  const hasMatch = list.some((request) => request.id === nextRequest.id);
  if (!hasMatch) {
    return [nextRequest, ...list];
  }
  return list.map((request) => (request.id === nextRequest.id ? nextRequest : request));
};

export const dedupeRequests = (requests: CoachTrainingRequest[]) => {
  const byId = new Map<string, CoachTrainingRequest>();
  requests.forEach((request) => {
    byId.set(request.id, request);
  });
  return Array.from(byId.values());
};

export const openFile = (fileUrl: string) => {
  if (!fileUrl) {
    return;
  }
  const normalizedUrl = /^https?:\/\//i.test(fileUrl)
    ? fileUrl
    : `${API_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
};

