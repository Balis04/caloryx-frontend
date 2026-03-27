import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3, Mail } from "lucide-react";
import {
  formatDate,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  statusLabelMap,
  statusVariantMap,
} from "../lib/coach-training-requests.utils";
import type { CoachTrainingRequest } from "../model/coach-training-request.model";

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
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{request.coachName}</CardTitle>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Trainer
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

      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-muted/20 p-4 text-sm">
            <p className="font-medium">Weekly sessions</p>
            <p className="mt-2 text-muted-foreground">{request.weeklyTrainingCount} sessions</p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-4 text-sm">
            <p className="font-medium">Preferred location</p>
            <p className="mt-2 text-muted-foreground">{request.preferredLocation}</p>
          </div>
          <div className="rounded-xl border bg-muted/20 p-4 text-sm">
            <p className="font-medium">Allapot</p>
            <p className="mt-2 text-muted-foreground">{statusLabelMap[request.status] ?? request.status}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4 text-sm">
          <p className="font-medium">Your request description</p>
          <p className="mt-2 leading-6 text-muted-foreground">{request.requestDescription}</p>
        </div>

        {decisionDescription && (
          <div className="rounded-xl border bg-background p-4 text-sm">
            <p className="font-medium">Statusz comment</p>
            <p className="mt-2 leading-6 text-muted-foreground">{decisionDescription}</p>
          </div>
        )}

        {(request.status === "APPROVED" || request.status === "CLOSED") &&
          trainingPlanDescription && (
            <div className="rounded-xl border bg-background p-4 text-sm">
              <p className="font-medium">Training plan description</p>
              <p className="mt-2 leading-6 text-muted-foreground">{trainingPlanDescription}</p>
            </div>
          )}

        {(request.status === "APPROVED" || request.status === "CLOSED") &&
          trainingPlanFileName && (
            <div className="rounded-xl border bg-background p-4 text-sm">
              <p className="font-medium">Attached file</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-muted-foreground">{trainingPlanFileName}</span>
              </div>
            </div>
          )}

        {request.status === "CLOSED" && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isDownloading}
              onClick={onDownloadTrainingPlan}
            >
              {isDownloading ? "Downloading..." : "Download training plan"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
