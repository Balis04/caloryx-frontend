import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOAL_OPTIONS } from "@/shared/constants/user-options";
import type { Goal } from "@/shared/types/profile.types";
import { Target } from "lucide-react";
import type { RegisterFormData, SetFieldFn } from "../types/register.types";

interface Props {
  values: RegisterFormData;
  setField: SetFieldFn;
}

export function RegisterGoalSection({ values, setField }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <Target className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Goals
        </h3>
      </div>

      <div className="grid gap-4 pt-2">
        <div className="grid gap-2">
          <Label>Primary goal</Label>
          <Select
            value={values.goal ?? ""}
            onValueChange={(value) => setField("goal", value as Goal)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {GOAL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="register-target-weight">Target weight (kg)</Label>
            <Input
              id="register-target-weight"
              type="number"
              min="0.1"
              step="0.1"
              value={values.targetWeightKg}
              onChange={(event) => setField("targetWeightKg", event.target.value)}
              placeholder="e.g. 75"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="register-weekly-goal">Weekly target (kg)</Label>
            <Input
              id="register-weekly-goal"
              type="number"
              min="0"
              step="0.1"
              value={values.weeklyGoalKg}
              onChange={(event) => setField("weeklyGoalKg", event.target.value)}
              placeholder="e.g. 0.4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
