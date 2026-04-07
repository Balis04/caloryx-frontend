import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
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
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 pb-6 pt-2">
      <div className="w-full max-w-5xl space-y-2">
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader className="border-b py-3">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <UserPlus className="h-5 w-5" />
                  Complete registration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step {step} of {REGISTER_STEP_COUNT}: {activeStep.title}
                </p>
              </div>

              <Badge variant="secondary" className="w-fit capitalize">
                {roleLabel}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 py-4">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">
              <div className="space-y-6">
                {error ? (
                  <Card className="border-red-300 bg-red-50 shadow-none">
                    <CardContent className="p-4 text-sm text-red-700">
                      {error}
                    </CardContent>
                  </Card>
                ) : null}

                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{activeStep.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {activeStep.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RegisterStepContent
                      step={step}
                      values={values}
                      setField={setField}
                    />
                  </CardContent>
                </Card>

                <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                  {step > 1 ? (
                    <Button variant="outline" onClick={onBack} disabled={loading}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  ) : null}

                  {step < REGISTER_STEP_COUNT ? (
                    <Button onClick={onNext} disabled={!canGoNext || loading}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={onFinish} disabled={!canGoNext || loading}>
                      {loading ? "Saving..." : "Finish registration"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <RegisterProgressPanel step={step} />
                <RegisterSummaryPanel values={values} roleLabel={roleLabel} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
