import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClipboardList } from "lucide-react";
import { REGISTER_STEP_COUNT, REGISTER_STEP_META } from "../lib/register.steps";

interface Props {
  step: number;
}

export function RegisterProgressPanel({ step }: Props) {
  const progressValue = (step / REGISTER_STEP_COUNT) * 100;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressValue} className="h-2.5" />
        <div className="space-y-3 text-sm">
          {REGISTER_STEP_META.map((item, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === step;
            const isDone = stepNumber < step;

            return (
              <div key={item.title} className="rounded-xl border bg-muted/20 p-3">
                <p className="font-medium">
                  {stepNumber}. {item.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
                <Badge
                  variant={isActive || isDone ? "default" : "outline"}
                  className="mt-3"
                >
                  {isDone ? "Completed" : isActive ? "Current" : "Upcoming"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
