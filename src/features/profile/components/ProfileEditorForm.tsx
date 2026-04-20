import { CaloriexPage } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { ProfileFormValues } from "../lib/profile.form";
import { BasicInfoSection } from "./BasicInfoSection";
import { PhysicalStatsSection } from "./PhysicalStatsSection";
import ProfileEditorSavePanel from "./ProfileEditorSavePanel";

interface ProfileEditorFormProps {
  values: ProfileFormValues;
  setField: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => void;
  onSave: () => Promise<void>;
  canSave: boolean;
  backPath?: string;
  backLabel?: string;
  saveLabel?: string;
  disabledSaveLabel?: string;
  showActualWeight?: boolean;
}

export default function ProfileEditorForm({
  values,
  setField,
  onSave,
  canSave,
  backPath = "/profile",
  backLabel = "Back to profile",
  saveLabel,
  disabledSaveLabel,
  showActualWeight = true,
}: ProfileEditorFormProps) {
  const navigate = useNavigate();
  const roleLabel =
    USER_ROLE_OPTIONS.find((option) => option.value === values.userRole)?.label ?? "User";

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(backPath)}
          className="mb-2.5 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          {backLabel}
        </Button>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="grid gap-6 lg:grid-cols-2">
            <BasicInfoSection userProfile={values} setField={setField} />
            <PhysicalStatsSection
              userProfile={values}
              setField={setField}
              showActualWeight={showActualWeight}
            />
          </div>

          <div className="space-y-6">
            <ProfileEditorSavePanel
              values={values}
              roleLabel={roleLabel}
              canSave={canSave}
              onSave={onSave}
              saveLabel={saveLabel}
              disabledLabel={disabledSaveLabel}
            />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}

