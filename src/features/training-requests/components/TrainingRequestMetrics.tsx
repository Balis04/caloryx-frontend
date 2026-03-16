import type { TrainingRequestResponse } from "../types/training-requests.types";

interface Props {
  request: TrainingRequestResponse;
}

export default function TrainingRequestMetrics({ request }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <p className="font-medium">Heti edzesszam</p>
        <p className="mt-2 text-muted-foreground">{request.weeklyTrainingCount} alkalom</p>
      </div>
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <p className="font-medium">Alkalom hossza</p>
        <p className="mt-2 text-muted-foreground">{request.sessionDurationMinutes} perc</p>
      </div>
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <p className="font-medium">Preferalt helyszin</p>
        <p className="mt-2 text-muted-foreground">{request.preferredLocation}</p>
      </div>
    </div>
  );
}
