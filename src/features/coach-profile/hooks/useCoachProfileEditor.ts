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
import type { CoachProfileQueryState } from "../lib/coach-profile.query";

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
  const [profileState, setProfileState] = useState<CoachProfileQueryState>(
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

  const applyProfileState = useCallback((nextState: CoachProfileQueryState) => {
    setProfileState(nextState);
  }, []);

  const setFormData = useCallback(
    (updater: CoachProfileFormData | ((current: CoachProfileFormData) => CoachProfileFormData)) => {
      setProfileState((current) => ({
        ...current,
        formData: typeof updater === "function" ? updater(current.formData) : updater,
      }));
    },
    []
  );

  const loadCoachProfile = useCallback(async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      applyProfileState(resolveCoachProfileQueryState(await getMyCoachProfile()));
    } catch (error) {
      applyProfileState(mapCoachProfileQueryError(error));
    } finally {
      setLoading(false);
    }
  }, [applyProfileState, getMyCoachProfile]);

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
      setFormData((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const setAvailabilityField = useCallback(
    (day: string, key: keyof AvailabilitySlot, value: string | boolean) => {
      setFormData((current) => ({
        ...current,
        availability: current.availability.map((slot) =>
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
    setProfileState((current) => ({ ...current, errorMessage: null }));

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
        applyProfileState(resolveCoachProfileQueryState(response));
      }

      setProfileState((current) => ({
        ...current,
        hasCoachProfile: true,
      }));
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
  }, [
    applyProfileState,
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
