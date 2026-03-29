import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
} from "../model/coach-training-request.model";

interface Props {
  isCoach: boolean;
  showCoachIncomingRequests: boolean;
  coachRequestFilter: CoachRequestFilter;
  coachViewMode: CoachRequestViewMode;
  onFilterChange: (value: CoachRequestFilter) => void;
  onViewModeChange: (value: CoachRequestViewMode) => void;
}

export default function TrainingRequestsHeader({
  isCoach,
  showCoachIncomingRequests,
  coachRequestFilter,
  coachViewMode,
  onFilterChange,
  onViewModeChange,
}: Props) {
  const pageDescription = showCoachIncomingRequests
    ? "Here you can see the training plan requests sent to you."
    : "Here you can see the training plan requests you have sent and their status.";

  return (
    <CardHeader className="border-b">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ArrowRightLeft className="h-6 w-6" />
              Training Requests
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{pageDescription}</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {showCoachIncomingRequests ? "Coach view" : "User view"}
          </Badge>
        </div>

        {isCoach && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant={coachViewMode === "coach" ? "default" : "outline"}
              onClick={() => onViewModeChange("coach")}
            >
              Coach view
            </Button>
            <Button
              variant={coachViewMode === "user" ? "default" : "outline"}
              onClick={() => onViewModeChange("user")}
            >
              User view
            </Button>
          </div>
        )}

        {showCoachIncomingRequests && (
          <Tabs value={coachRequestFilter} onValueChange={(value) => onFilterChange(value as CoachRequestFilter)}>
            <TabsList className="flex h-auto w-full max-w-2xl flex-row gap-1 p-1">
              <TabsTrigger value="pending" className="flex-1">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex-1">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex-1">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex-1">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
    </CardHeader>
  );
}
