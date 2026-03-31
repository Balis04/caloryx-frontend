import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { GlassCard } from "../primitives/GlassCard";
import { ACCENT_STYLES, type AccentTone } from "../theme/accent-tones";

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  signal: string;
  points: string[];
  tone: AccentTone;
  icon: LucideIcon;
  metaLabel?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function FeatureCard({
  eyebrow,
  title,
  description,
  signal,
  points,
  tone,
  icon: Icon,
  metaLabel,
  action,
  children,
}: FeatureCardProps) {
  const accent = ACCENT_STYLES[tone];

  return (
    <GlassCard className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_-28px_rgba(15,23,42,0.4)]">
      <div className={cn("absolute inset-x-8 top-6 h-24 rounded-full blur-3xl", accent.glow)} />

      <div className={cn("relative bg-gradient-to-br p-5", accent.accent)}>
        <div className={cn("rounded-[28px] border p-5 shadow-sm backdrop-blur-xl", accent.surface)}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
            </div>
            <div className={cn("rounded-2xl border p-3 shadow-sm backdrop-blur", accent.iconWrap)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/60 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Signal</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{signal}</p>
              </div>
              <Sparkles className="h-5 w-5 text-slate-500" />
            </div>
            <p className="text-sm leading-7 text-slate-600">{description}</p>
          </div>
        </div>
      </div>

      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className={cn("w-fit border backdrop-blur", accent.badge)}>
            {eyebrow}
          </Badge>
          {metaLabel ? (
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{metaLabel}</span>
          ) : null}
        </div>
        <CardTitle className="text-2xl tracking-tight text-slate-950">{title}</CardTitle>
        <CardDescription className="text-sm leading-7 text-slate-600">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3">
          {points.map((point) => (
            <div
              key={point}
              className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm text-slate-700 backdrop-blur"
            >
              {point}
            </div>
          ))}
        </div>

        {children}

        {action ? action : null}
      </CardContent>
    </GlassCard>
  );
}
