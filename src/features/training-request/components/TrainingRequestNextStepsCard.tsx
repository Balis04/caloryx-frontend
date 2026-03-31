import { GlassCard } from "@/components/caloriex";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrainingRequestNextStepsCard() {
  return (
    <GlassCard className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">What happens next?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p>
          The request is sent to the selected coach profile with your weekly session
          count, session length, preferred location, goal details, and description.
        </p>
        <p>
          After a successful submission, you will be redirected to the training requests
          page so you can immediately track the status of your request.
        </p>
      </CardContent>
    </GlassCard>
  );
}
