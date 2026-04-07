import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createCoachCertificateUploadFormData } from "../lib/coach-profile.upload";
import { canSaveCoachProfileForm } from "../lib/coach-profile.validation";
import { mapCoachProfileFormDataToRequest } from "../lib/coach-profile.mapper";
import {
  createEmptyCoachProfileState,
  mapCoachProfileQueryError,
  resolveCoachProfileQueryState,
} from "../lib/coach-profile.query";
import type {
  AvailabilitySlot,
  CoachProfileFormData,
  PendingCoachCertificateUpload,
} from "../types/coach-profile.types";
import { useCoachProfileApi } from "../api/coach-profile.api";

const mapPendingCertificateFiles = (files: File[]) =>
  files.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    file,
    certificateName: file.name.replace(/\.pdf$/i, ""),
    issuer: "",
    issuedAt: "",
  }));

export const useCoachProfileEditor = () => {
  const {
    createCoachProfile,
    deleteCoachCertificate,
    getMyCoachProfile,
    updateCoachProfile,
    uploadCoachCertificate,
  } = useCoachProfileApi();
  const [formData, setFormData] = useState<CoachProfileFormData>(
    createEmptyCoachProfileState().formData
  );
  const [coachProfileId, setCoachProfileId] = useState<string | null>(null);
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCoachCertificateUpload[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingCertificateId, setDeletingCertificateId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);
  const [hasCoachProfile, setHasCoachProfile] = useState(false);

  const loadCoachProfile = useCallback(async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await getMyCoachProfile();
      const nextState = resolveCoachProfileQueryState(response);
      setFormData(nextState.formData);
      setCoachProfileId(nextState.coachProfileId);
      setHasCoachProfile(nextState.hasCoachProfile);
      setIsForbidden(nextState.isForbidden);
      setErrorMessage(nextState.errorMessage);
    } catch (error) {
      const nextState = mapCoachProfileQueryError(error);
      setFormData(nextState.formData);
      setCoachProfileId(nextState.coachProfileId);
      setHasCoachProfile(nextState.hasCoachProfile);
      setIsForbidden(nextState.isForbidden);
      setErrorMessage(nextState.errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getMyCoachProfile]);

  useEffect(() => {
    void loadCoachProfile();
  }, [loadCoachProfile]);

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

  const handlePdfSelection = useCallback((event: ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const updatePendingCertificate = useCallback(
    (
      id: string,
      key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
      value: string
    ) => {
      setPendingCertificates((prev) =>
        prev.map((certificate) =>
          certificate.id === id ? { ...certificate, [key]: value } : certificate
        )
      );
    },
    []
  );

  const saveCoachProfile = useCallback(async () => {
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = mapCoachProfileFormDataToRequest(formData);
      const response = coachProfileId
        ? await updateCoachProfile(coachProfileId, payload)
        : await createCoachProfile(payload);

      if (pendingCertificates.length > 0) {
        await uploadCertificates(response.id, pendingCertificates);
        setPendingCertificates([]);
        await loadCoachProfile();
      } else {
        const nextState = resolveCoachProfileQueryState(response);
        setFormData(nextState.formData);
        setCoachProfileId(nextState.coachProfileId);
      }

      setHasCoachProfile(true);
      setStatusMessage(
        coachProfileId
          ? "Coach profile updated successfully."
          : "Coach profile created successfully."
      );
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Saving failed.");
      return false;
    } finally {
      setSaving(false);
    }
  }, [
    coachProfileId,
    createCoachProfile,
    formData,
    loadCoachProfile,
    pendingCertificates,
    updateCoachProfile,
    uploadCertificates,
  ]);

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
        setErrorMessage(
          error instanceof Error ? error.message : "Certificate deletion failed."
        );
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
    deleteCertificate,
    deletingCertificateId,
    errorMessage,
    formData,
    hasCoachProfile,
    isForbidden,
    loading,
    pendingCertificates,
    resetPendingCertificates: () => setPendingCertificates([]),
    saveCoachProfile,
    saving,
    setAvailabilityField,
    setField,
    statusMessage,
    updatePendingCertificate,
    onCertificateFilesSelected: handlePdfSelection,
  };
};
