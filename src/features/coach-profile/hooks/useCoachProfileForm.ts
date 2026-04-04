import { ApiError } from "@/lib/api-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createCoachCertificateUploadFormData } from "../lib/coach-profile.upload";
import { canSaveCoachProfileForm } from "../lib/coach-profile.validation";
import {
  mapCoachProfileFormDataToRequest,
  mapCoachProfileResponseToFormData,
} from "../lib/coach-profile.mapper";
import { initialCoachProfileFormData } from "../model/coach-profile.form";
import type {
  AvailabilitySlot,
  CoachProfileFormData,
  PendingCoachCertificateUpload,
} from "../types/coach-profile.types";
import { useCoachProfileService } from "./useCoachProfileService";

export const useCoachProfileForm = () => {
  const {
    createCoachProfile,
    deleteCoachCertificate,
    getMyCoachProfile,
    updateCoachProfile,
    uploadCoachCertificate,
  } = useCoachProfileService();
  const [formData, setFormData] = useState<CoachProfileFormData>(initialCoachProfileFormData);
  const [coachProfileId, setCoachProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingCertificateId, setDeletingCertificateId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);
  const [hasCoachProfile, setHasCoachProfile] = useState(false);

  const loadCoachProfile = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);
    setIsForbidden(false);

    try {
      const response = await getMyCoachProfile();
      setFormData(mapCoachProfileResponseToFormData(response));
      setCoachProfileId(response.id);
      setHasCoachProfile(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setFormData(initialCoachProfileFormData);
        setCoachProfileId(null);
        setHasCoachProfile(false);
      } else if (error instanceof ApiError && error.status === 403) {
        setFormData(initialCoachProfileFormData);
        setCoachProfileId(null);
        setHasCoachProfile(false);
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
  }, [getMyCoachProfile]);

  const uploadCertificates = useCallback(
    async (profileId: string, certificates: PendingCoachCertificateUpload[]) => {
      for (const certificate of certificates) {
        await uploadCoachCertificate(
          profileId,
          createCoachCertificateUploadFormData(certificate)
        );
      }
    },
    [uploadCoachCertificate]
  );

  useEffect(() => {
    void loadCoachProfile();
  }, [loadCoachProfile]);

  const setField = useCallback(
    <K extends keyof CoachProfileFormData>(key: K, value: CoachProfileFormData[K]) => {
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

  const saveCoachProfile = useCallback(
    async (certificateFiles: PendingCoachCertificateUpload[] = []) => {
      setSaving(true);
      setErrorMessage(null);

      try {
        const payload = mapCoachProfileFormDataToRequest(formData);
        const response = coachProfileId
          ? await updateCoachProfile(coachProfileId, payload)
          : await createCoachProfile(payload);

        if (certificateFiles.length > 0) {
          await uploadCertificates(response.id, certificateFiles);
          await loadCoachProfile();
        } else {
          setFormData(mapCoachProfileResponseToFormData(response));
          setCoachProfileId(response.id);
        }

        setHasCoachProfile(true);
        setStatusMessage(
          coachProfileId
            ? "Coach profile updated successfully."
            : "Coach profile created successfully."
        );
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Saving failed.";
        setErrorMessage(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [
      coachProfileId,
      createCoachProfile,
      formData,
      loadCoachProfile,
      updateCoachProfile,
      uploadCertificates,
    ]
  );

  const removeCertificate = useCallback(
    async (certificateId: string) => {
      if (!coachProfileId) {
        setErrorMessage("Coach profile not found.");
        return false;
      }

      setDeletingCertificateId(certificateId);
      setErrorMessage(null);
      setStatusMessage(null);

      try {
        await deleteCoachCertificate(coachProfileId, certificateId);

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
    [coachProfileId, deleteCoachCertificate]
  );

  const canSave = useMemo(() => canSaveCoachProfileForm(formData), [formData]);

  return {
    canSave,
    coachProfileId,
    deleteCertificate: removeCertificate,
    deletingCertificateId,
    errorMessage,
    formData,
    hasCoachProfile,
    isForbidden,
    loading,
    saveCoachProfile,
    saving,
    setAvailabilityField,
    setField,
    statusMessage,
  };
};
