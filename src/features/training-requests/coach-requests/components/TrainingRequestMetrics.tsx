import { GlassMetric } from "@/components/caloriex";
import type { CoachTrainingRequest } from "../model/coach-training-request.model";

export default function TrainingRequestMetrics({ request }: { request: CoachTrainingRequest }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <GlassMetric label="Weekly sessions" value={`${request.weeklyTrainingCount}`} description="Planned training frequency per week." />
      <GlassMetric label="Session length" value={`${request.sessionDurationMinutes} min`} description="Preferred session duration from the requester." />
      <GlassMetric label="Location" value={request.preferredLocation} description="Preferred place for workouts." />
    </div>
  );
}
