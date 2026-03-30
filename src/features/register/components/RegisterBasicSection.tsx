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
import type { Gender, UserRole } from "@/shared/types/profile.types";
import { User } from "lucide-react";
import type { RegisterFormData, SetFieldFn } from "../types/register.types";

interface Props {
  values: RegisterFormData;
  setField: SetFieldFn;
}

export function RegisterBasicSection({ values, setField }: Props) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Basic information
        </h3>
      </div>

      <div className="grid gap-4 pt-2">
        <div className="grid gap-2">
          <Label htmlFor="register-full-name">Full name</Label>
          <Input
            id="register-full-name"
            value={values.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-birth-date">Birth date</Label>
          <Input
            id="register-birth-date"
            type="date"
            min="1900-01-01"
            max={today}
            value={values.birthDate}
            onChange={(event) => setField("birthDate", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Gender</Label>
            <Select
              value={values.gender ?? ""}
              onValueChange={(value) => setField("gender", value as Gender)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <Select
              value={values.userRole ?? ""}
              onValueChange={(value) => setField("userRole", value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
