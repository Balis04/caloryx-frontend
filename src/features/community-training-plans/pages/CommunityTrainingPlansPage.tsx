import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Clock3,
  Dumbbell,
  Orbit,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getCommunityTrainingPlanDownloadUrl,
  getCommunityTrainingPlans,
} from "../api/community-training-plans.api";
import type { CommunityTrainingPlan } from "../types/community-training-plan.types";

type PlanVariant = {
  key: "maintain" | "weightloss" | "bulk" | "generic";
  title: string;
  subtitle: string;
  badgeLabel: string;
  accentClassName: string;
  surfaceClassName: string;
  glowClassName: string;
  iconWrapClassName: string;
  badgeClassName: string;
  buttonClassName: string;
  icon: typeof ShieldCheck;
  signal: string;
  recommendedFor: string;
  highlights: string[];
};

const PLAN_VARIANTS: Record<PlanVariant["key"], PlanVariant> = {
  maintain: {
    key: "maintain",
    title: "Maintenance plan",
    subtitle: "Balanced weekly structure to maintain performance and recovery.",
    badgeLabel: "Maintenance",
    accentClassName: "from-emerald-400/30 via-cyan-300/10 to-slate-950/0",
    surfaceClassName: "border-emerald-300/40 bg-white/60",
    glowClassName: "bg-emerald-400/20",
    iconWrapClassName: "border-emerald-300/50 bg-emerald-100/70 text-emerald-950",
    badgeClassName: "border-emerald-400/40 bg-emerald-200/50 text-emerald-950",
    buttonClassName:
      "border-emerald-300/50 bg-emerald-100/80 text-emerald-950 hover:bg-emerald-200/90",
    icon: ShieldCheck,
    signal: "Stable output",
    recommendedFor: "Users who want consistency, recovery, and a steady weekly rhythm.",
    highlights: ["Recovery-friendly split", "Sustainable weekly volume", "Built for long-term adherence"],
  },
  weightloss: {
    key: "weightloss",
    title: "Weight loss plan",
    subtitle: "Higher activity volume with a clear structure for fat-loss phases.",
    badgeLabel: "Weight loss",
    accentClassName: "from-amber-300/35 via-orange-300/15 to-slate-950/0",
    surfaceClassName: "border-amber-300/40 bg-white/60",
    glowClassName: "bg-amber-300/20",
    iconWrapClassName: "border-amber-300/50 bg-amber-100/80 text-amber-950",
    badgeClassName: "border-amber-400/40 bg-amber-200/60 text-amber-950",
    buttonClassName:
      "border-amber-300/50 bg-amber-100/80 text-amber-950 hover:bg-amber-200/90",
    icon: TrendingDown,
    signal: "Lean phase",
    recommendedFor: "Users in a calorie deficit who still want structure and momentum.",
    highlights: ["More output per week", "Conditioning support", "Fat-loss friendly exercise flow"],
  },
  bulk: {
    key: "bulk",
    title: "Muscle gain plan",
    subtitle: "Progressive overload oriented split for gaining size and strength.",
    badgeLabel: "Bulk",
    accentClassName: "from-sky-300/30 via-cyan-300/15 to-slate-950/0",
    surfaceClassName: "border-sky-300/40 bg-white/60",
    glowClassName: "bg-sky-300/20",
    iconWrapClassName: "border-sky-300/50 bg-sky-100/80 text-sky-950",
    badgeClassName: "border-sky-400/40 bg-sky-200/55 text-sky-950",
    buttonClassName:
      "border-sky-300/50 bg-sky-100/80 text-sky-950 hover:bg-sky-200/90",
    icon: Dumbbell,
    signal: "Growth cycle",
    recommendedFor: "Users aiming for extra training volume, muscle gain, and stronger main lifts.",
    highlights: ["Hypertrophy-forward", "Extra working sets", "Strength and size emphasis"],
  },
  generic: {
    key: "generic",
    title: "Community plan",
    subtitle: "Download a ready-to-use public training plan assembled by the platform.",
    badgeLabel: "Community",
    accentClassName: "from-violet-300/30 via-cyan-300/10 to-slate-950/0",
    surfaceClassName: "border-slate-300/40 bg-white/60",
    glowClassName: "bg-cyan-300/20",
    iconWrapClassName: "border-slate-300/50 bg-slate-100/80 text-slate-950",
    badgeClassName: "border-slate-400/40 bg-slate-200/60 text-slate-950",
    buttonClassName:
      "border-slate-300/50 bg-slate-100/80 text-slate-950 hover:bg-slate-200/90",
    icon: ShieldCheck,
    signal: "Open access",
    recommendedFor: "Anyone who wants a fast starting point before moving to a custom plan.",
    highlights: ["Public PDF library", "Instant download", "Useful baseline structure"],
  },
};

