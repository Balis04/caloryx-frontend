import type {
  CreateTrainingRequestDto,
  TrainingRequestResponseDto,
} from "../api/training-request.dto";
import type { TrainingRequest } from "../model/training-request.model";
import type { TrainingRequestFormData } from "../types/training-request-form.types";

export const mapTrainingRequestDtoToModel = (
  dto: TrainingRequestResponseDto
): TrainingRequest => ({
  ...dto,
  description: dto.description?.trim() || "",
  coachNote: dto.coachNote?.trim() || "",
});

export const mapTrainingRequestFormToCreateDto = (
  formData: TrainingRequestFormData
): CreateTrainingRequestDto => ({
  weeklyTrainingCount: Number(formData.weeklyWorkouts),
  sessionDurationMinutes: Number(formData.preferredSessionLength),
  preferredLocation: formData.trainingLocation.trim(),
  description: formData.customerDescription.trim(),
});
