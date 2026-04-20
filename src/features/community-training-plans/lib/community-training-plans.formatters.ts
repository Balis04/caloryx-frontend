import { Dumbbell, ShieldCheck, TrendingDown, type LucideIcon } from "lucide-react";

export type CommunityPlanVariant = {
  key: "maintain" | "weightloss" | "bulk" | "generic";
  title: string;
  subtitle: string;
  eyebrow: string;
  tone: "emerald" | "amber" | "sky" | "slate";
  icon: LucideIcon;
  signal: string;
  recommendedFor: string;
  highlights: string[];
};

export const COMMUNITY_PLAN_VARIANTS: Record<
  CommunityPlanVariant["key"],
  CommunityPlanVariant
> = {
  maintain: {
    key: "maintain",
    title: "Maintenance plan",
    subtitle: "Balanced weekly structure to maintain performance and recovery.",
    eyebrow: "Maintenance",
    tone: "emerald",
    icon: ShieldCheck,
    signal: "Stable output",
    recommendedFor: "Users who want consistency, recovery, and a steady weekly rhythm.",
    highlights: [
      "Recovery-friendly split",
      "Sustainable weekly volume",
      "Built for long-term adherence",
    ],
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
    highlights: [
      "More output per week",
      "Conditioning support",
      "Fat-loss friendly exercise flow",
    ],
  },
  bulk: {
    key: "bulk",
    title: "Muscle gain plan",
    subtitle: "Progressive overload oriented split for gaining size and strength.",
    eyebrow: "Bulk",
    tone: "sky",
    icon: Dumbbell,
    signal: "Growth cycle",
    recommendedFor:
      "Users aiming for extra training volume, muscle gain, and stronger main lifts.",
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
    recommendedFor:
      "Anyone who wants a fast starting point before moving to a custom plan.",
    highlights: ["Public PDF library", "Instant download", "Useful baseline structure"],
  },
};

export const detectCommunityPlanVariant = (fileName: string): CommunityPlanVariant => {
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
    return COMMUNITY_PLAN_VARIANTS.weightloss;
  }

  if (
    normalized.includes("maintain") ||
    normalized.includes("maintenance") ||
    normalized.includes("maintanence") ||
    normalized.includes("recomp")
  ) {
    return COMMUNITY_PLAN_VARIANTS.maintain;
  }

  if (
    normalized.includes("bulk") ||
    normalized.includes("gain") ||
    normalized.includes("muscle") ||
    normalized.includes("mass")
  ) {
    return COMMUNITY_PLAN_VARIANTS.bulk;
  }

  return COMMUNITY_PLAN_VARIANTS.generic;
};

export const formatCommunityPlanFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatCommunityPlanDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

export const getCommunityPlanCountLabel = (count: number) =>
  `${count.toString().padStart(2, "0")} online`;

export const COMMUNITY_PLAN_SORT_ORDER: CommunityPlanVariant["key"][] = [
  "maintain",
  "weightloss",
  "bulk",
  "generic",
];
