import { GOAL_OPTIONS } from "@/shared/constants/user-options";
import type { Goal } from "@/shared/types/profile.types";
import type { RegisterFormData } from "../types/register.types";

export function StepGoal(props: {
  data: RegisterFormData;
  setField: <K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K]
  ) => void;
}) {
  const { data, setField } = props;

  return (
    <div className="space-y-4">
      <select
        value={data.goal ?? ""}
        onChange={(e) => setField("goal", e.target.value as Goal)}
        className="w-full rounded border p-2"
      >
        <option value="">Select a goal</option>
        {GOAL_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <input
        placeholder="Target weight (kg)"
        type="number"
        value={data.targetWeightKg}
        onChange={(e) => setField("targetWeightKg", e.target.value)}
        className="w-full rounded border p-2"
      />

      <input
        placeholder="Weekly goal (kg)"
        type="number"
        step="0.1"
        value={data.weeklyGoalKg}
        onChange={(e) => setField("weeklyGoalKg", e.target.value)}
        className="w-full rounded border p-2"
      />
    </div>
  );
}
