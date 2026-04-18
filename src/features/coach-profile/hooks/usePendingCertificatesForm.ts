import type { ChangeEvent } from "react";
import { useState } from "react";

import {
  deleteCoachCertificate,
  uploadCoachCertificate,
} from "../api/coach-profile.api";
import { createCoachCertificateUploadFormData } from "../lib/coach-profile.upload";
import { arePendingCertificatesValid } from "../lib/coach-profile.validation";
import type {
  CoachCertificate,
  PendingCoachCertificateUpload,
} from "../types";

const mapPendingCertificateFiles = (files: File[]) =>
  files.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    file,
    certificateName: "",
    issuer: "",
    issuedAt: "",
  }));

interface UsePendingCertificatesFormOptions {
  coachProfileId: string | null;
  onCertificatesDeleted: (certificateId: string) => void;
}

export const usePendingCertificatesForm = ({
  coachProfileId,
  onCertificatesDeleted,
}: UsePendingCertificatesFormOptions) => {
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCoachCertificateUpload[]
  >([]);
  const [deletingCertificateId, setDeletingCertificateId] = useState<
    string | null
  >(null);

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

  const resetPendingCertificates = () => setPendingCertificates([]);

  const uploadPendingCertificates = async (profileId: string) => {
    for (const certificate of pendingCertificates) {
      await uploadCoachCertificate(
        profileId,
        createCoachCertificateUploadFormData(certificate)
      );
    }
  };

  const deleteCertificate = async (
    certificateId: string
  ): Promise<{ ok: boolean; errorMessage?: string }> => {
    if (!coachProfileId) {
      return {
        ok: false,
        errorMessage: "Coach profile not found.",
      };
    }

    setDeletingCertificateId(certificateId);

    try {
      await deleteCoachCertificate(coachProfileId, certificateId);
      onCertificatesDeleted(certificateId);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Certificate deletion failed.",
      };
    } finally {
      setDeletingCertificateId(null);
    }
  };

  const getDownloadableCertificates = (certificates: CoachCertificate[]) =>
    certificates.filter((certificate) => certificate.fileUrl);

  return {
    deleteCertificate,
    deletingCertificateId,
    getDownloadableCertificates,
    onCertificateFilesSelected,
    pendingCertificates,
    pendingCertificatesValid: arePendingCertificatesValid(pendingCertificates),
    resetPendingCertificates,
    updatePendingCertificate,
    uploadPendingCertificates,
  };
};
