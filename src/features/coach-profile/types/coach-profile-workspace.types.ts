import type { CoachProfileFormData } from "./coach-profile.types";

export interface CoachProfileWorkspaceProps {
  formData: CoachProfileFormData;
  loading: boolean;
  errorMessage: string | null;
  statusMessage: string | null;
  isForbidden: boolean;
  hasCoachProfile: boolean;
  onBackToProfile: () => void;
  onOpenEditor: () => void;
}
