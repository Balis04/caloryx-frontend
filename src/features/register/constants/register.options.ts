export const GENDER_OPTIONS = [
  { value: "MALE", label: "Férfi" },
  { value: "FEMALE", label: "Nő" },
] as const;

export const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Nagyon alacsony" },
  { value: "LIGHT", label: "Kevéssé aktív" },
  { value: "MODERATE", label: "Közepesen aktív" },
  { value: "ACTIVE", label: "Nagyon aktív" },
] as const;

export const GOAL_OPTIONS = [
  { value: "CUT", label: "Fogyás" },
  { value: "MAINTAIN", label: "Szinten tartás" },
  { value: "BULK", label: "Tömegelés" },
] as const;

export const USER_ROLE_OPTIONS = [
  { value: "USER", label: "Felhasználó" },
  { value: "TRAINER", label: "Edző" },
] as const;
