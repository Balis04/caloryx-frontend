import { SummaryPanel } from "@/components/caloriex";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileEditData } from "../types/profile.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
} from "@/shared/constants/user-options";
import type { ActivityLevel, Goal } from "@/shared/types/profile.types";
import { Activity } from "lucide-react";

interface PhysicalStatsProps {
  userProfile: ProfileEditData;
  setField: <K extends keyof ProfileEditData>(
    key: K,
    value: ProfileEditData[K]
  ) => void;
}

export const PhysicalStatsSection = ({
  userProfile,
  setField,
}: PhysicalStatsProps) => {
  const inputClassName =
    "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur focus-visible:ring-slate-900/20";
  const selectClassName =
    "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur";

  return (
    <SummaryPanel eyebrow="Body metrics" title="Stats and goal setup" icon={Activity}>
      <div className="grid gap-5 p-6">
        <div className="grid gap-2">
          <Label htmlFor="heightCm" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Height (cm)
          </Label>
          <Input
            id="heightCm"
            type="number"
            min="0.1"
            value={userProfile.heightCm}
            onChange={(e) => setField("heightCm", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label
              htmlFor="startWeightKg"
              className="text-xs uppercase tracking-[0.24em] text-slate-500"
            >
              Starting weight (kg)
            </Label>
            <Input
              id="startWeightKg"
              type="number"
              step="0.1"
              min="0.1"
              value={userProfile.startWeightKg}
              onChange={(e) => setField("startWeightKg", e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="actualWeightKg"
              className="text-xs uppercase tracking-[0.24em] text-slate-500"
            >
              Current weight (kg)
            </Label>
            <Input
              id="actualWeightKg"
              type="number"
              step="0.1"
              min="0.1"
              value={userProfile.actualWeightKg}
              onChange={(e) => setField("actualWeightKg", e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="targetWeightKg"
              className="text-xs uppercase tracking-[0.24em] text-slate-500"
            >
              Target weight (kg)
            </Label>
            <Input
              id="targetWeightKg"
              type="number"
              step="0.1"
              min="0.1"
              value={userProfile.targetWeightKg}
              onChange={(e) => setField("targetWeightKg", e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="weeklyGoalKg"
              className="text-xs uppercase tracking-[0.24em] text-slate-500"
            >
              Weekly target (kg)
            </Label>
            <Input
              id="weeklyGoalKg"
              type="number"
              step="0.1"
              min="0"
              value={userProfile.weeklyGoalKg}
              onChange={(e) => setField("weeklyGoalKg", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Primary goal
            </Label>
            <Select
              value={userProfile.goal ?? ""}
              onValueChange={(v) => setField("goal", v as Goal)}
            >
              <SelectTrigger className={selectClassName}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {GOAL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Activity level
            </Label>
            <Select
              value={userProfile.activityLevel ?? ""}
              onValueChange={(v) => setField("activityLevel", v as ActivityLevel)}
            >
              <SelectTrigger className={selectClassName}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </SummaryPanel>
  );
};
