import type { ProfileFormValues } from "../model/profile.form";

export interface ProfileFormProps {
  values: ProfileFormValues;
  setField: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => void;
  onSave: () => Promise<void>;
  canSave: boolean;
}

export interface ProfileEditorHeroAsideProps {
  roleLabel: string;
  canSave: boolean;
}

export interface ProfileEditorSavePanelProps {
  values: ProfileFormValues;
  roleLabel: string;
  canSave: boolean;
  onSave: () => Promise<void>;
}

export interface ProfileEditorSnapshotPanelProps {
  values: ProfileFormValues;
}
