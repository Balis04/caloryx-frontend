import type {
  CoachCardData,
  CoachProfileListResponseDto,
} from "../model/training-request.types";
import { formatAvailability, formatExperience } from "./coach-directory.presentation";

export const mapCoachDirectoryDtoToCard = (
  coach: CoachProfileListResponseDto,
  index: number
): CoachCardData => {
  const availability = formatAvailability(coach.availabilities);

  return {
    id: coach.id ?? `coach-${index}`,
    fullName: coach.coachName ?? `Coach #${index + 1}`,
    email: coach.email ?? "No email provided",
    bio:
      coach.shortDescription ??
      coach.contactNote ??
      "This coach has not added an introduction yet.",
    contactNote: coach.contactNote?.trim() || "-",
    specialties: [
      {
        label: "Format",
        value: coach.trainingFormat?.trim() || "Format not provided",
      },
      {
        label: "Capacity",
        value: coach.maxCapacity ? `${coach.maxCapacity} people` : "Capacity not provided",
      },
      coach.priceFrom != null || coach.priceTo != null
        ? {
            label: "Price",
            value: `${coach.priceFrom ?? 0}-${coach.priceTo ?? 0} ${coach.currency ?? ""}`.trim(),
          }
        : {
            label: "Price",
            value: "Price not provided",
          },
    ],
    weeklyAvailability: availability.summary,
    availabilitySlots: availability.slots,
    experienceLabel: formatExperience(coach.trainingStartedAt),
    certificates:
      coach.certificates?.map((certificate, certificateIndex) => ({
        id: certificate.id?.trim() || `${coach.id ?? index}-certificate-${certificateIndex}`,
        certificateName: certificate.certificateName?.trim() || "Unnamed certificate",
        issuer: certificate.issuer?.trim() || "",
        issuedAt: certificate.issuedAt?.trim() || "",
        fileName: certificate.fileName?.trim() || "",
        fileUrl: certificate.fileUrl?.trim() || "",
      })) ?? [],
  };
};

export const mapCoachDirectoryDtosToCards = (coaches: CoachProfileListResponseDto[]) =>
  coaches.map(mapCoachDirectoryDtoToCard);
