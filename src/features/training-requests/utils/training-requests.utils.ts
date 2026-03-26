import { API_BASE_URL } from "@/lib/api-client";
import type {
  ApprovedRequestDraft,
  TrainingRequestResponse,
  TrainingRequestStatus,
} from "../types/training-requests.types";

export const TRAINING_PLAN_UPLOAD_ENDPOINT = (trainingRequestId: string) =>
  `/api/training-requests/${trainingRequestId}/training-plan`;

export const statusLabelMap: Record<TrainingRequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CLOSED: "Closed",
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

export const getDecisionDescription = (request: TrainingRequestResponse) =>
  request.coachResponse.trim() || "";

export const getTrainingPlanDescription = (request: TrainingRequestResponse) =>
  request.planDescription?.trim() || "";

export const getTrainingPlanFileName = (request: TrainingRequestResponse) =>
  request.fileName?.trim() || "";

export const getTrainingPlanName = (request: TrainingRequestResponse) =>
  request.planName?.trim() || getTrainingPlanFileName(request).replace(/\.[^.]+$/, "");

export const createApprovedDraft = (
  request: TrainingRequestResponse
): ApprovedRequestDraft => ({
  planName: getTrainingPlanName(request),
  planDescription: getTrainingPlanDescription(request),
  file: null,
  existingFileName: getTrainingPlanFileName(request),
});

export const upsertRequest = (
  list: TrainingRequestResponse[],
  nextRequest: TrainingRequestResponse
) => {
  const hasMatch = list.some((request) => request.id === nextRequest.id);

  if (!hasMatch) {
    return [nextRequest, ...list];
  }

  return list.map((request) => (request.id === nextRequest.id ? nextRequest : request));
};

export const dedupeRequests = (requests: TrainingRequestResponse[]) => {
  const byId = new Map<string, TrainingRequestResponse>();

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
