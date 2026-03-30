import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Clock3,
  Dumbbell,
  Scale,
  ShieldCheck,
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
  icon: typeof ShieldCheck;
};

const PLAN_VARIANTS: Record<PlanVariant["key"], PlanVariant> = {
  maintain: {
    key: "maintain",
    title: "Maintenance plan",
    subtitle: "Balanced weekly structure to maintain performance and recovery.",
    badgeLabel: "Maintenance",
    accentClassName: "from-emerald-500/20 via-teal-500/10 to-transparent",
    surfaceClassName: "border-emerald-200 bg-emerald-50/70",
    icon: ShieldCheck,
  },
  weightloss: {
    key: "weightloss",
    title: "Weight loss plan",
    subtitle: "Higher activity volume with a clear structure for fat-loss phases.",
    badgeLabel: "Weight loss",
    accentClassName: "from-orange-500/20 via-amber-500/10 to-transparent",
    surfaceClassName: "border-orange-200 bg-orange-50/70",
    icon: TrendingDown,
  },
  bulk: {
    key: "bulk",
    title: "Muscle gain plan",
    subtitle: "Progressive overload oriented split for gaining size and strength.",
    badgeLabel: "Bulk",
    accentClassName: "from-sky-500/20 via-cyan-500/10 to-transparent",
    surfaceClassName: "border-sky-200 bg-sky-50/70",
    icon: Dumbbell,
  },
  generic: {
    key: "generic",
    title: "Community plan",
    subtitle: "Download a ready-to-use public training plan assembled by the platform.",
    badgeLabel: "Community",
    accentClassName: "from-slate-500/20 via-slate-400/10 to-transparent",
    surfaceClassName: "border-slate-200 bg-slate-50/70",
    icon: ShieldCheck,
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
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-slate-100 via-background to-background">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl space-y-5">
            <Badge variant="outline" className="bg-background/80">
              Public training library
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Ready-made training plans you can download right away.
            </h1>
            <p className="text-lg text-muted-foreground">
              Pick the goal that fits your current phase and start with a pre-generated PDF.
              Each plan is public, instant to download, and designed to give users a fast
              starting point before requesting custom coaching.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="h-40 animate-pulse bg-muted" />
                <CardContent className="space-y-3 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive/30">
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
                  className="group overflow-hidden border-border/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`bg-gradient-to-br p-5 ${variant.accentClassName}`}>
                    <div
                      className={`rounded-2xl border p-5 shadow-sm backdrop-blur ${variant.surfaceClassName}`}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                            Goal focus
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold">{variant.title}</h2>
                        </div>
                        <div className="rounded-full bg-background/80 p-3">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed bg-background/80 p-5">
                        <div className="grid gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-foreground/70" />
                            <span>{variant.subtitle}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-foreground/70" />
                            <span>Ready-made PDF you can download immediately.</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-foreground/70" />
                            <span>Good starting point before requesting a custom coach plan.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="space-y-3">
                    <Badge variant="secondary" className="w-fit">
                      {variant.badgeLabel}
                    </Badge>
                    <CardTitle className="text-2xl">{variant.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {variant.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border bg-muted/40 p-3">
                        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                          <Scale className="h-4 w-4" />
                          Size
                        </div>
                        <p className="font-medium text-foreground">{formatFileSize(plan.size)}</p>
                      </div>
                      <div className="rounded-xl border bg-muted/40 p-3">
                        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                          <Clock3 className="h-4 w-4" />
                          Updated
                        </div>
                        <p className="font-medium text-foreground">{formatDate(plan.lastModified)}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
                      File: <span className="font-medium text-foreground">{plan.fileName}</span>
                    </div>

                    <Button asChild className="w-full">
                      <a
                        href={getCommunityTrainingPlanDownloadUrl(plan.downloadUrl)}
                        download
                      >
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
    </div>
  );
}
