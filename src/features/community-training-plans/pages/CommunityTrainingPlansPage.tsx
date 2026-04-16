import { useCommunityTrainingPlans } from "../hooks/useCommunityTrainingPlans";
import { CaloriexPage } from "@/components/caloriex";
import CommunityPlansGrid from "../components/CommunityPlansGrid";

export default function CommunityTrainingPlansPage() {
  const communityTrainingPlans = useCommunityTrainingPlans();

  return (
      <CaloriexPage>
        <section className="relative container mx-auto px-6 pb-12 md:pb-16">
          <CommunityPlansGrid error={communityTrainingPlans.error} isLoading={communityTrainingPlans.isLoading} plans={communityTrainingPlans.sortedPlans} />
        </section>
      </CaloriexPage>
    );
}
