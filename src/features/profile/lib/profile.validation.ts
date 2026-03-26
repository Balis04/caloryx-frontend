import type { ProfileFormValues } from "../model/profile.form";

export const canSaveProfileForm = (values: ProfileFormValues) => {
  const requiredFields: (keyof ProfileFormValues)[] = [
    "fullName",
    "birthDate",
    "gender",
    "userRole",
    "heightCm",
    "startWeightKg",
    "actualWeightKg",
    "targetWeightKg",
    "weeklyGoalKg",
    "activityLevel",
    "goal",
  ];

  const allFilled = requiredFields.every(
    (key) => values[key] !== "" && values[key] !== null
  );

  if (!allFilled) {
    return false;
  }

  const birthDate = new Date(values.birthDate);
  const isDateValid =
    birthDate >= new Date("1900-01-01") && birthDate <= new Date();

  if (!isDateValid) {
    return false;
  }

  return (
    Number(values.heightCm) > 0 &&
    Number(values.startWeightKg) > 0 &&
    Number(values.actualWeightKg) > 0 &&
    Number(values.targetWeightKg) > 0 &&
    Number(values.weeklyGoalKg) >= 0
  );
};
