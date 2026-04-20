import { ArrowDownToLine, Clock3, Scale } from "lucide-react";

import { AccentButton, FeatureCard, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import { getCommunityTrainingPlanDownloadUrl } from "../api/community-training-plans.api";
import {
  detectCommunityPlanVariant,
  formatCommunityPlanDate,
  formatCommunityPlanFileSize,
} from "../lib/community-training-plans.formatters";
import type { CommunityTrainingPlan } from "../types";

interface CommunityPlansGridProps {
  isLoading: boolean;
  plans: CommunityTrainingPlan[];
}

export default function CommunityPlansGrid({
  isLoading,
  plans,
}: CommunityPlansGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <GlassCard key={item} className="overflow-hidden bg-white/55">
            <div className="h-52 animate-pulse bg-slate-200/70" />
            <CardContent className="space-y-3 p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200/70" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200/70" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200/70" />
            </CardContent>
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => {
        const variant = detectCommunityPlanVariant(plan.fileName);

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
                  {formatCommunityPlanFileSize(plan.size)}
                </p>
              </div>
              <div className="cx-glass-block rounded-[22px] p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  Updated
                </div>
                <p className="text-lg font-semibold text-slate-950">
                  {formatCommunityPlanDate(plan.lastModified)}
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
  );
}

