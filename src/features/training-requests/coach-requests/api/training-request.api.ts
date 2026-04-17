import { ApiError, apiClient, buildApiUrl } from "@/lib/api-client";

import type {
  ClosedTrainingRequestResponse,
  TrainingRequestResponse,
  UpdateTrainingRequestStatusRequest,
} from "./training-request.dto";

const COACH_TRAINING_REQUESTS_BASE_PATH = "/api/coach/training-requests";

export const getMyTrainingRequests = () =>
  apiClient<TrainingRequestResponse[]>("/api/training-requests/me");

export const getCoachTrainingRequests = (status?: "PENDING" | "APPROVED" | "REJECTED") =>
  apiClient<TrainingRequestResponse[]>(
    status
      ? `${COACH_TRAINING_REQUESTS_BASE_PATH}?status=${status}`
      : COACH_TRAINING_REQUESTS_BASE_PATH
  );

export const getClosedCoachTrainingRequests = () =>
  apiClient<ClosedTrainingRequestResponse[]>(
    `${COACH_TRAINING_REQUESTS_BASE_PATH}/closed`
  );

export const updateCoachTrainingRequestStatus = (
  trainingRequestId: string,
  data: UpdateTrainingRequestStatusRequest
) =>
  apiClient<TrainingRequestResponse>(
    `${COACH_TRAINING_REQUESTS_BASE_PATH}/${trainingRequestId}/status`,
    {
      method: "PATCH",
      body: data,
    }
  );

export const uploadCoachTrainingPlan = (trainingRequestId: string, body: FormData) =>
  apiClient<ClosedTrainingRequestResponse>(
    `${COACH_TRAINING_REQUESTS_BASE_PATH}/${trainingRequestId}/training-plan`,
    {
      method: "POST",
      body,
    }
  );

export const downloadTrainingPlanFile = async (trainingRequestId: string) => {
  const response = await fetch(
    buildApiUrl(`/api/training-requests/${trainingRequestId}/training-plan/download`),
    {
      credentials: "include",
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new ApiError(
      `Failed to download the training plan: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition") ?? "";
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  const fileName = decodeURIComponent(
    utf8Match?.[1] ?? basicMatch?.[1] ?? `training-plan-${trainingRequestId}`
  );

  return { blob, fileName };
};
