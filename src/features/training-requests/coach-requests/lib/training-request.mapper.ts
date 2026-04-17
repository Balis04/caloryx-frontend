import type {
  ClosedTrainingRequestResponse,
  TrainingRequestResponse,
  UpdateTrainingRequestStatusRequest,
} from "../api/training-request.dto";
import type { CoachTrainingRequest } from "../model/coach-training-request.model";

export const mapTrainingRequestResponseToModel = (
  response: TrainingRequestResponse
): CoachTrainingRequest => ({
  ...response,
  requestDescription: response.requestDescription?.trim() || "",
  coachResponse: response.coachResponse?.trim() || "",
});

export const mapClosedTrainingRequestResponseToModel = (
  response: ClosedTrainingRequestResponse
): CoachTrainingRequest => ({
  id: response.requestId,
  coachName: response.coachName,
  requesterName: response.requesterName,
  requesterEmail: response.requesterEmail,
  weeklyTrainingCount: response.weeklyTrainingCount,
  sessionDurationMinutes: response.sessionDurationMinutes,
  preferredLocation: response.preferredLocation,
  status: response.status,
  requestDescription: response.requestDescription?.trim() || "",
  coachResponse: response.coachResponse?.trim() || "",
  createdAt: response.createdAt,
  planName: response.planName ?? null,
  planDescription: response.planDescription ?? null,
  fileName: response.fileName ?? null,
  uploadedAt: response.uploadedAt ?? null,
});

export const mapTrainingRequestStatusToRequest = (
  status: Exclude<CoachTrainingRequest["status"], "PENDING" | "CLOSED">,
  coachResponse: string
): UpdateTrainingRequestStatusRequest => ({
  status,
  coachResponse: coachResponse.trim(),
});
