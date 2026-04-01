import { SummaryPanel } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays } from "lucide-react";

import { coachProfileInputClassName } from "../lib/coach-profile.presentation";
import type { AvailabilitySlot } from "../types/coach-profile.types";

export default function CoachProfileAvailabilitySection({
  availability,
  setAvailabilityField,
}: {
  availability: AvailabilitySlot[];
  setAvailabilityField: (
    day: string,
    key: keyof AvailabilitySlot,
    value: string | boolean
  ) => void;
}) {
  return (
    <SummaryPanel eyebrow="Schedule" title="Weekly availability" icon={CalendarDays}>
      <div className="grid gap-4 p-6">
        {availability.map((slot) => (
          <div
            key={slot.dayOfWeek}
            className="cx-glass-block grid gap-4 rounded-[26px] p-4 md:grid-cols-[160px_130px_1fr_1fr]"
          >
            <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={slot.enabled}
                onChange={(event) =>
                  setAvailabilityField(slot.dayOfWeek, "enabled", event.target.checked)
                }
              />
              {slot.label}
            </label>

            <Badge variant={slot.enabled ? "default" : "outline"} className="w-fit rounded-full">
              {slot.enabled ? "Available" : "Unavailable"}
            </Badge>

            <div className="space-y-2">
              <Label htmlFor={`${slot.dayOfWeek}-from`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Start
              </Label>
              <Input
                id={`${slot.dayOfWeek}-from`}
                type="time"
                disabled={!slot.enabled}
                value={slot.from}
                onChange={(event) =>
                  setAvailabilityField(slot.dayOfWeek, "from", event.target.value)
                }
                className={coachProfileInputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${slot.dayOfWeek}-until`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                End
              </Label>
              <Input
                id={`${slot.dayOfWeek}-until`}
                type="time"
                disabled={!slot.enabled}
                value={slot.until}
                onChange={(event) =>
                  setAvailabilityField(slot.dayOfWeek, "until", event.target.value)
                }
                className={coachProfileInputClassName}
              />
            </div>
          </div>
        ))}
      </div>
    </SummaryPanel>
  );
}
