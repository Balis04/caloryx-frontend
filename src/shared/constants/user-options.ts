export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
] as const;

export const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Very low" },
  { value: "LIGHT", label: "Lightly active" },
  { value: "MODERATE", label: "Moderately active" },
  { value: "ACTIVE", label: "Highly active" },
] as const;

export const GOAL_OPTIONS = [
  { value: "CUT", label: "Weight loss" },
  { value: "MAINTAIN", label: "Maintenance" },
  { value: "BULK", label: "Muscle gain" },
] as const;

export const USER_ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "COACH", label: "Trainer" },
] as const;
