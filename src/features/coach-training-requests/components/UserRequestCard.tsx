import { Clock3, Download, Mail } from "lucide-react";

import { GlassCard, GlassCardSoft, GlassChip, GlassMetric } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  formatDate,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  statusLabelMap,
  statusVariantMap,
} from "../lib/coach-training-requests.utils";
import type { CoachTrainingRequest } from "../model/coach-training-request.model";
import RequestTextPanel from "./RequestTextPanel";

interface Props {
  downloadingRequestId: string | null;
  onDownloadTrainingPlan: () => void;
  request: CoachTrainingRequest;
}

export default function UserRequestCard({
  downloadingRequestId,
  onDownloadTrainingPlan,
  request,
}: Props) {
  const decisionDescription = getDecisionDescription(request);
  const isDownloading = downloadingRequestId === request.id;
  const trainingPlanDescription = getTrainingPlanDescription(request);
  const trainingPlanFileName = getTrainingPlanFileName(request);

  return (
    <GlassCard className="overflow-hidden">
      <CardHeader className="border-b border-white/50 pb-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                {request.coachName}
              </CardTitle>
              <Badge variant={statusVariantMap[request.status] ?? "secondary"} className="rounded-full">
                {statusLabelMap[request.status] ?? request.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              <GlassChip className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Coach
              </GlassChip>
              <GlassChip className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {formatDate(request.createdAt)}
              </GlassChip>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <GlassMetric
            label="Weekly sessions"
            value={`${request.weeklyTrainingCount}`}
            description="Requested weekly workout count."
          />
          <GlassMetric
            label="Location"
            value={request.preferredLocation}
            description="Preferred place for the training plan."
          />
          <GlassMetric
            label="Status"
            value={statusLabelMap[request.status] ?? request.status}
            description="Current state of your training request."
          />
        </div>

        <RequestTextPanel label="Your request description" value={request.requestDescription} />

        {decisionDescription ? <RequestTextPanel label="Status comment" value={decisionDescription} /> : null}

        {(request.status === "APPROVED" || request.status === "CLOSED") && trainingPlanDescription ? (
          <RequestTextPanel label="Training plan description" value={trainingPlanDescription} />
        ) : null}

        {(request.status === "APPROVED" || request.status === "CLOSED") && trainingPlanFileName ? (
          <GlassCardSoft>
            <CardContent className="p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Attached file</p>
              <p className="mt-3 text-slate-600">{trainingPlanFileName}</p>
            </CardContent>
          </GlassCardSoft>
        ) : null}

        {request.status === "CLOSED" ? (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isDownloading}
              onClick={onDownloadTrainingPlan}
              className="rounded-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download training plan"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </GlassCard>
  );
}
