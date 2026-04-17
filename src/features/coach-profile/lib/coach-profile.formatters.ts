import type { Currency, TrainingFormat } from "../types";

export const TRAINING_FORMAT_OPTIONS = [
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "IN_PERSON", label: "In person" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "HUF", label: "HUF" },
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
] as const;

export const coachProfileInputClassName =
  "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur focus-visible:ring-slate-900/20";

export const coachProfileSelectClassName =
  "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur";

export const coachProfileTextareaClassName =
  "min-h-32 w-full rounded-[24px] border border-white/60 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none backdrop-blur placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900/15";

export const getTrainingFormatLabel = (value: TrainingFormat | "") =>
  TRAINING_FORMAT_OPTIONS.find((option) => option.value === value)?.label ?? "";

export const getCurrencyLabel = (value: Currency | "") =>
  CURRENCY_OPTIONS.find((option) => option.value === value)?.label ?? "";

export const formatPriceRange = (
  priceFrom: string,
  priceTo: string,
  currency: Currency | ""
) => (priceFrom || priceTo ? `${priceFrom || "0"} - ${priceTo || "0"} ${currency || ""}` : "");

