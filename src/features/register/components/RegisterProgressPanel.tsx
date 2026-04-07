import { GlassCard } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClipboardList } from "lucide-react";
import { REGISTER_STEP_COUNT, REGISTER_STEP_META } from "../lib/register.steps";

interface Props {
  step: number;
}

export function RegisterProgressPanel({ step }: Props) {
  const progressValue = (step / REGISTER_STEP_COUNT) * 100;

  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 pt-6">
          <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Progress
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Registration steps
            </h3>
          </div>
        </div>
        <Progress value={progressValue} className="h-2.5" />
        <div className="space-y-3 text-sm">
          {REGISTER_STEP_META.map((item, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === step;
            const isDone = stepNumber < step;

            return (
              <div
                key={item.title}
                className="cx-glass-block rounded-[24px] border border-white/50 p-4"
              >
                <p className="font-medium text-slate-950">
                  {stepNumber}. {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {item.description}
                </p>
                <Badge
                  variant={isActive || isDone ? "default" : "outline"}
                  className="mt-3 rounded-full"
                >
                  {isDone ? "Completed" : isActive ? "Current" : "Upcoming"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </GlassCard>
  );
}
