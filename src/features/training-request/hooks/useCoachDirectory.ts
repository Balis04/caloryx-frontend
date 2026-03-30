import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import type { CoachCardData } from "../types/coach.types";

interface CoachProfileListResponse {
  id?: string;
  userId?: string;
  coachName?: string | null;
  shortDescription?: string | null;
  trainingStartedAt?: string | null;
  trainingFormat?: string | null;
  maxCapacity?: number | null;
  currency?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  contactNote?: string | null;
  email?: string | null;
  certificates?: Array<{
    id?: string | null;
    certificateName?: string | null;
    issuer?: string | null;
    issuedAt?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
  }>;
  availabilities?: Array<{
    dayOfWeek?: string;
    available?: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
}

const dayLabels: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const formatAvailability = (
  availabilities?: CoachProfileListResponse["availabilities"]
) => {
  const activeAvailabilities = availabilities?.filter((slot) => slot.available) ?? [];

  if (activeAvailabilities.length === 0) {
    return {
      summary: "By arrangement",
      slots: ["Time by arrangement"],
    };
  }

  const slots = activeAvailabilities.map((slot) => {
    const day = slot.dayOfWeek ? dayLabels[slot.dayOfWeek] ?? slot.dayOfWeek : "Unknown day";
    const timeRange =
      slot.startTime && slot.endTime
        ? `${slot.startTime}-${slot.endTime}`
        : "flexible time";
    return `${day} ${timeRange}`;
  });

  return {
    summary: slots.join(", "),
    slots,
  };
};

const formatExperience = (trainingStartedAt?: string | null) => {
  if (!trainingStartedAt) {
    return "Experience not provided";
  }

  const startedYear = new Date(trainingStartedAt).getFullYear();
  const currentYear = new Date().getFullYear();

  if (Number.isNaN(startedYear)) {
    return "Experience not provided";
  }

  const years = Math.max(currentYear - startedYear, 0);
  return years === 0 ? "Less than 1 year of experience" : `${years} years of experience`;
};

const normalizeCoach = (
  coach: CoachProfileListResponse,
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
      coach.trainingFormat
        ? `${coach.trainingFormat}`
        : "Format not provided",
      coach.maxCapacity ? `Capacity: ${coach.maxCapacity} people` : "Capacity not provided",
      coach.priceFrom != null || coach.priceTo != null
        ? `Price: ${coach.priceFrom ?? 0}-${coach.priceTo ?? 0} ${coach.currency ?? ""}`.trim()
        : "Price not provided",
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

export const useCoachDirectory = () => {
  const { request } = useApi();
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoaches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await request<CoachProfileListResponse[]>("/api/coach-profiles");
      setCoaches(response.map(normalizeCoach));
    } catch {
      setCoaches([]);
      setError("Failed to load the coach list from the backend.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  return {
    coaches,
    loading,
    error,
    reload: loadCoaches,
  };
};
