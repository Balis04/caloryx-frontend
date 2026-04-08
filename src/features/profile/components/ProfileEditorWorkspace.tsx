import { CaloriexPage, HeroBadge, PageHero } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BasicInfoSection } from "./BasicInfoSection";
import { PhysicalStatsSection } from "./PhysicalStatsSection";
import ProfileEditorHeroAside from "./ProfileEditorHeroAside";
import ProfileEditorSavePanel from "./ProfileEditorSavePanel";
import ProfileEditorSnapshotPanel from "./ProfileEditorSnapshotPanel";
import type { ProfileEditorWorkspaceProps } from "../types/profile-editor.types";

export default function ProfileEditorWorkspace({
  values,
  setField,
  onSave,
  canSave,
}: ProfileEditorWorkspaceProps) {
  const navigate = useNavigate();
  const roleLabel =
    USER_ROLE_OPTIONS.find((option) => option.value === values.userRole)?.label ?? "User";

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
        }
        badge={<HeroBadge>Edit profile</HeroBadge>}
        title="Refresh the personal data that powers your CalorieX experience."
        description="Update your identity details, body metrics, and goal settings in the same design system used across the app."
        chips={[roleLabel, canSave ? "Ready to save" : "Needs a few more fields"]}
        aside={<ProfileEditorHeroAside roleLabel={roleLabel} canSave={canSave} />}
      />

      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="grid gap-6 lg:grid-cols-2">
            <BasicInfoSection userProfile={values} setField={setField} />
            <PhysicalStatsSection userProfile={values} setField={setField} />
          </div>

          <div className="space-y-6">
            <ProfileEditorSavePanel
              values={values}
              roleLabel={roleLabel}
              canSave={canSave}
              onSave={onSave}
            />
            <ProfileEditorSnapshotPanel values={values} />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
