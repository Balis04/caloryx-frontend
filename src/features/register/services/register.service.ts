import type { RegisterFormData } from "../types/register.types";

export async function submitRegister(
  token: string,
  email: string | undefined,
  data: RegisterFormData
) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName: data.fullName,
      birthDate: data.birthDate,
      gender: data.gender,

      heightCm: Number(data.heightCm),
      startWeightKg: Number(data.startWeightKg),
      activityLevel: data.activityLevel,

      goal: data.goal,
      targetWeightKg: Number(data.targetWeightKg),
      weeklyGoalKg: Number(data.weeklyGoalKg),

      email,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
}
