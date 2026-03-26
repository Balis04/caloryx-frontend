import { isCoachRole } from "@/shared/utils/profileRole";
import type { Profile } from "../model/profile.model";

export const canManageCoachProfile = (
  role: Profile["role"] | null | undefined
) => isCoachRole(role);