const detectPlanVariant = (fileName: string): PlanVariant => {
  const normalized = fileName.toLowerCase();

  if (
    normalized.includes("weightloss") ||
    normalized.includes("weight-loss") ||
    normalized.includes("fatloss") ||
    normalized.includes("fat-loss") ||
    normalized.includes("weight") ||
    normalized.includes("loss") ||
    normalized.includes("cut")
  ) {
    return PLAN_VARIANTS.weightloss;
  }

  if (
    normalized.includes("maintain") ||
    normalized.includes("maintenance") ||
    normalized.includes("maintanence") ||
    normalized.includes("recomp")
  ) {
    return PLAN_VARIANTS.maintain;
  }

  if (
    normalized.includes("bulk") ||
    normalized.includes("gain") ||
    normalized.includes("muscle") ||
    normalized.includes("mass")
  ) {
    return PLAN_VARIANTS.bulk;
  }

  return PLAN_VARIANTS.generic;
};

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const getPlanCountLabel = (count: number) => `${count.toString().padStart(2, "0")} online`;

export default function CommunityTrainingPlansPage() {
  const [plans, setPlans] = useState<CommunityTrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPlans = async () => {
      try {
        const data = await getCommunityTrainingPlans();

        if (!isMounted) {
          return;
        }

        setPlans(data);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load community plans.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => {
        const order = ["maintain", "weightloss", "bulk", "generic"];

        return (
          order.indexOf(detectPlanVariant(a.fileName).key) -
          order.indexOf(detectPlanVariant(b.fileName).key)
        );
      }),
    [plans]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f7fb] text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.22),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.18),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(239,246,255,0.94))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-[10%] top-24 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute right-[12%] top-12 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

      <section className="relative border-b border-white/40">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-cyan-300/40 bg-white/65 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-700 backdrop-blur"
              >
                Community training plans
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-7xl">
                  Find the right training plan for maintenance, fat loss, or muscle gain.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Choose a ready-made community program and download it instantly. These plans
                  are meant to give users a clear starting point based on their current goal,
                  whether that is maintaining, cutting, or building muscle.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                  Instant PDF download
                </div>
                <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                  Goal-based presets
                </div>
                <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                  Community-ready programs
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-white/50 bg-white/55 shadow-[0_20px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="border-b border-white/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Signal board
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        Public plan library
                      </h2>
                    </div>
                    <div className="rounded-full border border-cyan-300/40 bg-cyan-100/60 p-3 text-slate-700">
                      <Orbit className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/60 bg-white/65 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Plans</p>
                    <p className="mt-3 text-3xl font-semibold">{getPlanCountLabel(sortedPlans.length)}</p>
                    <p className="mt-2 text-sm text-slate-600">Maintenance, fat loss, and muscle gain plans.</p>
                  </div>
                  <div className="rounded-2xl border border-white/60 bg-white/65 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Access</p>
                    <p className="mt-3 text-3xl font-semibold">Instant</p>
                    <p className="mt-2 text-sm text-slate-600">Download a PDF immediately and start training.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Card
                key={item}
                className="overflow-hidden border-white/60 bg-white/55 backdrop-blur-xl"
              >
                <div className="h-52 animate-pulse bg-slate-200/70" />
                <CardContent className="space-y-3 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200/70" />
                  <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200/70" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200/70" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-200/70 bg-white/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Community plans are currently unavailable</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {sortedPlans.map((plan) => {
              const variant = detectPlanVariant(plan.fileName);
              const Icon = variant.icon;

              return (
                <Card
                  key={plan.fileName}
                  className="group relative overflow-hidden border-white/60 bg-white/50 shadow-[0_22px_70px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_-28px_rgba(15,23,42,0.4)]"
                >
                  <div className={`absolute inset-x-8 top-6 h-24 rounded-full blur-3xl ${variant.glowClassName}`} />

                  <div className={`relative bg-gradient-to-br p-5 ${variant.accentClassName}`}>
                    <div
                      className={`rounded-[28px] border p-5 shadow-sm backdrop-blur-xl ${variant.surfaceClassName}`}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">
                            Goal focus
                          </p>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight">{variant.title}</h2>
                        </div>
                        <div
                          className={`rounded-2xl border p-3 shadow-sm backdrop-blur ${variant.iconWrapClassName}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-white/60 bg-white/60 p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                              Signal
                            </p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                              {variant.signal}
                            </p>
                          </div>
                          <Sparkles className="h-5 w-5 text-slate-500" />
                        </div>

                        <div className="grid gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-slate-700" />
                            <span>{variant.recommendedFor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge
                        variant="outline"
                        className={`w-fit border backdrop-blur ${variant.badgeClassName}`}
                      >
                        {variant.badgeLabel}
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        CalorieX community
                      </span>
                    </div>
                    <CardTitle className="text-2xl tracking-tight text-slate-950">
                      {variant.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-7 text-slate-600">
                      {variant.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-3">
                      {variant.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm text-slate-700 backdrop-blur"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-[22px] border border-white/70 bg-white/65 p-4 backdrop-blur">
                        <div className="mb-3 flex items-center gap-2 text-slate-500">
                          <Scale className="h-4 w-4" />
                          Size
                        </div>
                        <p className="text-lg font-semibold text-slate-950">
                          {formatFileSize(plan.size)}
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/70 bg-white/65 p-4 backdrop-blur">
                        <div className="mb-3 flex items-center gap-2 text-slate-500">
                          <Clock3 className="h-4 w-4" />
                          Updated
                        </div>
                        <p className="text-lg font-semibold text-slate-950">
                          {formatDate(plan.lastModified)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-dashed border-white/70 bg-white/55 p-4 text-sm text-slate-600 backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        Source file
                      </p>
                      <p className="mt-2 font-medium text-slate-900">{plan.fileName}</p>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      className={`h-12 w-full rounded-2xl border shadow-sm backdrop-blur ${variant.buttonClassName}`}
                    >
                      <a href={getCommunityTrainingPlanDownloadUrl(plan.downloadUrl)} download>
                        <ArrowDownToLine />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative container mx-auto px-6 pb-16">
        <Card className="overflow-hidden border-white/60 bg-white/50 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <CardContent className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Community downloads
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Start with a ready-made plan, then move to a custom one when you need more.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                These community PDFs are a quick entry point for users who want structure
                right away. They work well as a starting layer before choosing a coach and
                requesting a more personalized training plan.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[24px] border border-white/70 bg-white/65 p-4 text-sm text-slate-700 backdrop-blur">
                Maintenance: balanced volume for steady performance and recovery.
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/65 p-4 text-sm text-slate-700 backdrop-blur">
                Weight loss: higher output and structure for deficit phases.
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/65 p-4 text-sm text-slate-700 backdrop-blur">
                Bulk: extra workload and progression focus for muscle gain phases.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
