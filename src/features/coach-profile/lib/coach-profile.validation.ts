import type { CoachProfileFormData } from "../types/coach-profile.types";

export interface CoachProfileValidationState {
  canSave: boolean;
  descriptionCharacters: number;
  remainingDescriptionCharacters: number;
  missingFields: string[];
}

export const getCoachProfileValidationState = (
  formData: CoachProfileFormData
): CoachProfileValidationState => {
  const hasDescription = formData.description.trim().length >= 20;
  const hasStartDate = formData.startedCoachingAt.trim().length > 0;
  const hasCapacity = Number(formData.maxCapacity) > 0;
  const hasSessionFormat = formData.sessionFormat.trim().length > 0;
  const hasCurrency = formData.currency.trim().length > 0;
  const hasAvailableDay = formData.availability.some(
    (slot) => slot.enabled && slot.from < slot.until
  );
  const missingFields: string[] = [];

  if (!hasDescription) {
    missingFields.push("short description (minimum 20 characters)");
  }

  if (!hasStartDate) {
    missingFields.push("coaching start date");
  }

  if (!hasCapacity) {
    missingFields.push("maximum capacity");
  }

  if (!hasSessionFormat) {
    missingFields.push("training format");
  }

  if (!hasCurrency) {
    missingFields.push("currency");
  }

  if (!hasAvailableDay) {
    missingFields.push("at least one valid availability slot");
  }

  return {
    canSave:
      hasDescription &&
      hasStartDate &&
      hasCapacity &&
      hasSessionFormat &&
      hasCurrency &&
      hasAvailableDay,
    descriptionCharacters: formData.description.trim().length,
    remainingDescriptionCharacters: Math.max(0, 20 - formData.description.trim().length),
    missingFields,
  };
};

export const canSaveCoachProfileForm = (formData: CoachProfileFormData) =>
  getCoachProfileValidationState(formData).canSave;
