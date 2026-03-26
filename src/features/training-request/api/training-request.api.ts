import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type {
  CreateTrainingRequestDto,
  TrainingRequestResponseDto,
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

  return { createTrainingRequest, getMyTrainingRequests };
};
