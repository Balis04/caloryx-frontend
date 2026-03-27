import { useApi } from "@/hooks/useApi";
import { ApiError, buildApiUrl } from "@/lib/api-client";
import { useCallback } from "react";
import type {
  ClosedTrainingRequestResponseDto,
  CreateTrainingRequestDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "./training-request.dto";

export const useTrainingRequestApi = () => {
  const { request } = useApi();

  const createTrainingRequest = useCallback(
    (coachProfileId: string, data: CreateTrainingRequestDto) =>
      request<TrainingRequestResponseDto>(
        `/api/training-requests/coach-profiles/${coachProfileId}`,
        {
          method: "POST",
          body: data,
        }
      ),
    [request]
  );

  const getMyTrainingRequests = useCallback(
    () => request<TrainingRequestResponseDto[]>("/api/training-requests/me"),
    [request]
  );

  const updateTrainingRequestStatus = useCallback(
    (trainingRequestId: string, data: UpdateTrainingRequestStatusDto) =>
      request<TrainingRequestResponseDto>(
        `/api/training-requests/${trainingRequestId}/status`,
        {
          method: "PATCH",
          body: data,
        }
      ),
    [request]
  );

  const uploadTrainingPlan = useCallback(
    (trainingRequestId: string, body: FormData) =>
      request<ClosedTrainingRequestResponseDto>(
        `/api/training-requests/${trainingRequestId}/training-plan`,
        {
          method: "POST",
          body,
        }
      ),
    [request]
  );

  const downloadTrainingPlanFile = useCallback(async (trainingRequestId: string) => {
    const response = await fetch(
      buildApiUrl(`/api/training-requests/${trainingRequestId}/training-plan/download`),
      {
        credentials: "include",
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Hiba: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("content-disposition") ?? "";
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    const basicMatch = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
    const fileName = decodeURIComponent(
      utf8Match?.[1] ?? basicMatch?.[1] ?? `training-plan-${trainingRequestId}`
    );

    return { blob, fileName };
  }, []);

  return {
    createTrainingRequest,
    downloadTrainingPlanFile,
    getMyTrainingRequests,
    updateTrainingRequestStatus,
    uploadTrainingPlan,
  };
};
