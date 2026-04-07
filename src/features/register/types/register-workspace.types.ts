import type { RegisterFormData, SetFieldFn } from "./register.types";

export interface RegisterStepContentProps {
  step: number;
  values: RegisterFormData;
  setField: SetFieldFn;
}

export interface RegisterWorkspaceProps {
  step: number;
  values: RegisterFormData;
  setField: SetFieldFn;
  canGoNext: boolean;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}
