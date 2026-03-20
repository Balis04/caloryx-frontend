import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import type { ApprovedRequestDraft, TrainingRequestResponse } from "../types/training-requests.types";
import { openFile } from "../utils/training-requests.utils";

interface Props {
  draft: ApprovedRequestDraft;
  isExpanded: boolean;
  isSaving: boolean;
  onDraftChange: (draft: ApprovedRequestDraft) => void;
  onSave: () => void;
  onToggle: () => void;
  request: TrainingRequestResponse;
}

export default function TrainingPlanEditor({
  draft,
  isExpanded,
  isSaving,
  onDraftChange,
  onSave,
  onToggle,
}: Props) {
  const hasExistingFile = Boolean(draft.existingFileName || draft.existingFileUrl);

  return (
    <div className="space-y-4 rounded-xl border bg-background p-4 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Training plan</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add the training plan name and description, then upload a PDF or DOCX file for the user.
          </p>
        </div>
        <Button type="button" variant={isExpanded ? "secondary" : "outline"} className="gap-2" onClick={onToggle}>
          <FileText className="h-4 w-4" />
          {isExpanded ? "Close editor" : "Upload training plan"}
        </Button>
      </div>

      {draft.description && !isExpanded && (
        <div className="rounded-lg border bg-muted/20 p-3">
          {draft.planName && <p className="font-medium text-foreground">{draft.planName}</p>}
          <p className="font-medium">Training plan description</p>
          <p className="mt-2 leading-6 text-muted-foreground">{draft.description}</p>
        </div>
      )}

      {(draft.existingFileName || draft.file) && !isExpanded && (
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="font-medium">Current file</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground">{draft.file?.name || draft.existingFileName}</span>
            {draft.existingFileUrl && (
              <Button type="button" variant="outline" size="sm" onClick={() => openFile(draft.existingFileUrl)}>
                Open
              </Button>
            )}
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="training-plan-name" className="font-medium">
              Training plan name
            </label>
            <Input
              id="training-plan-name"
              type="text"
              value={draft.planName}
              onChange={(event) => onDraftChange({ ...draft, planName: event.target.value })}
              disabled={isSaving}
              placeholder="Enter a name for the training plan."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="training-plan-description" className="font-medium">
              Training plan description
            </label>
            <textarea
              id="training-plan-description"
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Briefly describe what the training plan contains."
              value={draft.description}
              onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="training-plan-file" className="font-medium">
              PDF or DOCX file
            </label>
            <Input
              id="training-plan-file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => onDraftChange({ ...draft, file: event.target.files?.[0] ?? null })}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">Accepted formats: `.pdf`, `.docx`</p>
          </div>

          {(hasExistingFile || draft.file) && (
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="font-medium">Selected or current file</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-muted-foreground">{draft.file?.name || draft.existingFileName}</span>
                {!draft.file && draft.existingFileUrl && (
                  <Button type="button" variant="outline" size="sm" onClick={() => openFile(draft.existingFileUrl)}>
                    Open
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" className="gap-2" disabled={isSaving} onClick={onSave}>
              <Upload className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save training plan"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
