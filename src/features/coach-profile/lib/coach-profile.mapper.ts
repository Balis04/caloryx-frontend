import type {
  CoachProfileCertificateDto,
  CoachProfileResponseDto,
  SaveCoachProfileRequestDto,
} from "../model/coach-profile.types";
import {
  createInitialAvailability,
  initialCoachProfileFormData,
} from "../model/coach-profile.form";
import type {
  CoachCertificate,
  CoachProfileFormData,
} from "../model/coach-profile.types";

export const mapCoachCertificateDtoToModel = (
  certificate: CoachProfileCertificateDto,
  index: number
): CoachCertificate => {
  if (typeof certificate === "string") {
    return {
      id: `legacy-${index}-${certificate}`,
      certificateName: certificate,
      issuer: "",
      issuedAt: "",
      fileName: certificate,
      fileUrl: "",
    };
  }

  return {
    id: certificate?.id ?? `certificate-${index}`,
    certificateName:
      certificate?.certificateName?.trim() ||
      certificate?.fileName?.trim() ||
      `Certificate ${index + 1}`,
    issuer: certificate?.issuer?.trim() ?? "",
    issuedAt: certificate?.issuedAt?.trim() ?? "",
    fileName: certificate?.fileName?.trim() ?? "",
    fileUrl: certificate?.fileUrl?.trim() ?? "",
  };
};

export const mapCoachProfileResponseToFormData = (
  data: CoachProfileResponseDto
): CoachProfileFormData => ({
  ...initialCoachProfileFormData,
  description: data.shortDescription ?? initialCoachProfileFormData.description,
  startedCoachingAt: data.trainingStartedAt ?? initialCoachProfileFormData.startedCoachingAt,
  maxCapacity: String(data.maxCapacity ?? initialCoachProfileFormData.maxCapacity),
  sessionFormat: data.trainingFormat ?? initialCoachProfileFormData.sessionFormat,
  priceFrom: String(data.priceFrom ?? initialCoachProfileFormData.priceFrom),
  priceTo: String(data.priceTo ?? initialCoachProfileFormData.priceTo),
  currency: data.currency ?? initialCoachProfileFormData.currency,
  contactNote: data.contactNote ?? initialCoachProfileFormData.contactNote,
  certificates: Array.isArray(data.certificates)
    ? data.certificates.map(mapCoachCertificateDtoToModel)
    : initialCoachProfileFormData.certificates,
  availability:
    Array.isArray(data.availabilities) && data.availabilities.length > 0
      ? createInitialAvailability().map((defaultSlot) => {
          const matchingSlot = data.availabilities?.find(
            (slot) => slot.dayOfWeek === defaultSlot.dayOfWeek
          );

          return {
            dayOfWeek: defaultSlot.dayOfWeek,
            label: defaultSlot.label,
            enabled: matchingSlot?.available ?? false,
            from: matchingSlot?.startTime ?? defaultSlot.from,
            until: matchingSlot?.endTime ?? defaultSlot.until,
          };
        })
      : createInitialAvailability(),
});

export const mapCoachProfileFormDataToRequest = (
  formData: CoachProfileFormData
): SaveCoachProfileRequestDto => ({
  trainingStartedAt: formData.startedCoachingAt,
  shortDescription: formData.description,
  trainingFormat: formData.sessionFormat,
  priceFrom: formData.priceFrom ? Number(formData.priceFrom) : null,
  priceTo: formData.priceTo ? Number(formData.priceTo) : null,
  currency: formData.currency || null,
  maxCapacity: Number(formData.maxCapacity),
  contactNote: formData.contactNote.trim() || null,
  availabilities: formData.availability.map((slot) => ({
    dayOfWeek: slot.dayOfWeek,
    available: slot.enabled,
    startTime: slot.enabled ? slot.from : null,
    endTime: slot.enabled ? slot.until : null,
  })),
  certificates: [],
});
