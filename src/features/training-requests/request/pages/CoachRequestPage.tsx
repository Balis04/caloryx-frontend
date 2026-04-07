import CoachRequestWorkspace from "../components/CoachRequestWorkspace";
import { useCoachDirectory } from "../hooks/useCoachDirectory";

export default function CoachRequestPage() {
  const coachDirectory = useCoachDirectory();

  return <CoachRequestWorkspace coachDirectory={coachDirectory} />;
}
