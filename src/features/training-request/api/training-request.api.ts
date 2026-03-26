import { useApi } from "@/hooks/useApi";
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

  return {
    createTrainingRequest,
    getMyTrainingRequests,
    updateTrainingRequestStatus,
    uploadTrainingPlan,
  };
};
