import {
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { Activity, ShieldCheck, Target } from "lucide-react";
import ProfileCard from "../components/ProfileCard";
import { useProfilePage } from "../hooks/useProfilePage";

export default function ProfilePage() {
  const { profile, loading, error, onEditProfile, onOpenCoachProfile } =
    useProfilePage();

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

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Profile hub</HeroBadge>}
        title="Track who you are today and where your body goals are moving next."
        description="Your identity, body metrics, and goal progress now share the same CalorieX layout as the rest of the product, so profile changes are easier to scan and update."
        chips={[profile.roleLabel, profile.goalLabel, profile.activityLabel]}
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
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {profile.roleLabel}
                    </p>
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
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {profile.goalLabel}
                    </p>
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
                      {profile.progressValue.toFixed(0)}% in motion
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <ProfileCard
          profile={profile.profile}
          roleLabel={profile.roleLabel}
          genderLabel={profile.genderLabel}
          activityLabel={profile.activityLabel}
          goalLabel={profile.goalLabel}
          weeklyTarget={profile.weeklyTarget}
          progressValue={profile.progressValue}
          progressMessage={profile.progressMessage}
          canManageCoachProfile={profile.canManageCoachProfile}
          onOpenCoachProfile={onOpenCoachProfile}
          onEditProfile={onEditProfile}
        />
      </section>
    </CaloriexPage>
  );
}
