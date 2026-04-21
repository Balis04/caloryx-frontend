import { Check, Clock3, Download, Mail, UserRound, X } from "lucide-react";

import { GlassCard, GlassCardSoft, GlassChip } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  formatDate,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
  statusLabelMap,
  statusVariantMap,
} from "../lib/training-requests.helpers";
import type {
  CoachRequestFilter,
  CoachTrainingRequest,
  TrainingPlanDraft,
} from "@/features/training-requests/types";
import RequestTextPanel from "./RequestTextPanel";
import TrainingPlanEditor from "./TrainingPlanEditor";
import TrainingRequestInformations from "./TrainingRequestInformations";

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

export default function CoachRequestCard(props: Props) {
  const {
    approvedDraft, decisionDescription, downloadingRequestId, expandedApprovedRequestId,
    filter, onApprovedDraftChange, onDownloadTrainingPlan, onDecisionDescriptionChange,
    onSaveTrainingPlan, onStatusChange, onToggleTrainingPlanEditor, request,
    savingApprovedRequestId, updatingRequestId,
  } = props;
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
    <GlassCard className="overflow-hidden">
      <CardHeader className="border-b border-white/50 pb-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                {request.requesterName}
              </CardTitle>
              <Badge variant={statusVariantMap[request.status] ?? "secondary"} className="rounded-full">
                {statusLabelMap[request.status] ?? request.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              <GlassChip className="flex items-center gap-2"><UserRound className="h-4 w-4" />Client</GlassChip>
              <GlassChip className="flex items-center gap-2"><Mail className="h-4 w-4" />{request.requesterEmail}</GlassChip>
              <GlassChip className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{formatDate(request.createdAt)}</GlassChip>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <TrainingRequestInformations request={request} />
        <div className="grid gap-4 xl:grid-cols-2">
          <RequestTextPanel label="Client note" value={request.requestDescription} />
          <RequestTextPanel label="Status comment" value={decisionDescription || "No status comment yet."} />
        </div>
        {isClosedTab ? (
          <>
            {getTrainingPlanName(request) ? <RequestTextPanel label="Training plan name" value={getTrainingPlanName(request)} /> : null}
            {getTrainingPlanDescription(request) ? <RequestTextPanel label="Training plan description" value={getTrainingPlanDescription(request)} /> : null}
            <GlassCardSoft>
              <CardContent className="p-5 text-sm">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Training plan file</p>
                <div className="mt-4 space-y-2 text-slate-600">
                  {getTrainingPlanFileName(request) ? <p>File name: {getTrainingPlanFileName(request)}</p> : null}
                  {request.uploadedAt ? <p>Uploaded: {formatDate(request.uploadedAt)}</p> : null}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button type="button" variant="outline" disabled={isDownloading} onClick={onDownloadTrainingPlan} className="rounded-full">
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download training plan"}
                  </Button>
                </div>
              </CardContent>
            </GlassCardSoft>
          </>
        ) : null}
        {!isApprovedTab && !isClosedTab ? (
          <>
            <GlassCardSoft>
              <CardContent className="p-5 text-sm">
                <label htmlFor={`decision-description-${request.id}`} className="text-xs uppercase tracking-[0.32em] text-slate-500">Status comment *</label>
                <textarea id={`decision-description-${request.id}`} className="mt-3 min-h-28 w-full rounded-3xl border border-white/70 bg-white/80 px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Explain why you approved or rejected the request." value={decisionDescription} onChange={(event) => onDecisionDescriptionChange(event.target.value)} disabled={isUpdating} />
                <p className="mt-3 text-xs text-slate-500">A comment is required when changing the status, and the user will be able to see it.</p>
              </CardContent>
            </GlassCardSoft>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="gap-2 rounded-full" disabled={isUpdating || !canSubmit || !canReject} onClick={() => onStatusChange("REJECTED")}><X className="h-4 w-4" />{isUpdating ? "Updating..." : "Reject"}</Button>
              <Button className="gap-2 rounded-full" disabled={isUpdating || !canSubmit || !canApprove} onClick={() => onStatusChange("APPROVED")}><Check className="h-4 w-4" />{isUpdating ? "Updating..." : "Approve"}</Button>
            </div>
          </>
        ) : null}
        {isApprovedTab ? <TrainingPlanEditor draft={approvedDraft} isExpanded={isExpanded} isSaving={isSavingApprovedContent} onDraftChange={onApprovedDraftChange} onSave={onSaveTrainingPlan} onToggle={onToggleTrainingPlanEditor} request={request} /> : null}
      </CardContent>
    </GlassCard>
  );
}

