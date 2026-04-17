import type { CreateTrainingRequestDto } from "../api/training-request.dto";
import type { TrainingRequestFormData } from "../model/training-request.types";

export const mapTrainingRequestFormToCreateDto = (
  formData: TrainingRequestFormData
): CreateTrainingRequestDto => ({
  weeklyTrainingCount: Number(formData.weeklyWorkouts),
  sessionDurationMinutes: Number(formData.preferredSessionLength),
  preferredLocation: formData.trainingLocation.trim(),
  requestDescription: formData.customerDescription.trim(),
});
