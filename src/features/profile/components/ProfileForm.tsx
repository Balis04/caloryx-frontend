import ProfileEditorWorkspace from "./ProfileEditorWorkspace";
import type { ProfileFormProps } from "./profile-editor.types";

export default function ProfileForm(props: ProfileFormProps) {
  return <ProfileEditorWorkspace {...props} />;
}
