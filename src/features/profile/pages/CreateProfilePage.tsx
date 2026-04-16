import ProfileEditorWorkspace from "../components/ProfileEditorWorkspace";
import { useCreateProfileForm } from "../hooks/useCreateProfileForm";

export default function CreateProfilePage() {
  const { values, setField, canSave, error, saveProfile } = useCreateProfileForm();

  const handleSave = async () => {
    await saveProfile();
  };

  return (
    <ProfileEditorWorkspace
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
