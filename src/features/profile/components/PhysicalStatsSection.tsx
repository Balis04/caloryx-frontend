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
}: PhysicalStatsProps) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      Testalkat és Súlyok
    </h2>

    <div className="grid gap-2">
      <Label htmlFor="heightCm">Magasság (cm)</Label>
      <Input
        id="heightCm"
        type="number"
        placeholder="180"
        value={userProfile.heightCm}
        onChange={(e) => setField("heightCm", e.target.value)}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="startWeightKg">Kezdő súly (kg)</Label>
        <Input
          id="startWeightKg"
          type="number"
          step="0.1"
          placeholder="85"
          value={userProfile.startWeightKg}
          onChange={(e) => setField("startWeightKg", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="actualWeightKg" className="text-blue-600 font-bold">
          Jelenlegi súly (kg)
        </Label>
        <Input
          id="actualWeightKg"
          type="number"
          step="0.1"
          placeholder="80.5"
          value={userProfile.actualWeightKg}
          onChange={(e) => setField("actualWeightKg", e.target.value)}
          className="border-blue-200 focus-visible:ring-blue-500"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="targetWeightKg" className="text-green-700 font-bold">
          Célsúly (kg)
        </Label>
        <Input
          id="targetWeightKg"
          type="number"
          step="0.1"
          placeholder="75"
          value={userProfile.targetWeightKg}
          onChange={(e) => setField("targetWeightKg", e.target.value)}
          className="border-green-100 focus-visible:ring-green-600"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="weeklyGoalKg" className="text-grey-700 font-bold">
          Heti cél (kg)
        </Label>
        <Input
          id="weeklyGoalKg"
          type="number"
          step="0.1"
          placeholder="75"
          value={userProfile.weeklyGoalKg}
          onChange={(e) => setField("weeklyGoalKg", e.target.value)}
          className="border-green-100 focus-visible:ring-green-600"
        />
      </div>

      <div className="grid gap-2">
        <Label>Elsődleges cél</Label>
        <Select
          value={userProfile.goal ?? ""}
          onValueChange={(v) => setField("goal", v as Goal)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Választás..." />
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
        <Label>Aktivitási szint</Label>
        <Select
          value={userProfile.activityLevel ?? ""}
          onValueChange={(v) => setField("activityLevel", v as ActivityLevel)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Választás..." />
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
);
