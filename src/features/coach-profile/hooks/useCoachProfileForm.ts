import { useApi } from "@/hooks/useApi";
import { ApiError } from "@/lib/api-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AvailabilitySlot,
  PendingCoachCertificateUpload,
  CoachCertificate,
  CoachProfileFormData,
} from "../types/coach-profile.types";

const createInitialAvailability = (): AvailabilitySlot[] => [
  {
    dayOfWeek: "MONDAY",
    label: "Monday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "TUESDAY",
    label: "Tuesday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "WEDNESDAY",
    label: "Wednesday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "THURSDAY",
    label: "Thursday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "FRIDAY",
    label: "Friday",
    enabled: true,
    from: "08:00",
    until: "14:00",
  },
  {
    dayOfWeek: "SATURDAY",
    label: "Saturday",
    enabled: false,
    from: "09:00",
    until: "12:00",
  },
  {
    dayOfWeek: "SUNDAY",
    label: "Sunday",
    enabled: false,
    from: "09:00",
    until: "12:00",
  },
];

const initialFormData: CoachProfileFormData = {
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
  trainingFormat: CoachProfileFormData["sessionFormat"];
  priceFrom: number | null;
  priceTo: number | null;
  currency: CoachProfileFormData["currency"];
  maxCapacity: number | null;
  contactNote: string | null;
  availabilities?: Array<{
    dayOfWeek?: string;
    available?: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
  certificates?: Array<
    | string
    | {
        id?: string;
        certificateName?: string | null;
        issuer?: string | null;
        issuedAt?: string | null;
        fileName?: string | null;
        fileUrl?: string | null;
      }
  >;
}

type CoachProfileCertificate =
  | string
  | {
      id?: string;
      certificateName?: string | null;
      issuer?: string | null;
      issuedAt?: string | null;
      fileName?: string | null;
      fileUrl?: string | null;
    };

interface CoachCertificateResponse {
  id: string;
  certificateName?: string | null;
  issuer?: string | null;
  issuedAt?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
}

const normalizeCertificate = (
  certificate: CoachProfileCertificate,
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

const normalizeCoachProfileResponse = (
  data: CoachProfileResponse
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
    ? data.certificates.map(normalizeCertificate)
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
    : createInitialAvailability()
});

export const useCoachProfileForm = () => {
  const { request } = useApi();
  const [formData, setFormData] = useState<CoachProfileFormData>(initialFormData);
  const [coachProfileId, setCoachProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingCertificateId, setDeletingCertificateId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);
  const [hasCoachProfile, setHasCoachProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadCoachProfile = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);
    setIsForbidden(false);

    try {
      const response = await request<CoachProfileResponse>(
        "/api/coach-profiles/me",
        {
          suppressErrorLog: true,
        }
      );
      setFormData(normalizeCoachProfileResponse(response));
      setCoachProfileId(response.id);
      setHasCoachProfile(true);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setFormData(initialFormData);
        setCoachProfileId(null);
        setHasCoachProfile(false);
        setIsEditing(false);
      } else if (error instanceof ApiError && error.status === 403) {
        setFormData(initialFormData);
        setCoachProfileId(null);
        setHasCoachProfile(false);
        setIsEditing(false);
        setIsForbidden(true);
        setErrorMessage(error.message);
      } else {
        const message =
          error instanceof Error ? error.message : "Failed to load coach profile.";
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  }, [request]);

  const uploadCertificates = useCallback(
    async (profileId: string, certificates: PendingCoachCertificateUpload[]) => {
      for (const certificate of certificates) {
        const formData = new FormData();
        formData.append("file", certificate.file);
        formData.append("certificateName", certificate.certificateName.trim());

        if (certificate.issuer.trim()) {
          formData.append("issuer", certificate.issuer.trim());
        }

        if (certificate.issuedAt.trim()) {
          formData.append(
            "issuedAt",
            new Date(`${certificate.issuedAt}T00:00:00.000Z`).toISOString()
          );
        }

        await request<CoachCertificateResponse>(
          `/api/coach-profiles/${profileId}/certificates`,
          {
            method: "POST",
            body: formData,
          }
        );
      }
    },
    [request]
  );

  useEffect(() => {
    void loadCoachProfile();
  }, [loadCoachProfile]);

  const setField = useCallback(
    <K extends keyof CoachProfileFormData>(
      key: K,
      value: CoachProfileFormData[K]
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

  const saveCoachProfile = useCallback(async (certificateFiles: PendingCoachCertificateUpload[] = []) => {
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

      if (certificateFiles.length > 0) {
        await uploadCertificates(response.id, certificateFiles);
        await loadCoachProfile();
      } else {
        setFormData(normalizeCoachProfileResponse(response));
        setCoachProfileId(response.id);
      }

      setHasCoachProfile(true);
      setIsEditing(false);
      setStatusMessage(
        coachProfileId
          ? "Coach profile updated successfully."
          : "Coach profile created successfully."
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Saving failed.";
      setErrorMessage(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [coachProfileId, formData, loadCoachProfile, request, uploadCertificates]);

  const deleteCertificate = useCallback(
    async (certificateId: string) => {
      if (!coachProfileId) {
        setErrorMessage("Coach profile not found.");
        return false;
      }

      setDeletingCertificateId(certificateId);
      setErrorMessage(null);
      setStatusMessage(null);

      try {
        await request<void>(`/api/coach-profiles/${coachProfileId}/certificates/${certificateId}`, {
          method: "DELETE",
        });

        setFormData((prev) => ({
          ...prev,
          certificates: prev.certificates.filter(
            (certificate) => certificate.id !== certificateId
          ),
        }));
        setStatusMessage("Certificate deleted successfully.");
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Certificate deletion failed.";
        setErrorMessage(message);
        return false;
      } finally {
        setDeletingCertificateId(null);
      }
    },
    [coachProfileId, request]
  );

  const startEditing = useCallback(() => {
    setStatusMessage(null);
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setStatusMessage(null);
    if (hasCoachProfile) {
      void loadCoachProfile();
    } else {
      setFormData(initialFormData);
      setCoachProfileId(null);
      setIsEditing(false);
    }
  }, [hasCoachProfile, loadCoachProfile]);

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
    deletingCertificateId,
    statusMessage,
    errorMessage,
    isForbidden,
    hasCoachProfile,
    isEditing,
    setField,
    setAvailabilityField,
    saveCoachProfile,
    deleteCertificate,
    startEditing,
    cancelEditing,
    canSave,
  };
};
