import type { CreateTrainingRequestDto } from "../../shared/api/training-request.dto";
import type { TrainingRequestFormData } from "../types/training-request-form.types";

export const mapTrainingRequestFormToCreateDto = (
  formData: TrainingRequestFormData
): CreateTrainingRequestDto => ({
  weeklyTrainingCount: Number(formData.weeklyWorkouts),
  sessionDurationMinutes: Number(formData.preferredSessionLength),
  preferredLocation: formData.trainingLocation.trim(),
  requestDescription: formData.customerDescription.trim(),
});
