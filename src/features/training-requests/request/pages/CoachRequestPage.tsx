import { useNavigate } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import CoachRequestNextStepPanel from "../components/CoachRequestNextStepPanel";
import CoachSelectionCard from "../components/CoachSelectionCard";
import { useCoachRequestPage } from "../hooks/useCoachRequestPage";

export default function CoachRequestPage() {
  const navigate = useNavigate();
  const { coaches, selectedCoach, loading, error, selectCoach } = useCoachRequestPage();

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        {loading ? (
          <GlassCard className="mb-6">
            <CardContent className="p-6 text-sm italic text-slate-600">
              Loading coaches...
            </CardContent>
          </GlassCard>
        ) : null}

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
                selected={coach.id === selectedCoach?.id}
                onSelect={() => selectCoach(coach.id)}
              />
            ))}

            {!loading && !error && coaches.length === 0 ? (
              <GlassCard className="sm:col-span-2 2xl:col-span-3">
                <CardContent className="p-6 text-sm text-slate-600">
                  No coach profiles are currently available.
                </CardContent>
              </GlassCard>
            ) : null}
          </div>

          <CoachRequestNextStepPanel
            selectedCoach={selectedCoach}
            onAction={() => {
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
