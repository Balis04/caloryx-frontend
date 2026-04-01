import { cn } from "@/lib/utils";

export function ReadonlyField({
  label,
  value,
  fallback,
  className,
}: {
  label: string;
  value?: string | number | null;
  fallback: string;
  className?: string;
}) {
  const normalized =
    typeof value === "number" ? String(value) : (value?.trim() ?? "");

  return (
    <div className={cn("cx-glass-block rounded-[24px] p-4", className)}>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">
        {normalized.length > 0 ? normalized : fallback}
      </p>
    </div>
  );
}
