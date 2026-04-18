import type { LucideIcon } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

interface Props {
  description: string;
  icon: LucideIcon;
  message: string;
}

export default function FoodsEmptyState({ description, icon: Icon, message }: Props) {
  return (
    <GlassCard className="col-span-full">
      <CardContent className="space-y-3 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-500">
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-xl font-semibold text-slate-950">{message}</p>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </GlassCard>
  );
}
