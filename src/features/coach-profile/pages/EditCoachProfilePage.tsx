import { useNavigate } from "react-router-dom";
import CoachProfileEditorWorkspace from "../components/edit/CoachProfileEditorWorkspace";
import { useCoachProfileEditor } from "../hooks/useCoachProfileEditor";

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
    pendingCertificates,
    resetPendingCertificates,
    updatePendingCertificate,
    onCertificateFilesSelected,
    canSave,
  } = useCoachProfileEditor();

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
      onFileChange={onCertificateFilesSelected}
      onPendingCertificateChange={updatePendingCertificate}
      onPendingCertificatesReset={resetPendingCertificates}
      onBackToProfile={() => navigate("/profile")}
      onCancel={() => navigate(hasCoachProfile ? "/coach-profile" : "/profile")}
      onDeleteCertificate={deleteCertificate}
      onSave={async () => {
        const saved = await saveCoachProfile();
        if (saved) {
          navigate("/coach-profile");
        }

        return saved;
      }}
    />
  );
}
