import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { GlassCard } from "./GlassCard";

const TONE_STYLES = {
  neutral: "border-white/70 bg-white/60 text-slate-700",
  success: "border-emerald-300/70 bg-emerald-50/70 text-emerald-800",
  danger: "border-red-300/70 bg-red-50/70 text-red-700",
} as const;

export function NoticeCard({
  children,
  tone = "neutral",
  className,
}: {
  children: string;
  tone?: keyof typeof TONE_STYLES;
  className?: string;
}) {
  return (
    <GlassCard className={cn(TONE_STYLES[tone], className)}>
      <CardContent className="p-4 text-sm">{children}</CardContent>
    </GlassCard>
  );
}
