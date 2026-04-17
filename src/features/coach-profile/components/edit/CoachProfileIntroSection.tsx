import { SummaryPanel } from "@/components/caloriex";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";

import {
  coachProfileInputClassName,
  coachProfileSelectClassName,
  coachProfileTextareaClassName,
  CURRENCY_OPTIONS,
  TRAINING_FORMAT_OPTIONS,
} from "../../lib/coach-profile.formatters";
import type {
  CoachProfileFormData,
  Currency,
  TrainingFormat,
} from "../../types";

export default function CoachProfileIntroSection({
  formData,
  setField,
}: {
  formData: CoachProfileFormData;
  setField: <K extends keyof CoachProfileFormData>(
    key: K,
    value: CoachProfileFormData[K]
  ) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  return (
    <SummaryPanel eyebrow="Positioning" title="Introduction and coaching setup" icon={Shield}>
      <div className="grid gap-5 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startedCoachingAt" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            When did you start coaching? *
          </Label>
          <Input
            id="startedCoachingAt"
            type="date"
            min={minDate}
            max={today}
            value={formData.startedCoachingAt}
            onChange={(event) => setField("startedCoachingAt", event.target.value)}
            className={coachProfileInputClassName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionFormat" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Training format *
          </Label>
          <Select
            value={formData.sessionFormat}
            onValueChange={(value) => setField("sessionFormat", value as TrainingFormat | "")}
          >
            <SelectTrigger id="sessionFormat" className={coachProfileSelectClassName}>
              <SelectValue placeholder="Select a format" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_FORMAT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Short description *
          </Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder="Describe how you help clients, what kind of people you work with, and your coaching approach."
            className={coachProfileTextareaClassName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCapacity" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Maximum capacity *
          </Label>
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            value={formData.maxCapacity}
            onChange={(event) => setField("maxCapacity", event.target.value)}
            placeholder="e.g. 12"
            className={coachProfileInputClassName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Currency *
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setField("currency", value as Currency | "")}
          >
            <SelectTrigger id="currency" className={coachProfileSelectClassName}>
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceFrom" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Price from *
          </Label>
          <Input
            id="priceFrom"
            type="number"
            min="0"
            value={formData.priceFrom}
            onChange={(event) => setField("priceFrom", event.target.value)}
            placeholder="e.g. 8000"
            className={coachProfileInputClassName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceTo" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Price to *
          </Label>
          <Input
            id="priceTo"
            type="number"
            min="0"
            value={formData.priceTo}
            onChange={(event) => setField("priceTo", event.target.value)}
            placeholder="e.g. 15000"
            className={coachProfileInputClassName}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contactNote" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Contact note *
          </Label>
          <textarea
            id="contactNote"
            value={formData.contactNote}
            onChange={(event) => setField("contactNote", event.target.value)}
            placeholder="What kind of clients you prefer to work with and your expected response time."
            className={coachProfileTextareaClassName}
          />
        </div>

        <p className="text-xs text-slate-500 md:col-span-2">
          Fields marked with * are required before you can create or update the coach
          profile.
        </p>
      </div>
    </SummaryPanel>
  );
}

