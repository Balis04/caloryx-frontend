import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProfileFormValues } from "../model/profile.form";
import { BasicInfoSection } from "./BasicInfoSection";
import { PhysicalStatsSection } from "./PhysicalStatsSection";

interface Props {
  values: ProfileFormValues;
  setField: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => void;
  onSave: () => Promise<void>;
  canSave: boolean;
}

export default function ProfileForm({ values, setField, onSave, canSave }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] pt-2 pb-6 px-4">
      <div className="w-full max-w-5xl space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back
        </Button>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="py-3 border-b mb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5" /> Edit Profile
              </CardTitle>
              <Badge variant="secondary" className="capitalize">
                {USER_ROLE_OPTIONS.find((option) => option.value === values.userRole)
                  ?.label ?? "User"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 py-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4 items-start">
              <div className="space-y-4">
                <BasicInfoSection userProfile={values} setField={setField} />
              </div>

              <div className="space-y-4">
                <PhysicalStatsSection userProfile={values} setField={setField} />
              </div>
            </div>
            <div className="pt-4 border-t mt-2">
              <Button
                onClick={() => void onSave()}
                disabled={!canSave}
                className="w-full lg:w-48 h-10 ml-auto flex font-bold transition-all shadow-md"
              >
                {canSave ? "Save" : "Missing data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
