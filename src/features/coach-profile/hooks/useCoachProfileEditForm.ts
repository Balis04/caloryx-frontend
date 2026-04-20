import { useEffect, useState } from "react";
import {
  createCoachProfile,
  getMyCoachProfile,
  updateCoachProfile,
} from "../api/coach-profile.api";
import { canSaveCoachProfileForm } from "../lib/coach-profile.validation";
import { mapCoachProfileFormDataToRequest } from "../lib/coach-profile.mapper";
import {
  createEmptyCoachProfileState,
  mapCoachProfileErrorToState,
  mapCoachProfileResponseToState,
  type CoachProfileLoadState,
} from "../lib/coach-profile.state";
import { usePendingCertificatesForm } from "./usePendingCertificatesForm";
import type { AvailabilitySlot, CoachProfileFormData } from "../types";

export const useCoachProfileEditForm = () => {
  const [profileState, setProfileState] = useState<CoachProfileLoadState>(
    createEmptyCoachProfileState()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    coachProfileId,
    errorMessage,
    formData,
    hasCoachProfile,
    isForbidden,
  } = profileState;

  useEffect(() => {
    const loadCoachProfile = async () => {
      setLoading(true);

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
    updater:
      | CoachProfileFormData
      | ((current: CoachProfileFormData) => CoachProfileFormData)
  ) => {
    setProfileState((current) => ({
      ...current,
      formData:
        typeof updater === "function" ? updater(current.formData) : updater,
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

  const pendingCertificatesForm = usePendingCertificatesForm({
    coachProfileId,
    onCertificatesDeleted: (certificateId) => {
      setFormData((current) => ({
        ...current,
        certificates: current.certificates.filter(
          (certificate) => certificate.id !== certificateId
        ),
      }));
    },
  });

  const saveCoachProfile = async () => {
    setSaving(true);
    setProfileState((current) => ({ ...current, errorMessage: null }));

    try {
      const payload = mapCoachProfileFormDataToRequest(formData);
      const response = coachProfileId
        ? await updateCoachProfile(coachProfileId, payload)
        : await createCoachProfile(payload);

      await pendingCertificatesForm.uploadPendingCertificates(response.id);

      if (pendingCertificatesForm.pendingCertificates.length > 0) {
        const refreshedProfile = await getMyCoachProfile();
        setProfileState(mapCoachProfileResponseToState(refreshedProfile));
        pendingCertificatesForm.resetPendingCertificates();
      } else {
        setProfileState(mapCoachProfileResponseToState(response));
      }
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
    setProfileState((current) => ({ ...current, errorMessage: null }));

    const result = await pendingCertificatesForm.deleteCertificate(
      certificateId
    );

    if (result.ok) {
      return true;
    }

    setProfileState((current) => ({
      ...current,
      errorMessage: result.errorMessage ?? "Certificate deletion failed.",
    }));
    return false;
  };

  return {
    canSave: canSaveCoachProfileForm(formData),
    pendingCertificatesValid: pendingCertificatesForm.pendingCertificatesValid,
    deleteCertificate: deleteCertificateById,
    deletingCertificateId: pendingCertificatesForm.deletingCertificateId,
    errorMessage,
    formData,
    hasCoachProfile,
    isForbidden,
    loading,
    onCertificateFilesSelected:
      pendingCertificatesForm.onCertificateFilesSelected,
    pendingCertificates: pendingCertificatesForm.pendingCertificates,
    resetPendingCertificates: pendingCertificatesForm.resetPendingCertificates,
    saveCoachProfile,
    saving,
    setAvailabilityField,
    setField,
    updatePendingCertificate: pendingCertificatesForm.updatePendingCertificate,
  };
};
