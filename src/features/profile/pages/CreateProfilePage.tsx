import ProfileEditorForm from "../components/ProfileEditorForm";
import { useCreateProfileForm } from "../hooks/useCreateProfileForm";

export default function CreateProfilePage() {
  const { values, setField, canSave, error, saveProfile } = useCreateProfileForm();

  const handleSave = async () => {
    await saveProfile();
  };

  return (
    <ProfileEditorForm
      values={values}
      setField={setField}
      onSave={handleSave}
      canSave={canSave}
      error={error}
      backPath="/"
      backLabel="Back"
      saveLabel="Create profile"
      disabledSaveLabel="Complete required fields"
      showActualWeight={false}
    />
  );
}
