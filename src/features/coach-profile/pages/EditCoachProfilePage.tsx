import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachProfileEditorWorkspace from "../components/edit/CoachProfileEditorWorkspace";
import { useCoachProfileForm } from "../hooks/useCoachProfileForm";
import type { PendingCoachCertificateUpload } from "../types/coach-profile.types";

export default function EditCoachProfilePage() {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    saving,
    deletingCertificateId,
    statusMessage,
    errorMessage,
    isForbidden,
    hasCoachProfile,
    setField,
    setAvailabilityField,
    saveCoachProfile,
    deleteCertificate,
    canSave,
  } = useCoachProfileForm();
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCoachCertificateUpload[]
  >([]);

  const handlePdfSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file) => {
      const isPdfType = file.type === "application/pdf" || !file.type;
      const hasPdfExtension = /\.pdf$/i.test(file.name);
      return isPdfType && hasPdfExtension;
    });

    if (files.length > 0 && pdfFiles.length !== files.length) {
      window.alert("Only PDF files can be uploaded as certificates.");
    }

    const nextCertificates = pdfFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
      certificateName: file.name.replace(/\.pdf$/i, ""),
      issuer: "",
      issuedAt: "",
    }));

    setPendingCertificates(nextCertificates);
    event.target.value = "";
  };

  const updatePendingCertificate = (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => {
    setPendingCertificates((prev) =>
      prev.map((certificate) =>
        certificate.id === id ? { ...certificate, [key]: value } : certificate
      )
    );
  };

  return (
    <CoachProfileEditorWorkspace
      formData={formData}
      loading={loading}
      saving={saving}
      canSave={canSave}
      deletingCertificateId={deletingCertificateId}
      statusMessage={statusMessage}
      errorMessage={errorMessage}
      isForbidden={isForbidden}
      hasCoachProfile={hasCoachProfile}
      pendingCertificates={pendingCertificates}
      setField={setField}
      setAvailabilityField={setAvailabilityField}
      onFileChange={handlePdfSelection}
      onPendingCertificateChange={updatePendingCertificate}
      onPendingCertificatesReset={() => setPendingCertificates([])}
      onCancel={() => navigate(hasCoachProfile ? "/coach-profile" : "/profile")}
      onDeleteCertificate={deleteCertificate}
      onSave={async () => {
        const saved = await saveCoachProfile(pendingCertificates);
        if (saved) {
          navigate("/coach-profile");
        }

        return saved;
      }}
    />
  );
}
