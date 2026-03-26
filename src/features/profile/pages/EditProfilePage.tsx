import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import { useProfileEditForm } from "../hooks/useProfileEditForm";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { loading, setField, values, loadProfile, saveProfile, canSave } =
    useProfileEditForm();

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    if (await saveProfile()) navigate("/profile");
  };

  if (loading) {
    return <div className="flex justify-center p-10 italic">Loading...</div>;
  }

  return (
    <ProfileForm
      values={values}
      setField={setField}
      onSave={handleSave}
      canSave={canSave}
    />
  );
}
