import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "@/features/training-request/api/training-request.dto";

const COACH_TRAINING_REQUESTS_BASE_PATH = "/api/coach/training-requests";

export const useCoachTrainingRequestsApi = () => {
  const { request } = useApi();

  const getCoachTrainingRequests = useCallback(
    (status?: "PENDING" | "APPROVED" | "REJECTED") =>
      request<TrainingRequestResponseDto[]>(
        status
          ? `${COACH_TRAINING_REQUESTS_BASE_PATH}?status=${status}`
          : COACH_TRAINING_REQUESTS_BASE_PATH
      ),
    [request]
  );

  const getClosedCoachTrainingRequests = useCallback(
    () =>
      request<ClosedTrainingRequestResponseDto[]>(
        `${COACH_TRAINING_REQUESTS_BASE_PATH}/closed`
      ),
    [request]
  );

  const updateCoachTrainingRequestStatus = useCallback(
    (trainingRequestId: string, data: UpdateTrainingRequestStatusDto) =>
      request<TrainingRequestResponseDto>(
        `${COACH_TRAINING_REQUESTS_BASE_PATH}/${trainingRequestId}/status`,
        {
          method: "PATCH",
          body: data,
        }
      ),
    [request]
  );

  const uploadCoachTrainingPlan = useCallback(
    (trainingRequestId: string, body: FormData) =>
      request<ClosedTrainingRequestResponseDto>(
        `${COACH_TRAINING_REQUESTS_BASE_PATH}/${trainingRequestId}/training-plan`,
        {
          method: "POST",
          body,
        }
      ),
    [request]
  );

  return {
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  };
};
