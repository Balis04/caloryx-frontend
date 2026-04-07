import { useNavigate } from "react-router-dom";
import CoachProfileWorkspace from "../components/CoachProfileWorkspace";
import { useCoachProfileQuery } from "../hooks/useCoachProfileQuery";

export default function CoachProfilePage() {
  const navigate = useNavigate();
  const { formData, loading, errorMessage, isForbidden, hasCoachProfile } =
    useCoachProfileQuery();

  return (
    <CoachProfileWorkspace
      formData={formData}
      loading={loading}
      errorMessage={errorMessage}
      statusMessage={null}
      isForbidden={isForbidden}
      hasCoachProfile={hasCoachProfile}
      onBackToProfile={() => navigate("/profile")}
      onOpenEditor={() => navigate("/coach-profile/edit")}
    />
  );
}
