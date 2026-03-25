import {
  GENDER_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/shared/constants/user-options";
import type { UserRole, Gender } from "@/shared/types/profile.types";
import type { RegisterFormData } from "../types/register.types";

export function StepBasic(props: {
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
        placeholder="Full name"
        value={data.fullName}
        onChange={(e) => setField("fullName", e.target.value)}
        className="w-full rounded border p-2"
      />

      <input
        type="date"
        value={data.birthDate}
        onChange={(e) => setField("birthDate", e.target.value)}
        className="w-full rounded border p-2"
      />

      <select
        value={data.gender ?? ""}
        onChange={(e) => setField("gender", e.target.value as Gender)}
        className="w-full rounded border p-2"
      >
        <option value="">Select your gender</option>
        {GENDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={data.userRole ?? ""}
        onChange={(e) => setField("userRole", e.target.value as UserRole)}
        className="w-full rounded border p-2"
      >
        <option value="">Select your role</option>
        {USER_ROLE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
