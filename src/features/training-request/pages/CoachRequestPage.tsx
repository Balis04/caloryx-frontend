import CoachRequestWorkspace from "../components/CoachRequestWorkspace";
import { useCoachDirectory } from "../hooks/useCoachDirectory";

export default function CoachRequestPage() {
  const coachDirectory = useCoachDirectory();

  if (coachDirectory.loading) {
    return <div className="p-10 italic text-muted-foreground">Loading coaches...</div>;
  }

  return <CoachRequestWorkspace coachDirectory={coachDirectory} />;
}
