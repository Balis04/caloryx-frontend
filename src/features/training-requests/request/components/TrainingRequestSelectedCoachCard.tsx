import { Mail } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CoachCardData } from "../types/coach.types";

export default function TrainingRequestSelectedCoachCard({
  selectedCoach,
}: {
  selectedCoach: CoachCardData | null;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">Selected coach</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {selectedCoach ? (
          <>
            <div className="cx-glass-block rounded-[24px] p-4">
              <p className="font-medium text-slate-950">{selectedCoach.fullName}</p>
              <p className="mt-2 flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4" />
                {selectedCoach.email}
              </p>
            </div>
            <p className="leading-7 text-slate-600">{selectedCoach.bio}</p>
            <div className="flex flex-wrap gap-2">
              {selectedCoach.availabilitySlots.map((slot) => (
                <Badge
                  key={slot}
                  variant="outline"
                  className="border-white/70 bg-white/60 text-slate-700"
                >
                  {slot}
                </Badge>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/70 bg-white/55 p-4 text-slate-600 backdrop-blur">
            The selected coach could not be found. Go back to the list and choose again.
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
}
