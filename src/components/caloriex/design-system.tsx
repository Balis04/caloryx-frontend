import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AccentTone =
  | "emerald"
  | "rose"
  | "violet"
  | "sky"
  | "amber"
  | "slate";

type AccentClasses = {
  accent: string;
  surface: string;
  glow: string;
  iconWrap: string;
  badge: string;
  button: string;
};

const ACCENT_STYLES: Record<AccentTone, AccentClasses> = {
  emerald: {
    accent: "from-emerald-400/30 via-cyan-300/10 to-slate-950/0",
    surface: "border-emerald-300/40 bg-white/60",
    glow: "bg-emerald-400/20",
    iconWrap: "border-emerald-300/50 bg-emerald-100/70 text-emerald-950",
    badge: "border-emerald-400/40 bg-emerald-200/50 text-emerald-950",
    button: "border-emerald-300/50 bg-emerald-100/80 text-emerald-950 hover:bg-emerald-200/90",
  },
  rose: {
    accent: "from-rose-300/30 via-amber-300/10 to-slate-950/0",
    surface: "border-rose-300/40 bg-white/60",
    glow: "bg-rose-300/20",
    iconWrap: "border-rose-300/50 bg-rose-100/75 text-rose-950",
    badge: "border-rose-400/40 bg-rose-200/50 text-rose-950",
    button: "border-rose-300/50 bg-rose-100/80 text-rose-950 hover:bg-rose-200/90",
  },
  violet: {
    accent: "from-violet-300/30 via-sky-300/10 to-slate-950/0",
    surface: "border-violet-300/40 bg-white/60",
    glow: "bg-violet-300/20",
    iconWrap: "border-violet-300/50 bg-violet-100/75 text-violet-950",
    badge: "border-violet-400/40 bg-violet-200/50 text-violet-950",
    button: "border-violet-300/50 bg-violet-100/80 text-violet-950 hover:bg-violet-200/90",
  },
  sky: {
    accent: "from-sky-300/30 via-cyan-300/15 to-slate-950/0",
    surface: "border-sky-300/40 bg-white/60",
    glow: "bg-sky-300/20",
    iconWrap: "border-sky-300/50 bg-sky-100/80 text-sky-950",
    badge: "border-sky-400/40 bg-sky-200/55 text-sky-950",
    button: "border-sky-300/50 bg-sky-100/80 text-sky-950 hover:bg-sky-200/90",
  },
  amber: {
    accent: "from-amber-300/35 via-orange-300/15 to-slate-950/0",
    surface: "border-amber-300/40 bg-white/60",
    glow: "bg-amber-300/20",
    iconWrap: "border-amber-300/50 bg-amber-100/80 text-amber-950",
    badge: "border-amber-400/40 bg-amber-200/60 text-amber-950",
    button: "border-amber-300/50 bg-amber-100/80 text-amber-950 hover:bg-amber-200/90",
  },
  slate: {
    accent: "from-violet-300/30 via-cyan-300/10 to-slate-950/0",
    surface: "border-slate-300/40 bg-white/60",
    glow: "bg-cyan-300/20",
    iconWrap: "border-slate-300/50 bg-slate-100/80 text-slate-950",
    badge: "border-slate-400/40 bg-slate-200/60 text-slate-950",
    button: "border-slate-300/50 bg-slate-100/80 text-slate-950 hover:bg-slate-200/90",
  },
};

export function CaloriexPage({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("cx-page", className)} {...props}>
      <div className="cx-orb-left" />
      <div className="cx-orb-right" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function HeroBadge({
  className,
  ...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
  return <Badge {...props} variant="outline" className={cn("cx-hero-badge", className)} />;
}

export function GlassCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("cx-glass-card", className)} {...props} />;
}

export function GlassCardSoft({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("cx-glass-card-soft", className)} {...props} />;
}

export function GlassMetric({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="cx-glass-block p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export function GlassChip({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("cx-chip", className)} {...props} />;
}

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

export function AccentButton({
  tone,
  className,
  ...props
}: { tone: AccentTone } & Omit<ButtonProps, "variant">) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        "h-12 w-full rounded-2xl border shadow-sm backdrop-blur",
        ACCENT_STYLES[tone].button,
        className
      )}
    />
  );
}
