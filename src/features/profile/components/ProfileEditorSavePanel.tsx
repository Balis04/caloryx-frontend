import {
  AccentButton,
  ReadonlyField,
  SummaryPanel,
} from "@/components/caloriex";
import { ArrowRight, Save, Sparkles } from "lucide-react";
import type { ProfileEditorSavePanelProps } from "./profile-editor.types";

export default function ProfileEditorSavePanel({
  values,
  roleLabel,
  canSave,
  onSave,
}: ProfileEditorSavePanelProps) {
  return (
    <SummaryPanel eyebrow="Review" title="Before saving" icon={Sparkles}>
      <div className="space-y-4 p-6">
        <ReadonlyField label="Full name" value={values.fullName} fallback="Add your name" />
        <ReadonlyField label="Birth date" value={values.birthDate} fallback="Pick a date" />
        <ReadonlyField label="Role" value={roleLabel} fallback="Choose a role" />
        <AccentButton
          tone={canSave ? "emerald" : "sky"}
          onClick={() => void onSave()}
          disabled={!canSave}
          className="justify-between"
        >
          <span className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {canSave ? "Save profile" : "Complete required fields"}
          </span>
          <ArrowRight className="h-4 w-4" />
        </AccentButton>
      </div>
    </SummaryPanel>
  );
}
