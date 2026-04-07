import { GlassCard, ReadonlyField } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  GENDER_OPTIONS,
} from "@/shared/constants/user-options";
import { UserRound } from "lucide-react";
import type { RegisterFormData } from "../types/register.types";

interface Props {
  values: RegisterFormData;
  roleLabel: string;
}

export function RegisterSummaryPanel({ values, roleLabel }: Props) {
  const genderLabel =
    GENDER_OPTIONS.find((option) => option.value === values.gender)?.label ?? "";
  const activityLabel =
    ACTIVITY_OPTIONS.find((option) => option.value === values.activityLevel)?.label ?? "";
  const goalLabel =
    GOAL_OPTIONS.find((option) => option.value === values.goal)?.label ?? "";

  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Live snapshot
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Registration draft
            </h3>
          </div>
        </div>

        <div className="grid gap-3">
          <ReadonlyField label="Full name" value={values.fullName} fallback="Add your full name" />
          <ReadonlyField label="Birth date" value={values.birthDate} fallback="Choose a date" />
          <ReadonlyField label="Gender" value={genderLabel} fallback="Choose a gender" />
          <ReadonlyField label="Role" value={roleLabel} fallback="Choose a role" />
          <ReadonlyField
            label="Height"
            value={values.heightCm ? `${values.heightCm} cm` : ""}
            fallback="Add your height"
          />
          <ReadonlyField
            label="Starting weight"
            value={values.startWeightKg ? `${values.startWeightKg} kg` : ""}
            fallback="Add your starting weight"
          />
          <ReadonlyField
            label="Activity"
            value={activityLabel}
            fallback="Choose your activity level"
          />
          <ReadonlyField label="Goal" value={goalLabel} fallback="Choose a goal" />
          <ReadonlyField
            label="Target weight"
            value={values.targetWeightKg ? `${values.targetWeightKg} kg` : ""}
            fallback="Add your target weight"
          />
          <ReadonlyField
            label="Weekly target"
            value={values.weeklyGoalKg ? `${values.weeklyGoalKg} kg` : ""}
            fallback="Add your weekly target"
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
