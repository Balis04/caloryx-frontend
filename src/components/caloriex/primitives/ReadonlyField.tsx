export function ReadonlyField({
  label,
  value,
  fallback,
}: {
  label: string;
  value?: string | null;
  fallback: string;
}) {
  const normalized = value?.trim() ?? "";

  return (
    <div className="cx-glass-block rounded-[24px] p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">
        {normalized.length > 0 ? normalized : fallback}
      </p>
    </div>
  );
}
