import { useCallback, useMemo, useState } from "react";
import { initialRegisterFormValues } from "../model/register.form";
import { REGISTER_STEP_COUNT } from "../lib/register.steps";
import type { RegisterFormData } from "../types/register.types";
import { canAdvanceRegisterStep } from "../lib/register.validation";

export function useRegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(
    initialRegisterFormValues
  );

  const setField = useCallback(
    <K extends keyof RegisterFormData>(
      key: K,
      value: RegisterFormData[K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const canGoNext = useMemo(
    () => canAdvanceRegisterStep(step, formData),
    [formData, step]
  );

  const next = useCallback(
    () => setStep((current) => Math.min(REGISTER_STEP_COUNT, current + 1)),
    []
  );
  const back = useCallback(() => setStep((current) => Math.max(1, current - 1)), []);

  return { step, formData, setField, canGoNext, next, back };
}
