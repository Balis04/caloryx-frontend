import type { TrainingRequestFormData } from "../types";

export const canSubmitTrainingRequestForm = (
  formData: TrainingRequestFormData
) =>
  formData.weeklyWorkouts.trim().length > 0 &&
  formData.preferredSessionLength.trim().length > 0 &&
  formData.trainingLocation.trim().length > 0 &&
  formData.customerDescription.trim().length > 0;
