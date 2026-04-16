import { ApiError, apiClient, buildApiUrl } from "@/lib/api-client";
import type {
  ClosedTrainingRequestResponseDto,
  CreateTrainingRequestDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "./training-request.dto";

const createTrainingRequest = (coachProfileId: string, data: CreateTrainingRequestDto) =>
  apiClient<TrainingRequestResponseDto>(
    `/api/training-requests/coach-profiles/${coachProfileId}`,
    {
      method: "POST",
      body: data,
    }
  );

const getMyTrainingRequests = () =>
  apiClient<TrainingRequestResponseDto[]>("/api/training-requests/me");

const updateTrainingRequestStatus = (
  trainingRequestId: string,
  data: UpdateTrainingRequestStatusDto
) =>
  apiClient<TrainingRequestResponseDto>(`/api/training-requests/${trainingRequestId}/status`, {
    method: "PATCH",
    body: data,
  });

const uploadTrainingPlan = (trainingRequestId: string, body: FormData) =>
  apiClient<ClosedTrainingRequestResponseDto>(
    `/api/training-requests/${trainingRequestId}/training-plan`,
    {
      method: "POST",
      body,
    }
  );

const downloadTrainingPlanFile = async (trainingRequestId: string) => {
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

export const useTrainingRequestApi = () => {
  return {
    createTrainingRequest,
    downloadTrainingPlanFile,
    getMyTrainingRequests,
    updateTrainingRequestStatus,
    uploadTrainingPlan,
  };
};
