import { FileText, Upload } from "lucide-react";

import { GlassCardSoft, GlassChip } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type {
  CoachTrainingRequest,
  TrainingPlanDraft,
} from "../model/coach-training-request.model";

interface Props {
  draft: TrainingPlanDraft;
  isExpanded: boolean;
  isSaving: boolean;
  onDraftChange: (draft: TrainingPlanDraft) => void;
  onSave: () => void;
  onToggle: () => void;
  request: CoachTrainingRequest;
}

export default function TrainingPlanEditor({
  draft,
  isExpanded,
  isSaving,
  onDraftChange,
  onSave,
  onToggle,
  request,
}: Props) {
  const hasExistingFile = Boolean(draft.existingFileName);
  const planNameId = `training-plan-name-${request.id}`;
  const planDescriptionId = `training-plan-description-${request.id}`;
  const planFileId = `training-plan-file-${request.id}`;

  return (
    <GlassCardSoft>
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Training plan</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add the training plan name and description, then upload a PDF or DOCX file for the
              user.
            </p>
          </div>
          <Button
            type="button"
            variant={isExpanded ? "secondary" : "outline"}
            className="gap-2 rounded-full"
            onClick={onToggle}
          >
            <FileText className="h-4 w-4" />
            {isExpanded ? "Close editor" : "Upload training plan"}
          </Button>
        </div>

        {draft.planDescription && !isExpanded ? (
          <div className="space-y-3 rounded-3xl border border-white/60 bg-white/70 p-4">
            {draft.planName ? <GlassChip className="w-fit">{draft.planName}</GlassChip> : null}
            <div>
              <p className="text-sm font-medium text-slate-950">Training plan description</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{draft.planDescription}</p>
            </div>
          </div>
        ) : null}

        {(draft.existingFileName || draft.file) && !isExpanded ? (
          <div className="rounded-3xl border border-white/60 bg-white/70 p-4">
            <p className="text-sm font-medium text-slate-950">Current file</p>
            <p className="mt-2 text-sm text-slate-600">{draft.file?.name || draft.existingFileName}</p>
          </div>
        ) : null}

        {isExpanded ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor={planNameId} className="text-sm font-medium text-slate-900">
                Training plan name
              </label>
              <Input
                id={planNameId}
                type="text"
                value={draft.planName}
                onChange={(event) => onDraftChange({ ...draft, planName: event.target.value })}
                disabled={isSaving}
                placeholder="Enter a name for the training plan."
                className="border-white/70 bg-white/80"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={planDescriptionId} className="text-sm font-medium text-slate-900">
                Training plan description
              </label>
              <textarea
                id={planDescriptionId}
                className="min-h-32 w-full rounded-3xl border border-white/70 bg-white/80 px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Briefly describe what the training plan contains."
                value={draft.planDescription}
                onChange={(event) =>
                  onDraftChange({ ...draft, planDescription: event.target.value })
                }
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={planFileId} className="text-sm font-medium text-slate-900">
                PDF or DOCX file
              </label>
              <Input
                id={planFileId}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) =>
                  onDraftChange({ ...draft, file: event.target.files?.[0] ?? null })
                }
                disabled={isSaving}
                className="border-white/70 bg-white/80"
              />
              <p className="text-xs text-slate-500">Accepted formats: `.pdf`, `.docx`</p>
            </div>

            {hasExistingFile || draft.file ? (
              <div className="rounded-3xl border border-white/60 bg-white/70 p-4">
                <p className="text-sm font-medium text-slate-950">Selected or current file</p>
                <p className="mt-2 text-sm text-slate-600">
                  {draft.file?.name || draft.existingFileName}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" className="gap-2 rounded-full" disabled={isSaving} onClick={onSave}>
                <Upload className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save training plan"}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </GlassCardSoft>
  );
}
