import { cn } from "@/lib/utils";

export function GlassMetric({
  label,
  value,
  description,
  className,
}: {
  label: string;
  value: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("cx-glass-block p-4", className)}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
