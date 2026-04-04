import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import { COACH_REQUEST_PAGE_COPY } from "../lib/training-request-page.constants";
import type { UseCoachDirectoryResult } from "../hooks/useCoachDirectory";
import CoachRequestHeroAside from "./CoachRequestHeroAside";
import CoachRequestNextStepPanel from "./CoachRequestNextStepPanel";
import CoachSelectionCard from "./CoachSelectionCard";

interface CoachRequestWorkspaceProps {
  coachDirectory: UseCoachDirectoryResult;
}

export default function CoachRequestWorkspace({
  coachDirectory,
}: CoachRequestWorkspaceProps) {
  const navigate = useNavigate();
  const { coaches, error } = coachDirectory;
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const selectedCoach = useMemo(
    () => coaches.find((coach) => coach.id === selectedCoachId) ?? null,
    [coaches, selectedCoachId]
  );

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>{COACH_REQUEST_PAGE_COPY.badge}</HeroBadge>}
        title={COACH_REQUEST_PAGE_COPY.title}
        description={COACH_REQUEST_PAGE_COPY.description}
        chips={COACH_REQUEST_PAGE_COPY.chips}
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
            onOpenForm={() => {
              if (!selectedCoach) {
                return;
              }

              navigate(`/training-request/${selectedCoach.id}`);
            }}
          />
        </div>
      </section>
    </CaloriexPage>
  );
}
