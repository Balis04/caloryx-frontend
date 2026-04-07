import { RegisterBasicSection } from "./RegisterBasicSection";
import { RegisterBodySection } from "./RegisterBodySection";
import { RegisterGoalSection } from "./RegisterGoalSection";
import type { RegisterStepContentProps } from "../types/register-workspace.types";

export function RegisterStepContent({
  step,
  values,
  setField,
}: RegisterStepContentProps) {
  if (step === 1) {
    return <RegisterBasicSection values={values} setField={setField} />;
  }

  if (step === 2) {
    return <RegisterBodySection values={values} setField={setField} />;
  }

  return <RegisterGoalSection values={values} setField={setField} />;
}
