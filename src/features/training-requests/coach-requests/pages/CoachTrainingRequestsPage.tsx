import CoachTrainingRequestsWorkspace from "../components/CoachTrainingRequestsWorkspace";
import { useCoachTrainingRequests } from "../hooks/useCoachTrainingRequests";

export default function CoachTrainingRequestsPage() {
  const trainingRequests = useCoachTrainingRequests();

  return <CoachTrainingRequestsWorkspace trainingRequests={trainingRequests} />;
}
