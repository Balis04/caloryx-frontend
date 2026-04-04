import { useParams } from "react-router-dom";

import TrainingRequestFormWorkspace from "../components/TrainingRequestFormWorkspace";
import { useCoachDirectory } from "../hooks/useCoachDirectory";
import { useTrainingRequestForm } from "../hooks/useTrainingRequestForm";

export default function TrainingRequestFormPage() {
  const { coachId } = useParams();
  const coachDirectory = useCoachDirectory();
  const trainingRequestForm = useTrainingRequestForm(coachId ?? null);

  if (trainingRequestForm.loading || coachDirectory.loading) {
    return <div className="p-10 italic text-muted-foreground">Loading...</div>;
  }

  return (
    <TrainingRequestFormWorkspace
      coachId={coachId ?? null}
      coachDirectory={coachDirectory}
      trainingRequestForm={trainingRequestForm}
    />
  );
}
