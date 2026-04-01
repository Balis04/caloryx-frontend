import {
  AccentButton,
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
  ReadonlyField,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { ArrowLeft, ArrowRight, Save, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProfileFormValues } from "../model/profile.form";
import { BasicInfoSection } from "./BasicInfoSection";
import { PhysicalStatsSection } from "./PhysicalStatsSection";

interface Props {
  values: ProfileFormValues;
  setField: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => void;
  onSave: () => Promise<void>;
  canSave: boolean;
}

export default function ProfileForm({ values, setField, onSave, canSave }: Props) {
  const navigate = useNavigate();
  const roleLabel =
    USER_ROLE_OPTIONS.find((option) => option.value === values.userRole)?.label ?? "User";

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
        }
        badge={<HeroBadge>Edit profile</HeroBadge>}
        title="Refresh the personal data that powers your CalorieX experience."
        description="Update your identity details, body metrics, and goal settings in the same design system used across the app."
        chips={[roleLabel, canSave ? "Ready to save" : "Needs a few more fields"]}
        aside={
          <GlassCard className="overflow-hidden">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Editing mode
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {roleLabel}
                  </h2>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1 capitalize">
                  {canSave ? "Ready" : "Incomplete"}
                </Badge>
              </div>

              <div className="cx-glass-block p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Save status
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {canSave
                    ? "All required values are in place."
                    : "Some required values are missing."}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keep your profile accurate so calorie targets, training requests, and
                  coaching flows stay aligned.
                </p>
              </div>
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="grid gap-6 lg:grid-cols-2">
            <BasicInfoSection userProfile={values} setField={setField} />
            <PhysicalStatsSection userProfile={values} setField={setField} />
          </div>

          <div className="space-y-6">
            <SummaryPanel eyebrow="Review" title="Before saving" icon={Sparkles}>
              <div className="space-y-4 p-6">
                <ReadonlyField label="Full name" value={values.fullName} fallback="Add your name" />
                <ReadonlyField label="Birth date" value={values.birthDate} fallback="Pick a date" />
                <ReadonlyField label="Role" value={roleLabel} fallback="Choose a role" />
                <AccentButton
                  tone={canSave ? "emerald" : "sky"}
                  onClick={() => void onSave()}
                  disabled={!canSave}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {canSave ? "Save profile" : "Complete required fields"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </AccentButton>
              </div>
            </SummaryPanel>

            <GlassCard className="overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Live snapshot
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                      Current draft
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3">
                  <ReadonlyField
                    label="Current weight"
                    value={values.actualWeightKg ? `${values.actualWeightKg} kg` : ""}
                    fallback="Add current weight"
                  />
                  <ReadonlyField
                    label="Target weight"
                    value={values.targetWeightKg ? `${values.targetWeightKg} kg` : ""}
                    fallback="Add target weight"
                  />
                  <ReadonlyField
                    label="Weekly target"
                    value={values.weeklyGoalKg ? `${values.weeklyGoalKg} kg` : ""}
                    fallback="Add weekly target"
                  />
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
