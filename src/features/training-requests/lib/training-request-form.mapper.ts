import type { CreateTrainingRequestRequest } from "@/features/training-requests/types";
import type { TrainingRequestFormData } from "@/features/training-requests/types";

export const mapTrainingRequestFormDataToRequest = (
  formData: TrainingRequestFormData
): CreateTrainingRequestRequest => ({
  weeklyTrainingCount: Number(formData.weeklyWorkouts),
  sessionDurationMinutes: Number(formData.preferredSessionLength),
  preferredLocation: formData.trainingLocation.trim(),
  requestDescription: formData.customerDescription.trim(),
});

