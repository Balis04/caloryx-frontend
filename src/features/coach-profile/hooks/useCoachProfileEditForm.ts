import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import {
  createCoachProfile,
  deleteCoachCertificate,
  getMyCoachProfile,
  updateCoachProfile,
  uploadCoachCertificate,
} from "../api/coach-profile.api";
import { createCoachCertificateUploadFormData } from "../lib/coach-profile.upload";
import {
  arePendingCertificatesValid,
  canSaveCoachProfileForm,
} from "../lib/coach-profile.validation";
import {
  mapCoachProfileFormDataToRequest,
  mapCoachProfileResponseToFormData,
} from "../lib/coach-profile.mapper";
import { initialCoachProfileFormData } from "../model/coach-profile.form";
import type {
  AvailabilitySlot,
  CoachProfileFormData,
  CoachProfileResponse,
  PendingCoachCertificateUpload,
} from "../model/coach-profile.types";

interface CoachProfileEditState {
  coachProfileId: string | null;
  errorMessage: string | null;
  formData: CoachProfileFormData;
  hasCoachProfile: boolean;
  isForbidden: boolean;
}

const createEmptyCoachProfileState = (
  overrides: Partial<CoachProfileEditState> = {}
): CoachProfileEditState => ({
  coachProfileId: null,
  errorMessage: null,
  formData: initialCoachProfileFormData,
  hasCoachProfile: false,
  isForbidden: false,
  ...overrides,
});

const mapCoachProfileResponseToState = (
  response: CoachProfileResponse
): CoachProfileEditState => ({
  coachProfileId: response.id,
  errorMessage: null,
  formData: mapCoachProfileResponseToFormData(response),
  hasCoachProfile: true,
  isForbidden: false,
});

const mapCoachProfileErrorToState = (error: unknown): CoachProfileEditState => {
  if (error instanceof ApiError && (error.status === 400 || error.status === 404)) {
    return createEmptyCoachProfileState();
  }

  if (error instanceof ApiError && error.status === 403) {
    return createEmptyCoachProfileState({
      errorMessage: error.message,
      isForbidden: true,
    });
  }

  return createEmptyCoachProfileState({
    errorMessage:
      error instanceof Error ? error.message : "Failed to load coach profile.",
  });
};

const mapPendingCertificateFiles = (files: File[]) =>
  files.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    file,
    certificateName: "",
    issuer: "",
    issuedAt: "",
  }));

export const useCoachProfileEditForm = () => {
  const [profileState, setProfileState] = useState<CoachProfileEditState>(
    createEmptyCoachProfileState()
  );
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCoachCertificateUpload[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingCertificateId, setDeletingCertificateId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { coachProfileId, errorMessage, formData, hasCoachProfile, isForbidden } = profileState;

  useEffect(() => {
    const loadCoachProfile = async () => {
      setLoading(true);
      setStatusMessage(null);

      try {
        const response = await getMyCoachProfile();
        setProfileState(mapCoachProfileResponseToState(response));
      } catch (error) {
        setProfileState(mapCoachProfileErrorToState(error));
      } finally {
        setLoading(false);
      }
    };

    void loadCoachProfile();
  }, []);

  const setFormData = (
    updater: CoachProfileFormData | ((current: CoachProfileFormData) => CoachProfileFormData)
  ) => {
    setProfileState((current) => ({
      ...current,
      formData: typeof updater === "function" ? updater(current.formData) : updater,
    }));
  };

  const setField = <K extends keyof CoachProfileFormData>(
    key: K,
    value: CoachProfileFormData[K]
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const setAvailabilityField = (
    day: string,
    key: keyof AvailabilitySlot,
    value: string | boolean
  ) => {
    setFormData((current) => ({
      ...current,
      availability: current.availability.map((slot) =>
        slot.dayOfWeek === day ? { ...slot, [key]: value } : slot
      ),
    }));
  };

  const onCertificateFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file) => {
      const isPdfType = file.type === "application/pdf" || !file.type;
      const hasPdfExtension = /\.pdf$/i.test(file.name);
      return isPdfType && hasPdfExtension;
    });

    if (files.length > 0 && pdfFiles.length !== files.length) {
      window.alert("Only PDF files can be uploaded as certificates.");
    }

    setPendingCertificates(mapPendingCertificateFiles(pdfFiles));
    event.target.value = "";
  };

  const updatePendingCertificate = (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => {
    setPendingCertificates((currentCertificates) =>
      currentCertificates.map((certificate) =>
        certificate.id === id ? { ...certificate, [key]: value } : certificate
      )
    );
  };

  const saveCoachProfile = async () => {
    setSaving(true);
    setProfileState((current) => ({ ...current, errorMessage: null }));

    try {
      const payload = mapCoachProfileFormDataToRequest(formData);
      const response = coachProfileId
        ? await updateCoachProfile(coachProfileId, payload)
        : await createCoachProfile(payload);

      for (const certificate of pendingCertificates) {
        await uploadCoachCertificate(
          response.id,
          createCoachCertificateUploadFormData(certificate)
        );
      }

      if (pendingCertificates.length > 0) {
        const refreshedProfile = await getMyCoachProfile();
        setProfileState(mapCoachProfileResponseToState(refreshedProfile));
        setPendingCertificates([]);
      } else {
        setProfileState(mapCoachProfileResponseToState(response));
      }
      setStatusMessage(
        coachProfileId
          ? "Coach profile updated successfully."
          : "Coach profile created successfully."
      );
      return true;
    } catch (error) {
      setProfileState((current) => ({
        ...current,
        errorMessage: error instanceof Error ? error.message : "Saving failed.",
      }));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteCertificateById = async (certificateId: string) => {
    if (!coachProfileId) {
      setProfileState((current) => ({
        ...current,
        errorMessage: "Coach profile not found.",
      }));
      return false;
    }

    setDeletingCertificateId(certificateId);
    setStatusMessage(null);
    setProfileState((current) => ({ ...current, errorMessage: null }));

    try {
      await deleteCoachCertificate(coachProfileId, certificateId);
      setFormData((current) => ({
        ...current,
        certificates: current.certificates.filter(
          (certificate) => certificate.id !== certificateId
        ),
      }));
      setStatusMessage("Certificate deleted successfully.");
      return true;
    } catch (error) {
      setProfileState((current) => ({
        ...current,
        errorMessage:
          error instanceof Error ? error.message : "Certificate deletion failed.",
      }));
      return false;
    } finally {
      setDeletingCertificateId(null);
    }
  };

  return {
    canSave: canSaveCoachProfileForm(formData),
    pendingCertificatesValid: arePendingCertificatesValid(pendingCertificates),
    deleteCertificate: deleteCertificateById,
    deletingCertificateId,
    errorMessage,
    formData,
    hasCoachProfile,
    isForbidden,
    loading,
    onCertificateFilesSelected,
    pendingCertificates,
    resetPendingCertificates: () => setPendingCertificates([]),
    saveCoachProfile,
    saving,
    setAvailabilityField,
    setField,
    statusMessage,
    updatePendingCertificate,
  };
};
