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

export const BasicInfoSection = ({ userProfile, setField }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 border-b pb-2">
      <User className="w-4 h-4 text-muted-foreground" />
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Alapadatok
      </h3>
    </div>

    <div className="grid gap-4 pt-2">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Teljes név</Label>
        <Input
          id="fullName"
          value={userProfile.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          className="focus-visible:ring-primary"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="birthDate">Születési dátum</Label>
        <Input
          id="birthDate"
          type="date"
          value={userProfile.birthDate}
          onChange={(e) => setField("birthDate", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Nem</Label>
          <Select
            value={userProfile.gender ?? ""}
            onValueChange={(v) => setField("gender", v as Gender)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Válassz..." />
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
          <Label>Szerepkör</Label>
          <Select
            value={userProfile.userRole ?? ""}
            onValueChange={(v) => setField("userRole", v as UserRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Válassz..." />
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
  </div>
);
