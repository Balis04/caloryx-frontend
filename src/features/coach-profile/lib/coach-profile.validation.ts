import type { CoachProfileFormData } from "../types/coach-profile.types";

export const canSaveCoachProfileForm = (formData: CoachProfileFormData) => {
  const hasDescription = formData.description.trim().length >= 20;
  const hasStartDate = formData.startedCoachingAt.trim().length > 0;
  const hasCapacity = Number(formData.maxCapacity) > 0;
  const hasSessionFormat = formData.sessionFormat.trim().length > 0;
  const hasCurrency = formData.currency.trim().length > 0;
  const hasAvailableDay = formData.availability.some(
    (slot) => slot.enabled && slot.from < slot.until
  );

  return (
    hasDescription &&
    hasStartDate &&
    hasCapacity &&
    hasSessionFormat &&
    hasCurrency &&
    hasAvailableDay
  );
};
