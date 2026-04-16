import { apiClient } from "@/lib/api-client";
import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "./training-request.dto";

const COACH_TRAINING_REQUESTS_BASE_PATH = "/api/coach/training-requests";

const getCoachTrainingRequests = (status?: "PENDING" | "APPROVED" | "REJECTED") =>
  apiClient<TrainingRequestResponseDto[]>(
    status
      ? `${COACH_TRAINING_REQUESTS_BASE_PATH}?status=${status}`
      : COACH_TRAINING_REQUESTS_BASE_PATH
  );

const getClosedCoachTrainingRequests = () =>
  apiClient<ClosedTrainingRequestResponseDto[]>(
    `${COACH_TRAINING_REQUESTS_BASE_PATH}/closed`
  );

const updateCoachTrainingRequestStatus = (
  trainingRequestId: string,
  data: UpdateTrainingRequestStatusDto
) =>
  apiClient<TrainingRequestResponseDto>(
    `${COACH_TRAINING_REQUESTS_BASE_PATH}/${trainingRequestId}/status`,
    {
      method: "PATCH",
      body: data,
    }
  );

const uploadCoachTrainingPlan = (trainingRequestId: string, body: FormData) =>
  apiClient<ClosedTrainingRequestResponseDto>(
    `${COACH_TRAINING_REQUESTS_BASE_PATH}/${trainingRequestId}/training-plan`,
    {
      method: "POST",
      body,
    }
  );

export const useCoachTrainingRequestsApi = () => {
  return {
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  };
};
