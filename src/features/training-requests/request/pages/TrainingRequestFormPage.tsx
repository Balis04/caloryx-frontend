import { useParams } from "react-router-dom";

import TrainingRequestFormWorkspace from "../components/TrainingRequestFormWorkspace";
import { useCoachDirectory } from "../hooks/useCoachDirectory";
import { useTrainingRequestForm } from "../hooks/useTrainingRequestForm";

export default function TrainingRequestFormPage() {
  const { coachId } = useParams();
  const coachDirectory = useCoachDirectory();
  const trainingRequestForm = useTrainingRequestForm(coachId ?? null);

  return (
    <TrainingRequestFormWorkspace
      coachId={coachId ?? null}
      coachDirectory={coachDirectory}
      trainingRequestForm={trainingRequestForm}
    />
  );
}
