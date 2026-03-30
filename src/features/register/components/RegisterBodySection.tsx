import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_OPTIONS } from "@/shared/constants/user-options";
import type { ActivityLevel } from "@/shared/types/profile.types";
import { Activity } from "lucide-react";
import type { RegisterFormData, SetFieldFn } from "../types/register.types";

interface Props {
  values: RegisterFormData;
  setField: SetFieldFn;
}

export function RegisterBodySection({ values, setField }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Physical stats
        </h3>
      </div>

      <div className="grid gap-4 pt-2">
        <div className="grid gap-2">
          <Label htmlFor="register-height">Height (cm)</Label>
          <Input
            id="register-height"
            type="number"
            min="0.1"
            step="0.1"
            value={values.heightCm}
            onChange={(event) => setField("heightCm", event.target.value)}
            placeholder="e.g. 175"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-start-weight">Starting weight (kg)</Label>
          <Input
            id="register-start-weight"
            type="number"
            min="0.1"
            step="0.1"
            value={values.startWeightKg}
            onChange={(event) => setField("startWeightKg", event.target.value)}
            placeholder="e.g. 82.5"
          />
        </div>

        <div className="grid gap-2">
          <Label>Activity level</Label>
          <Select
            value={values.activityLevel ?? ""}
            onValueChange={(value) =>
              setField("activityLevel", value as ActivityLevel)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
