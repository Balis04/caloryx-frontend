import { ArrowRightLeft } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    ? "Incoming requests sent to you by users who need a training plan."
    : "Requests you sent out and the current response state for each one.";

  return (
    <GlassCard>
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-cyan-300/40 bg-cyan-100/60 p-3 text-slate-700">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Training requests
                </h2>
                <p className="mt-1 text-sm text-slate-600">{pageDescription}</p>
              </div>
            </div>
          </div>

          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            {showCoachIncomingRequests ? "Coach view" : "User view"}
          </Badge>
        </div>

        {isCoach ? (
          <div className="flex flex-wrap gap-3">
            <Button
              variant={coachViewMode === "coach" ? "default" : "outline"}
              onClick={() => onViewModeChange("coach")}
              className="rounded-full"
            >
              Coach view
            </Button>
            <Button
              variant={coachViewMode === "user" ? "default" : "outline"}
              onClick={() => onViewModeChange("user")}
              className="rounded-full"
            >
              User view
            </Button>
          </div>
        ) : null}

        {showCoachIncomingRequests ? (
          <Tabs
            value={coachRequestFilter}
            onValueChange={(value) => onFilterChange(value as CoachRequestFilter)}
          >
            <TabsList className="grid h-auto w-full gap-2 rounded-[24px] border border-white/60 bg-slate-100/60 p-2 sm:grid-cols-2 xl:grid-cols-4">
              <TabsTrigger value="pending" className="rounded-[18px] py-3">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-[18px] py-3">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-[18px] py-3">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="closed" className="rounded-[18px] py-3">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : null}
      </CardContent>
    </GlassCard>
  );
}
