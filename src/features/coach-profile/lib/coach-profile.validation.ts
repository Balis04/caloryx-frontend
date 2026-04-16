import type {
  CoachProfileFormData,
  PendingCoachCertificateUpload,
} from "../model/coach-profile.types";

export interface CoachProfileValidationState {
  canSave: boolean;
  missingFields: string[];
}

export const getCoachProfileValidationState = (
  formData: CoachProfileFormData
): CoachProfileValidationState => {
  const hasDescription = formData.description.trim().length > 0;
  const hasStartDate = formData.startedCoachingAt.trim().length > 0;
  const hasCapacity = Number(formData.maxCapacity) > 0;
  const hasSessionFormat = formData.sessionFormat.trim().length > 0;
  const hasCurrency = formData.currency.trim().length > 0;
  const hasPriceFrom = formData.priceFrom.trim().length > 0;
  const hasPriceTo = formData.priceTo.trim().length > 0;
  const hasContactNote = formData.contactNote.trim().length > 0;
  const hasAvailableDay = formData.availability.some(
    (slot) => slot.enabled && slot.from < slot.until
  );
  const missingFields: string[] = [];

  if (!hasDescription) {
    missingFields.push("short description");
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

  if (!hasPriceFrom) {
    missingFields.push("price from");
  }

  if (!hasPriceTo) {
    missingFields.push("price to");
  }

  if (!hasContactNote) {
    missingFields.push("contact note");
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
      hasPriceFrom &&
      hasPriceTo &&
      hasContactNote &&
      hasAvailableDay,
    missingFields,
  };
};

export const canSaveCoachProfileForm = (formData: CoachProfileFormData) =>
  getCoachProfileValidationState(formData).canSave;

export const arePendingCertificatesValid = (
  pendingCertificates: PendingCoachCertificateUpload[]
) =>
  pendingCertificates.every(
    (certificate) =>
      certificate.certificateName.trim().length > 0 &&
      certificate.issuer.trim().length > 0 &&
      certificate.issuedAt.trim().length > 0
  );
