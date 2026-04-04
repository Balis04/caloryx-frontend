import CommunityTrainingPlansWorkspace from "../components/CommunityTrainingPlansWorkspace";
import { useCommunityTrainingPlans } from "../hooks/useCommunityTrainingPlans";

export default function CommunityTrainingPlansPage() {
  const communityTrainingPlans = useCommunityTrainingPlans();

  return (
    <CommunityTrainingPlansWorkspace communityTrainingPlans={communityTrainingPlans} />
  );
}
