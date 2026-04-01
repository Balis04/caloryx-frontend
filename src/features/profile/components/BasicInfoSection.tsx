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
import {
  GENDER_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/shared/constants/user-options";
import { User } from "lucide-react";
import type { UserRole, Gender } from "@/shared/types/profile.types";
import type { ProfileEditData } from "../types/profile.types";

interface Props {
  userProfile: ProfileEditData;
  setField: <K extends keyof ProfileEditData>(
    key: K,
    value: ProfileEditData[K]
  ) => void;
}

export const BasicInfoSection = ({ userProfile, setField }: Props) => {
  const today = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";
  const inputClassName =
    "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur focus-visible:ring-slate-900/20";
  const selectClassName =
    "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur";

  return (
    <SummaryPanel eyebrow="Basics" title="Identity details" icon={User}>
      <div className="grid gap-5 p-6">
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Full name
          </Label>
          <Input
            id="fullName"
            value={userProfile.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birthDate" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Birth date
          </Label>
          <Input
            id="birthDate"
            type="date"
            min={minDate}
            max={today}
            value={userProfile.birthDate}
            onChange={(e) => setField("birthDate", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Gender
            </Label>
            <Select
              value={userProfile.gender ?? ""}
              onValueChange={(v) => setField("gender", v as Gender)}
            >
              <SelectTrigger className={selectClassName}>
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Role
            </Label>
            <Select
              value={userProfile.userRole ?? ""}
              onValueChange={(v) => setField("userRole", v as UserRole)}
            >
              <SelectTrigger className={selectClassName}>
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLE_OPTIONS.map((o) => (
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
