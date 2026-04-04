import CoachTrainingRequestsWorkspace from "../components/CoachTrainingRequestsWorkspace";
import { useCoachTrainingRequests } from "../hooks/useCoachTrainingRequests";

export default function CoachTrainingRequestsPage() {
  const trainingRequests = useCoachTrainingRequests();

  if (trainingRequests.profileLoading || trainingRequests.loading) {
    return <div className="p-10 italic text-muted-foreground">Loading requests...</div>;
  }

  return <CoachTrainingRequestsWorkspace trainingRequests={trainingRequests} />;
}
