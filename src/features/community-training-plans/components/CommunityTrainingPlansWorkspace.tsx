import { CaloriexPage, HeroBadge, PageHero } from "@/components/caloriex";

import type { CommunityTrainingPlansWorkspaceProps } from "./community-training-plans.types";
import CommunityPlansGrid from "./CommunityPlansGrid";
import CommunityPlansHeroAside from "./CommunityPlansHeroAside";
import CommunityPlansNextSteps from "./CommunityPlansNextSteps";

export default function CommunityTrainingPlansWorkspace({
  communityTrainingPlans,
}: CommunityTrainingPlansWorkspaceProps) {
  const { error, isLoading, sortedPlans } = communityTrainingPlans;

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Community training plans</HeroBadge>}
        title="Find the right training plan for maintenance, fat loss, or muscle gain."
        description="Choose a ready-made community program and download it instantly. These plans are meant to give users a clear starting point based on their current goal, whether that is maintaining, cutting, or building muscle."
        chips={["Instant PDF download", "Goal-based presets", "Community-ready programs"]}
        aside={<CommunityPlansHeroAside planCount={sortedPlans.length} />}
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <CommunityPlansGrid error={error} isLoading={isLoading} plans={sortedPlans} />
      </section>

      <section className="relative container mx-auto px-6 pb-16">
        <CommunityPlansNextSteps />
      </section>
    </CaloriexPage>
  );
}
