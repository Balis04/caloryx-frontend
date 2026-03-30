import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Clock3,
  Dumbbell,
  Orbit,
  Scale,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";

import {
  AccentButton,
  CaloriexPage,
  FeatureCard,
  GlassCard,
  GlassCardSoft,
  GlassChip,
  GlassMetric,
  HeroBadge,
} from "@/components/caloriex/design-system";
import {
  CardContent,
  CardHeader,
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
  eyebrow: string;
  tone: "emerald" | "amber" | "sky" | "slate";
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
    eyebrow: "Maintenance",
    tone: "emerald",
    icon: ShieldCheck,
    signal: "Stable output",
    recommendedFor: "Users who want consistency, recovery, and a steady weekly rhythm.",
    highlights: ["Recovery-friendly split", "Sustainable weekly volume", "Built for long-term adherence"],
  },
  weightloss: {
    key: "weightloss",
    title: "Weight loss plan",
    subtitle: "Higher activity volume with a clear structure for fat-loss phases.",
    eyebrow: "Weight loss",
    tone: "amber",
    icon: TrendingDown,
    signal: "Lean phase",
    recommendedFor: "Users in a calorie deficit who still want structure and momentum.",
    highlights: ["More output per week", "Conditioning support", "Fat-loss friendly exercise flow"],
  },
  bulk: {
    key: "bulk",
    title: "Muscle gain plan",
    subtitle: "Progressive overload oriented split for gaining size and strength.",
    eyebrow: "Bulk",
    tone: "sky",
    icon: Dumbbell,
    signal: "Growth cycle",
    recommendedFor: "Users aiming for extra training volume, muscle gain, and stronger main lifts.",
    highlights: ["Hypertrophy-forward", "Extra working sets", "Strength and size emphasis"],
  },
  generic: {
    key: "generic",
    title: "Community plan",
    subtitle: "Download a ready-to-use public training plan assembled by the platform.",
    eyebrow: "Community",
    tone: "slate",
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
    <CaloriexPage>
      <section className="relative border-b border-white/40">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <HeroBadge>Community training plans</HeroBadge>

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
                <GlassChip>Instant PDF download</GlassChip>
                <GlassChip>Goal-based presets</GlassChip>
                <GlassChip>Community-ready programs</GlassChip>
              </div>
            </div>

            <GlassCardSoft className="overflow-hidden">
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
                  <GlassMetric
                    label="Plans"
                    value={getPlanCountLabel(sortedPlans.length)}
                    description="Maintenance, fat loss, and muscle gain plans."
                  />
                  <GlassMetric
                    label="Access"
                    value="Instant"
                    description="Download a PDF immediately and start training."
                  />
                </div>
              </CardContent>
            </GlassCardSoft>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <GlassCard
                key={item}
                className="overflow-hidden bg-white/55"
              >
                <div className="h-52 animate-pulse bg-slate-200/70" />
                <CardContent className="space-y-3 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200/70" />
                  <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200/70" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200/70" />
                </CardContent>
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <GlassCard className="border-red-200/70 bg-white/70">
            <CardHeader>
              <h2 className="text-2xl font-semibold tracking-tight">Community plans are currently unavailable</h2>
              <p className="text-sm text-slate-600">{error}</p>
            </CardHeader>
          </GlassCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {sortedPlans.map((plan) => {
              const variant = detectPlanVariant(plan.fileName);

              return (
                <FeatureCard
                  key={plan.fileName}
                  eyebrow={variant.eyebrow}
                  title={variant.title}
                  description={variant.subtitle}
                  signal={variant.signal}
                  points={variant.highlights}
                  tone={variant.tone}
                  icon={variant.icon}
                  metaLabel="CalorieX community"
                  action={
                    <AccentButton asChild tone={variant.tone}>
                      <a href={getCommunityTrainingPlanDownloadUrl(plan.downloadUrl)} download>
                        <ArrowDownToLine />
                        Download PDF
                      </a>
                    </AccentButton>
                  }
                >
                  <div className="rounded-[24px] border border-white/60 bg-white/60 p-5 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-slate-700" />
                      <span>{variant.recommendedFor}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="cx-glass-block rounded-[22px] p-4">
                      <div className="mb-3 flex items-center gap-2 text-slate-500">
                        <Scale className="h-4 w-4" />
                        Size
                      </div>
                      <p className="text-lg font-semibold text-slate-950">
                        {formatFileSize(plan.size)}
                      </p>
                    </div>
                    <div className="cx-glass-block rounded-[22px] p-4">
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
                </FeatureCard>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative container mx-auto px-6 pb-16">
        <GlassCardSoft>
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
              <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                Maintenance: balanced volume for steady performance and recovery.
              </div>
              <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                Weight loss: higher output and structure for deficit phases.
              </div>
              <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                Bulk: extra workload and progression focus for muscle gain phases.
              </div>
            </div>
          </CardContent>
        </GlassCardSoft>
      </section>
    </CaloriexPage>
  );
}
