import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import type { TrainerCardData } from "../types/trainer.types";

interface CoachProfileListResponse {
  id?: string;
  userId?: string;
  trainerName?: string | null;
  shortDescription?: string | null;
  trainingStartedAt?: string | null;
  trainingFormat?: string | null;
  maxCapacity?: number | null;
  currency?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  contactNote?: string | null;
  email?: string | null;
  availabilities?: Array<{
    dayOfWeek?: string;
    available?: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
}

const dayLabels: Record<string, string> = {
  MONDAY: "Hetfo",
  TUESDAY: "Kedd",
  WEDNESDAY: "Szerda",
  THURSDAY: "Csutortok",
  FRIDAY: "Pentek",
  SATURDAY: "Szombat",
  SUNDAY: "Vasarnap",
};

const formatAvailability = (
  availabilities?: CoachProfileListResponse["availabilities"]
) => {
  const activeAvailabilities =
    availabilities?.filter((slot) => slot.available) ?? [];

  if (activeAvailabilities.length === 0) {
    return {
      summary: "Egyeztetes alapjan",
      slots: ["Idopont egyeztetes szerint"],
    };
  }

  const slots = activeAvailabilities.map((slot) => {
      const day = slot.dayOfWeek ? dayLabels[slot.dayOfWeek] ?? slot.dayOfWeek : "Ismeretlen nap";
      const timeRange =
        slot.startTime && slot.endTime
          ? `${slot.startTime}-${slot.endTime}`
          : "rugalmas idopont";
      return `${day} ${timeRange}`;
    });

  return {
    summary: slots.join(", "),
    slots,
  };
};

const formatExperience = (trainingStartedAt?: string | null) => {
  if (!trainingStartedAt) {
    return "Tapasztalat nincs megadva";
  }

  const startedYear = new Date(trainingStartedAt).getFullYear();
  const currentYear = new Date().getFullYear();

  if (Number.isNaN(startedYear)) {
    return "Tapasztalat nincs megadva";
  }

  const years = Math.max(currentYear - startedYear, 0);
  return years === 0 ? "Kevesebb mint 1 ev tapasztalat" : `${years} ev tapasztalat`;
};

const normalizeTrainer = (
  trainer: CoachProfileListResponse,
  index: number
): TrainerCardData => {
  const availability = formatAvailability(trainer.availabilities);

  return {
    id: trainer.id ?? `trainer-${index}`,
    fullName:
      trainer.trainerName ??
      `Edzo #${index + 1}`,
    email: trainer.email ?? "Email nincs megadva",
    bio:
      trainer.shortDescription ??
      trainer.contactNote ??
      "Ennek az edzonek a bemutatkozasa meg nincs kitoltve.",
    specialties: [
      trainer.trainingFormat
        ? `Formatum: ${trainer.trainingFormat}`
        : "Formatum nincs megadva",
      trainer.maxCapacity ? `Kapacitas: ${trainer.maxCapacity} fo` : "Kapacitas nincs megadva",
      trainer.priceFrom || trainer.priceTo
        ? `Ar: ${trainer.priceFrom ?? 0}-${trainer.priceTo ?? 0} ${trainer.currency ?? ""}`.trim()
        : "Ar nincs megadva",
    ],
    weeklyAvailability: availability.summary,
    availabilitySlots: availability.slots,
    experienceLabel: formatExperience(trainer.trainingStartedAt),
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
      setError(
        "Nem sikerult betolteni az edzok listajat a backendrol."
      );
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
