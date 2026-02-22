import { useMemo, useState } from "react";
import type { RegisterFormData } from "../types/register.types";

const initial: RegisterFormData = {
  fullName: "",
  birthDate: "",
  gender: null,
  userRole: null,

  heightCm: "",
  startWeightKg: "",
  activityLevel: null,

  goal: null,
  targetWeightKg: "",
  weeklyGoalKg: "",
};

export function useRegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(initial);

  const setField = <K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const canGoNext = useMemo(() => {
    if (step === 1)
      return (
        !!formData.fullName &&
        !!formData.birthDate &&
        !!formData.gender &&
        !!formData.userRole
      );
    if (step === 2)
      return (
        !!formData.heightCm &&
        !!formData.startWeightKg &&
        !!formData.activityLevel
      );
    if (step === 3)
      return (
        !!formData.goal && !!formData.targetWeightKg && !!formData.weeklyGoalKg
      );
    return false;
  }, [step, formData]);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return { step, formData, setField, canGoNext, next, back };
}
