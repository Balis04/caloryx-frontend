import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "../api/training-request.dto";
import type { CoachTrainingRequest } from "../model/coach-training-request.model";

export const mapTrainingRequestDtoToModel = (
  dto: TrainingRequestResponseDto
): CoachTrainingRequest => ({
  ...dto,
  requestDescription: dto.requestDescription?.trim() || "",
  coachResponse: dto.coachResponse?.trim() || "",
});

export const mapClosedTrainingRequestDtoToModel = (
  dto: ClosedTrainingRequestResponseDto
): CoachTrainingRequest => ({
  id: dto.requestId,
  coachName: dto.coachName,
  requesterName: dto.requesterName,
  requesterEmail: dto.requesterEmail,
  weeklyTrainingCount: dto.weeklyTrainingCount,
  sessionDurationMinutes: dto.sessionDurationMinutes,
  preferredLocation: dto.preferredLocation,
  status: dto.status,
  requestDescription: dto.requestDescription?.trim() || "",
  coachResponse: dto.coachResponse?.trim() || "",
  createdAt: dto.createdAt,
  planName: dto.planName ?? null,
  planDescription: dto.planDescription ?? null,
  fileName: dto.fileName ?? null,
  uploadedAt: dto.uploadedAt ?? null,
});

export const mapTrainingRequestStatusToUpdateDto = (
  status: Exclude<CoachTrainingRequest["status"], "PENDING" | "CLOSED">,
  coachResponse: string
): UpdateTrainingRequestStatusDto => ({
  status,
  coachResponse: coachResponse.trim(),
});
