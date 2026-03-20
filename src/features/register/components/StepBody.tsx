import { ACTIVITY_OPTIONS } from "@/shared/constants/user-options";
import type { ActivityLevel } from "@/shared/types/profile.types";
import type { RegisterFormData } from "../types/register.types";

export function StepBody(props: {
  data: RegisterFormData;
  setField: <K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K]
  ) => void;
}) {
  const { data, setField } = props;

  return (
    <div className="space-y-4">
      <input
        placeholder="Height (cm)"
        type="number"
        value={data.heightCm}
        onChange={(e) => setField("heightCm", e.target.value)}
        className="w-full rounded border p-2"
      />

      <input
        placeholder="Weight (kg)"
        type="number"
        value={data.startWeightKg}
        onChange={(e) => setField("startWeightKg", e.target.value)}
        className="w-full rounded border p-2"
      />

      <select
        value={data.activityLevel ?? ""}
        onChange={(e) =>
          setField("activityLevel", e.target.value as ActivityLevel)
        }
        className="w-full rounded border p-2"
      >
        <option value="">Activity level</option>
        {ACTIVITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
