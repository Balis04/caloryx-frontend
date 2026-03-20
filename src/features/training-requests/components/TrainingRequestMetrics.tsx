import type { TrainingRequestResponse } from "../types/training-requests.types";

interface Props {
  request: TrainingRequestResponse;
}

export default function TrainingRequestMetrics({ request }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <p className="font-medium">Weekly sessions</p>
        <p className="mt-2 text-muted-foreground">{request.weeklyTrainingCount} sessions</p>
      </div>
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <p className="font-medium">Session length</p>
        <p className="mt-2 text-muted-foreground">{request.sessionDurationMinutes} minutes</p>
      </div>
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <p className="font-medium">Preferred location</p>
        <p className="mt-2 text-muted-foreground">{request.preferredLocation}</p>
      </div>
    </div>
  );
}
