import {
  CaloriexPage,
  HeroBadge,
  PageHero,
  SummaryPanel,
} from "@/components/caloriex";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { CardContent } from "@/components/ui/card";
import { ClipboardPenLine } from "lucide-react";
import RegisterActionPanel from "./RegisterActionPanel";
import RegisterHeroAside from "./RegisterHeroAside";
import { RegisterProgressPanel } from "./RegisterProgressPanel";
import { RegisterStepContent } from "./RegisterStepContent";
import { RegisterSummaryPanel } from "./RegisterSummaryPanel";
import { REGISTER_STEP_COUNT, REGISTER_STEP_META } from "../lib/register.steps";
import type { RegisterWorkspaceProps } from "../types/register-workspace.types";

export default function RegisterWorkspace({
  step,
  values,
  setField,
  canGoNext,
  loading,
  error,
  onBack,
  onNext,
  onFinish,
}: RegisterWorkspaceProps) {
  const activeStep = REGISTER_STEP_META[step - 1];
  const roleLabel =
    USER_ROLE_OPTIONS.find((option) => option.value === values.userRole)?.label ??
    "New user";

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Complete registration</HeroBadge>}
        title="Set up your CalorieX workspace with the same profile editing flow."
        description="Move through identity, body metrics, and goals in a structured onboarding workspace that mirrors the profile editor."
        chips={[
          `Step ${step} of ${REGISTER_STEP_COUNT}`,
          activeStep.title,
          canGoNext ? "Ready for the next move" : "Needs a few more fields",
        ]}
        aside={
          <RegisterHeroAside
            step={step}
            canGoNext={canGoNext}
            loading={loading}
            roleLabel={roleLabel}
          />
        }
      />

      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="space-y-6">
            <SummaryPanel
              eyebrow={`Step ${step} of ${REGISTER_STEP_COUNT}`}
              title={activeStep.title}
              icon={ClipboardPenLine}
            >
              <CardContent className="space-y-6 p-6">
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  {activeStep.description}
                </p>
                <div className="cx-glass-block rounded-[28px] p-5 md:p-6">
                  <RegisterStepContent step={step} values={values} setField={setField} />
                </div>
              </CardContent>
            </SummaryPanel>
          </div>

          <div className="space-y-6">
            <RegisterActionPanel
              step={step}
              values={values}
              canGoNext={canGoNext}
              loading={loading}
              error={error}
              onBack={onBack}
              onNext={onNext}
              onFinish={onFinish}
              roleLabel={roleLabel}
            />
            <RegisterProgressPanel step={step} />
            <RegisterSummaryPanel values={values} roleLabel={roleLabel} />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
