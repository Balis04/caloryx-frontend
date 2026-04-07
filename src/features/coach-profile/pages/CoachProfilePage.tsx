import { useNavigate } from "react-router-dom";
import CoachProfileWorkspace from "../components/CoachProfileWorkspace";
import { useCoachProfileForm } from "../hooks/useCoachProfileForm";

export default function CoachProfilePage() {
  const navigate = useNavigate();
  const { formData, loading, errorMessage, isForbidden, hasCoachProfile, statusMessage } =
    useCoachProfileForm();

  return (
    <CoachProfileWorkspace
      formData={formData}
      loading={loading}
      errorMessage={errorMessage}
      statusMessage={statusMessage}
      isForbidden={isForbidden}
      hasCoachProfile={hasCoachProfile}
      onBackToProfile={() => navigate("/profile")}
      onOpenEditor={() => navigate("/coach-profile/edit")}
    />
  );
}
