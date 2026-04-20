import {
  CaloriexPage,
  GlassCard,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import ProfileOverviewSection from "../components/ProfileOverviewSection";
import { useProfilePage } from "../hooks/useProfilePage";

export default function ProfilePage() {
  const { profile, loading, onEditProfile, onOpenCoachProfile } =
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
          <GlassCard>
            <CardContent className="p-6 text-sm text-slate-600">
              Profile details are not available right now.
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <ProfileOverviewSection
          profile={profile.profile}
          roleLabel={profile.roleLabel}
          genderLabel={profile.genderLabel}
          activityLabel={profile.activityLabel}
          goalLabel={profile.goalLabel}
          weeklyTarget={profile.weeklyTarget}
          canManageCoachProfile={profile.canManageCoachProfile}
          onOpenCoachProfile={onOpenCoachProfile}
          onEditProfile={onEditProfile}
        />
      </section>
    </CaloriexPage>
  );
}
