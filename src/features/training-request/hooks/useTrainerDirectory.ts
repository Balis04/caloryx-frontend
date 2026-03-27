import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import type { TrainerCardData } from "../types/trainer.types";

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

const normalizeTrainer = (
  trainer: CoachProfileListResponse,
  index: number
): TrainerCardData => {
  const availability = formatAvailability(trainer.availabilities);

  return {
    id: trainer.id ?? `trainer-${index}`,
    fullName: trainer.coachName ?? `Trainer #${index + 1}`,
    email: trainer.email ?? "No email provided",
    bio:
      trainer.shortDescription ??
      trainer.contactNote ??
      "This trainer has not added an introduction yet.",
    contactNote: trainer.contactNote?.trim() || "-",
    specialties: [
      trainer.trainingFormat
        ? `Format: ${trainer.trainingFormat}`
        : "Format not provided",
      trainer.maxCapacity ? `Capacity: ${trainer.maxCapacity} people` : "Capacity not provided",
      trainer.priceFrom != null || trainer.priceTo != null
        ? `Price: ${trainer.priceFrom ?? 0}-${trainer.priceTo ?? 0} ${trainer.currency ?? ""}`.trim()
        : "Price not provided",
    ],
    weeklyAvailability: availability.summary,
    availabilitySlots: availability.slots,
    experienceLabel: formatExperience(trainer.trainingStartedAt),
    certificates:
      trainer.certificates?.map((certificate, certificateIndex) => ({
        id: certificate.id?.trim() || `${trainer.id ?? index}-certificate-${certificateIndex}`,
        certificateName: certificate.certificateName?.trim() || "Unnamed certificate",
        issuer: certificate.issuer?.trim() || "",
        issuedAt: certificate.issuedAt?.trim() || "",
        fileName: certificate.fileName?.trim() || "",
        fileUrl: certificate.fileUrl?.trim() || "",
      })) ?? [],
  };
};

export const useTrainerDirectory = () => {
  const { request } = useApi();
  const [trainers, setTrainers] = useState<TrainerCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrainers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await request<CoachProfileListResponse[]>("/api/coach-profiles");
      setTrainers(response.map(normalizeTrainer));
    } catch {
      setTrainers([]);
      setError("Failed to load the trainer list from the backend.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadTrainers();
  }, [loadTrainers]);

  return {
    trainers,
    loading,
    error,
    reload: loadTrainers,
  };
};
