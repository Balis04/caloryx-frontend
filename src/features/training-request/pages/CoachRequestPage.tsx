import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import CoachRequestHeroAside from "../components/CoachRequestHeroAside";
import CoachRequestNextStepPanel from "../components/CoachRequestNextStepPanel";
import CoachSelectionCard from "../components/CoachSelectionCard";
import { useCoachDirectory } from "../hooks/useCoachDirectory";

export default function CoachRequestPage() {
  const navigate = useNavigate();
  const { coaches, loading, error } = useCoachDirectory();
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const selectedCoach = coaches.find((coach) => coach.id === selectedCoachId) ?? null;

  if (loading) {
    return <div className="p-10 italic text-muted-foreground">Loading coaches...</div>;
  }

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Training request</HeroBadge>}
        title="Choose a coach first, then send a focused training request."
        description="Browse available coaches, review their background, then open a dedicated request form with your preferences and goals already centered around the selected coach."
        chips={["Coach selection", "Goal-based request", "Certificates and availability"]}
        aside={
          <CoachRequestHeroAside
            coachCount={coaches.length}
            selectedCoachName={selectedCoach?.fullName}
          />
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {error ? (
          <GlassCard className="border-amber-300/70 bg-amber-50/70">
            <CardContent className="p-6 text-sm text-amber-900">{error}</CardContent>
          </GlassCard>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {coaches.map((coach) => (
              <CoachSelectionCard
                key={coach.id}
                coach={coach}
                selected={coach.id === selectedCoachId}
                onSelect={() => setSelectedCoachId(coach.id)}
              />
            ))}

            {!error && coaches.length === 0 ? (
              <GlassCard className="sm:col-span-2 2xl:col-span-3">
                <CardContent className="p-6 text-sm text-slate-600">
                  No coach profiles are currently available.
                </CardContent>
              </GlassCard>
            ) : null}
          </div>

          <CoachRequestNextStepPanel
            selectedCoach={selectedCoach}
            onOpenForm={() => navigate(`/training-request/${selectedCoachId}`)}
          />
        </div>
      </section>
    </CaloriexPage>
  );
}
