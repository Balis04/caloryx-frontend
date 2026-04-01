import {
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";
import { Activity, ShieldCheck, Target } from "lucide-react";
import ProfileCard from "../components/ProfileCard";
import { calculateProgress } from "../lib/profile.formatters";
import { useProfileQuery } from "../hooks/useProfileQuery";

export default function ProfilePage() {
  const { profile, loading, error } = useProfileQuery();

  if (loading) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <GlassCard>
            <CardContent className="p-6 text-sm italic text-slate-600">
              Loading your profile workspace...
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  if (!profile) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <GlassCard className="border-red-300/70 bg-red-50/70">
            <CardContent className="p-6 text-sm text-red-700">
              Failed to load profile{error ? `: ${error}` : "."}
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  const roleLabel = getLabelFromOptions(USER_ROLE_OPTIONS, profile.role);
  const goalLabel = getLabelFromOptions(GOAL_OPTIONS, profile.goal);
  const activityLabel = getLabelFromOptions(ACTIVITY_OPTIONS, profile.activityLevel);
  const progressValue = calculateProgress(profile);

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Profile hub</HeroBadge>}
        title="Track who you are today and where your body goals are moving next."
        description="Your identity, body metrics, and goal progress now share the same CalorieX layout as the rest of the product, so profile changes are easier to scan and update."
        chips={[roleLabel, goalLabel, activityLabel]}
        aside={
          <GlassCard className="overflow-hidden">
            <CardContent className="grid gap-4 p-6">
              <div className="cx-glass-block p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Role
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">{roleLabel}</p>
                  </div>
                </div>
              </div>

              <div className="cx-glass-block p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Goal
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">{goalLabel}</p>
                  </div>
                </div>
              </div>

              <div className="cx-glass-block p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Progress
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {progressValue.toFixed(0)}% in motion
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <ProfileCard profile={profile} />
      </section>
    </CaloriexPage>
  );
}
