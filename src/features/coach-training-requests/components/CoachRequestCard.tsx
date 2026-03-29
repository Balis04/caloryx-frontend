import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock3, Mail, UserRound, X } from "lucide-react";
import {
  formatDate,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
  statusLabelMap,
  statusVariantMap,
} from "../lib/coach-training-requests.utils";
import type {
  CoachRequestFilter,
  CoachTrainingRequest,
  TrainingPlanDraft,
} from "../model/coach-training-request.model";
import RequestTextPanel from "./RequestTextPanel";
import TrainingPlanEditor from "./TrainingPlanEditor";
import TrainingRequestMetrics from "./TrainingRequestMetrics";

interface Props {
  approvedDraft: TrainingPlanDraft;
  decisionDescription: string;
  downloadingRequestId: string | null;
  expandedApprovedRequestId: string | null;
  filter: CoachRequestFilter;
  onApprovedDraftChange: (draft: TrainingPlanDraft) => void;
  onDownloadTrainingPlan: () => void;
  onDecisionDescriptionChange: (value: string) => void;
  onSaveTrainingPlan: () => void;
  onStatusChange: (status: "APPROVED" | "REJECTED") => void;
  onToggleTrainingPlanEditor: () => void;
  request: CoachTrainingRequest;
  savingApprovedRequestId: string | null;
  updatingRequestId: string | null;
}

export default function CoachRequestCard({
  approvedDraft,
  decisionDescription,
  downloadingRequestId,
  expandedApprovedRequestId,
  filter,
  onApprovedDraftChange,
  onDownloadTrainingPlan,
  onDecisionDescriptionChange,
  onSaveTrainingPlan,
  onStatusChange,
  onToggleTrainingPlanEditor,
  request,
  savingApprovedRequestId,
  updatingRequestId,
}: Props) {
  const isApprovedTab = filter === "approved";
  const isClosedTab = filter === "closed";
  const isExpanded = expandedApprovedRequestId === request.id;
  const isSavingApprovedContent = savingApprovedRequestId === request.id;
  const isDownloading = downloadingRequestId === request.id;
  const isUpdating = updatingRequestId === request.id;
  const canSubmit = decisionDescription.trim().length > 0;
  const canReject = request.status === "PENDING" || request.status === "APPROVED";
  const canApprove = request.status === "PENDING" || request.status === "REJECTED";

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{request.requesterName}</CardTitle>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Client
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {request.requesterEmail}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {formatDate(request.createdAt)}
              </span>
            </div>
          </div>
          <Badge variant={statusVariantMap[request.status] ?? "secondary"}>
            {statusLabelMap[request.status] ?? request.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <TrainingRequestMetrics request={request} />
        <RequestTextPanel label="Client note" value={request.requestDescription} />
        <RequestTextPanel
          label="Statusz comment"
          value={decisionDescription || "No status comment yet."}
        />

        {isClosedTab && (
          <>
            {getTrainingPlanName(request) && (
              <RequestTextPanel label="Training plan name" value={getTrainingPlanName(request)} />
            )}
            {getTrainingPlanDescription(request) && (
              <RequestTextPanel
                label="Training plan description"
                value={getTrainingPlanDescription(request)}
              />
            )}
            <div className="rounded-xl border bg-background p-4 text-sm">
              <p className="font-medium">Training plan fajl</p>
              <div className="mt-2 space-y-2 text-muted-foreground">
                {getTrainingPlanFileName(request) && <p>File name: {getTrainingPlanFileName(request)}</p>}
                {request.uploadedAt && <p>Uploaded: {formatDate(request.uploadedAt)}</p>}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDownloading}
                  onClick={onDownloadTrainingPlan}
                >
                  {isDownloading ? "Downloading..." : "Download training plan"}
                </Button>
              </div>
            </div>
          </>
        )}

        {!isApprovedTab && !isClosedTab && (
          <>
            <div className="rounded-xl border bg-background p-4 text-sm">
              <label htmlFor={`decision-description-${request.id}`} className="font-medium">
                Statusz comment
              </label>
              <textarea
                id={`decision-description-${request.id}`}
                className="mt-2 min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Explain why you approved or rejected the request."
                value={decisionDescription}
                onChange={(event) => onDecisionDescriptionChange(event.target.value)}
                disabled={isUpdating}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                A comment is required when changing the status, and the user will be able to see it.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="gap-2"
                disabled={isUpdating || !canSubmit || !canReject}
                onClick={() => onStatusChange("REJECTED")}
              >
                <X className="h-4 w-4" />
                {isUpdating ? "Updating..." : "Reject"}
              </Button>
              <Button
                className="gap-2"
                disabled={isUpdating || !canSubmit || !canApprove}
                onClick={() => onStatusChange("APPROVED")}
              >
                <Check className="h-4 w-4" />
                {isUpdating ? "Updating..." : "Approve"}
              </Button>
            </div>
          </>
        )}

        {isApprovedTab && (
          <TrainingPlanEditor
            draft={approvedDraft}
            isExpanded={isExpanded}
            isSaving={isSavingApprovedContent}
            onDraftChange={onApprovedDraftChange}
            onSave={onSaveTrainingPlan}
            onToggle={onToggleTrainingPlanEditor}
            request={request}
          />
        )}
      </CardContent>
    </Card>
  );
}
