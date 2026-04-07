import type {
  ClosedTrainingRequestResponseDto,
  CreateTrainingRequestDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "../api/training-request.dto";
import type { TrainingRequest } from "../model/training-request.model";
import type { TrainingRequestFormData } from "@/features/training-request/types/training-request-form.types";

export const mapTrainingRequestDtoToModel = (
  dto: TrainingRequestResponseDto
): TrainingRequest => ({
  ...dto,
  requestDescription: dto.requestDescription?.trim() || "",
  coachResponse: dto.coachResponse?.trim() || "",
});

export const mapClosedTrainingRequestDtoToModel = (
  dto: ClosedTrainingRequestResponseDto
): TrainingRequest => ({
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

export const mapTrainingRequestFormToCreateDto = (
  formData: TrainingRequestFormData
): CreateTrainingRequestDto => ({
  weeklyTrainingCount: Number(formData.weeklyWorkouts),
  sessionDurationMinutes: Number(formData.preferredSessionLength),
  preferredLocation: formData.trainingLocation.trim(),
  requestDescription: formData.customerDescription.trim(),
});

export const mapTrainingRequestStatusToUpdateDto = (
  status: Exclude<TrainingRequest["status"], "PENDING" | "CLOSED">,
  coachResponse: string
): UpdateTrainingRequestStatusDto => ({
  status,
  coachResponse: coachResponse.trim(),
});
