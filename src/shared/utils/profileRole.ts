import type { UserRole } from "@/shared/types/profile.types";

export const isCoachRole = (role: UserRole | null | undefined) =>
  role === "COACH";
