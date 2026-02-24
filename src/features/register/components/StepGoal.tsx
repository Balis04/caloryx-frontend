import type { Goal, RegisterFormData } from "../types/register.types";
import { GOAL_OPTIONS } from "@/shared/constants/user-options";

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
        className="w-full border p-2 rounded"
      >
        <option value="">Cél kiválasztása</option>
        {GOAL_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <input
        placeholder="Kitűzött cél (kg)"
        type="number"
        value={data.targetWeightKg}
        onChange={(e) => setField("targetWeightKg", e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Heti cél (kg)"
        type="number"
        step="0.1"
        value={data.weeklyGoalKg}
        onChange={(e) => setField("weeklyGoalKg", e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
