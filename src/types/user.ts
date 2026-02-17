import { Goal } from "@/constant/goal";

export interface MeResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  goal: Goal;
  startWeightKg: number;
  targetWeightKg: number;
  currentWeightKg: number;
}
