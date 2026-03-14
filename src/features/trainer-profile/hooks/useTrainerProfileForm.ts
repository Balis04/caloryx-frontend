import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/api-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AvailabilitySlot,
  TrainerProfileFormData,
} from "../types/trainer-profile.types";

const createInitialAvailability = (): AvailabilitySlot[] => [
  {
    dayOfWeek: "MONDAY",
    label: "Hetfo",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "TUESDAY",
    label: "Kedd",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "WEDNESDAY",
    label: "Szerda",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "THURSDAY",
    label: "Csutortok",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "FRIDAY",
    label: "Pentek",
    enabled: true,
    from: "08:00",
    until: "14:00",
  },
  {
    dayOfWeek: "SATURDAY",
    label: "Szombat",
    enabled: false,
    from: "09:00",
    until: "12:00",
  },
  {
    dayOfWeek: "SUNDAY",
    label: "Vasarnap",
    enabled: false,
    from: "09:00",
    until: "12:00",
  },
];

const initialFormData: TrainerProfileFormData = {
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

interface CoachProfileResponse {
  id: string;
  trainingStartedAt: string | null;
  shortDescription: string | null;
  trainingFormat: TrainerProfileFormData["sessionFormat"];
  priceFrom: number | null;
  priceTo: number | null;
  currency: TrainerProfileFormData["currency"];
  maxCapacity: number | null;
  contactNote: string | null;
  availabilities?: Array<{
    dayOfWeek?: string;
    available?: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
  certificates?: string[];
}

const normalizeCoachProfileResponse = (
  data: CoachProfileResponse
): TrainerProfileFormData => ({
  description: data.shortDescription ?? "",
  startedCoachingAt: data.trainingStartedAt ?? "",
  maxCapacity: String(data.maxCapacity ?? ""),
  sessionFormat: data.trainingFormat ?? "",
  priceFrom: String(data.priceFrom ?? ""),
  priceTo: String(data.priceTo ?? ""),
  currency: data.currency ?? "HUF",
  contactNote: data.contactNote ?? "",
  certificates: Array.isArray(data.certificates) ? data.certificates : [],
  availability:
    Array.isArray(data.availabilities) && data.availabilities.length > 0
      ? createInitialAvailability().map((defaultSlot) => {
          const matchingSlot = data.availabilities?.find(
            (slot) => slot.dayOfWeek === defaultSlot.dayOfWeek
          );

          return {
            dayOfWeek: defaultSlot.dayOfWeek,
            label: defaultSlot.label,
            enabled: matchingSlot?.available ?? defaultSlot.enabled,
            from: matchingSlot?.startTime ?? defaultSlot.from,
            until: matchingSlot?.endTime ?? defaultSlot.until,
          };
        })
      : createInitialAvailability(),
});

export const useTrainerProfileForm = () => {
  const { request } = useApi();
  const [formData, setFormData] = useState<TrainerProfileFormData>(initialFormData);
  const [coachProfileId, setCoachProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasTrainerProfile, setHasTrainerProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadTrainerProfile = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await request<CoachProfileResponse>(
        "/api/coach-profiles/me",
        {
          suppressErrorLog: true,
        }
      );
      setFormData(normalizeCoachProfileResponse(response));
      setCoachProfileId(response.id);
      setHasTrainerProfile(true);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setFormData(initialFormData);
        setCoachProfileId(null);
        setHasTrainerProfile(false);
        setIsEditing(false);
      } else {
        const message =
          error instanceof Error ? error.message : "Nem sikerult betolteni az edzoi profilt.";
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void loadTrainerProfile();
  }, [loadTrainerProfile]);

  const setField = useCallback(
    <K extends keyof TrainerProfileFormData>(
      key: K,
      value: TrainerProfileFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setAvailabilityField = useCallback(
    (day: string, key: keyof AvailabilitySlot, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        availability: prev.availability.map((slot) =>
          slot.dayOfWeek === day ? { ...slot, [key]: value } : slot
        ),
      }));
    },
    []
  );

  const saveTrainerProfile = useCallback(async () => {
    setSaving(true);
    setErrorMessage(null);

    const payload = {
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
    };

    const method = coachProfileId ? "PUT" : "POST";
    const endpoint = coachProfileId
      ? `/api/coach-profiles/${coachProfileId}`
      : "/api/coach-profiles";

    try {
      const response = await request<CoachProfileResponse>(endpoint, {
        method,
        body: payload,
      });
      setFormData(normalizeCoachProfileResponse(response));
      setCoachProfileId(response.id);
      setHasTrainerProfile(true);
      setIsEditing(false);
      setStatusMessage(
        coachProfileId
          ? "Az edzoi profil sikeresen modositva."
          : "Az edzoi profil sikeresen letrehozva."
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "A mentes nem sikerult.";
      setErrorMessage(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [coachProfileId, formData, request]);

  const startEditing = useCallback(() => {
    setStatusMessage(null);
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setStatusMessage(null);
    if (hasTrainerProfile) {
      void loadTrainerProfile();
    } else {
      setFormData(initialFormData);
      setCoachProfileId(null);
      setIsEditing(false);
    }
  }, [hasTrainerProfile, loadTrainerProfile]);

  const canSave = useMemo(() => {
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
  }, [formData]);

  return {
    formData,
    loading,
    saving,
    statusMessage,
    errorMessage,
    hasTrainerProfile,
    isEditing,
    setField,
    setAvailabilityField,
    saveTrainerProfile,
    startEditing,
    cancelEditing,
    canSave,
  };
};
