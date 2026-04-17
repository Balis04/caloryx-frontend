import {
  AccentButton,
  GlassCard,
  GlassMetric,
  ReadonlyField,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  Edit3,
  Flame,
  UserCircle2,
} from "lucide-react";

import { formatBirthDate } from "../lib/profile.formatters";
import type { ProfileResponse } from "../model/profile.types";

interface ProfileOverviewSectionProps {
  profile: ProfileResponse;
  roleLabel: string;
  genderLabel: string;
  activityLabel: string;
  goalLabel: string;
  weeklyTarget: string;
  canManageCoachProfile: boolean;
  onOpenCoachProfile: () => void;
  onEditProfile: () => void;
}

export default function ProfileOverviewSection({
  profile,
  roleLabel,
  genderLabel,
  activityLabel,
  goalLabel,
  weeklyTarget,
  canManageCoachProfile,
  onOpenCoachProfile,
  onEditProfile,
}: ProfileOverviewSectionProps) {
  const weightDelta = profile.actualWeightKg - profile.startWeightKg;
  const deltaText =
    Math.abs(weightDelta) < 0.05
      ? "0.0 kg"
      : `${weightDelta > 0 ? "+" : ""}${weightDelta.toFixed(1)} kg`;

  return (
    <div className="space-y-6">
      <GlassCard className="overflow-hidden border-white/70">
        <div className="border-b border-white/60 bg-gradient-to-r from-emerald-100/80 via-white/40 to-sky-100/80 p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="border-emerald-300/60 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-700"
                >
                  User profile
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 capitalize">
                  {roleLabel}
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                  {profile.fullName}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
          <GlassMetric
            label="Primary goal"
            value={goalLabel}
            description="Your primary goal."
          />
          <GlassMetric
            label="Weekly pace"
            value={weeklyTarget}
            description="Targeted weekly change based on your goal."
          />
          <GlassMetric
            label="Since start"
            value={deltaText}
            description="Difference between your starting and current weight."
          />
        </CardContent>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="space-y-6">
          <SummaryPanel eyebrow="Identity" title="Personal baseline" icon={UserCircle2}>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <ReadonlyField label="Full name" value={profile.fullName} fallback="Not set" />
              <ReadonlyField
                label="Birth date"
                value={formatBirthDate(profile.birthDate)}
                fallback="Not set"
              />
              <ReadonlyField label="Gender" value={genderLabel} fallback="Not set" />
              <ReadonlyField label="Role" value={roleLabel} fallback="Not set" />
              <ReadonlyField label="Height" value={`${profile.heightCm} cm`} fallback="Not set" />
              <ReadonlyField
                label="Activity level"
                value={activityLabel}
                fallback="Not set"
              />
            </div>
          </SummaryPanel>

          <SummaryPanel eyebrow="Body data" title="Weight trajectory" icon={Flame}>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <ReadonlyField
                label="Starting weight"
                value={`${profile.startWeightKg} kg`}
                fallback="Not set"
              />
              <ReadonlyField
                label="Current weight"
                value={`${profile.actualWeightKg} kg`}
                fallback="Not set"
              />
              <ReadonlyField
                label="Target weight"
                value={`${profile.targetWeightKg} kg`}
                fallback="Not set"
              />
            </div>
          </SummaryPanel>
        </div>

        <div className="space-y-6">
          <GlassCard className="overflow-hidden">
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Actions
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Keep your profile in sync
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Update your profile whenever your body metrics, activity level, or role
                  changes so the rest of the app can stay aligned.
                </p>
              </div>

              <div className="space-y-3">
                {canManageCoachProfile ? (
                  <AccentButton
                    tone="sky"
                    onClick={onOpenCoachProfile}
                    className="justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Coach profile
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </AccentButton>
                ) : null}

                <AccentButton
                  tone="emerald"
                  onClick={onEditProfile}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit profile
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </AccentButton>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
