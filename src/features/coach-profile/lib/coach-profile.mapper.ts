import type {
  CoachProfileCertificateDto,
  CoachProfileResponseDto,
  SaveCoachProfileRequestDto,
} from "../api/coach-profile.dto";
import type {
  AvailabilitySlot,
  CoachCertificate,
  CoachProfileFormData,
} from "../types/coach-profile.types";

export const createInitialAvailability = (): AvailabilitySlot[] => [
  { dayOfWeek: "MONDAY", label: "Monday", enabled: true, from: "08:00", until: "16:00" },
  { dayOfWeek: "TUESDAY", label: "Tuesday", enabled: true, from: "08:00", until: "16:00" },
  { dayOfWeek: "WEDNESDAY", label: "Wednesday", enabled: true, from: "08:00", until: "16:00" },
  { dayOfWeek: "THURSDAY", label: "Thursday", enabled: true, from: "08:00", until: "16:00" },
  { dayOfWeek: "FRIDAY", label: "Friday", enabled: true, from: "08:00", until: "14:00" },
  { dayOfWeek: "SATURDAY", label: "Saturday", enabled: false, from: "09:00", until: "12:00" },
  { dayOfWeek: "SUNDAY", label: "Sunday", enabled: false, from: "09:00", until: "12:00" },
];

export const initialCoachProfileFormData: CoachProfileFormData = {
  description: "",
  startedCoachingAt: "",
  maxCapacity: "",
  sessionFormat: "",
  priceFrom: "",
  priceTo: "",
  currency: "HUF",
  contactNote: "",
  certificates: [],
  availability: createInitialAvailability(),
};

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
  description: data.shortDescription ?? "",
  startedCoachingAt: data.trainingStartedAt ?? "",
  maxCapacity: String(data.maxCapacity ?? ""),
  sessionFormat: data.trainingFormat ?? "",
  priceFrom: String(data.priceFrom ?? ""),
  priceTo: String(data.priceTo ?? ""),
  currency: data.currency ?? "HUF",
  contactNote: data.contactNote ?? "",
  certificates: Array.isArray(data.certificates)
    ? data.certificates.map(mapCoachCertificateDtoToModel)
    : [],
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
