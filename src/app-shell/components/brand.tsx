type BrandProps = {
  onNavigateHome: () => void;
  compact?: boolean;
};

export function Brand({ onNavigateHome, compact = false }: BrandProps) {
  return (
    <button
      type="button"
      onClick={onNavigateHome}
      className="group flex w-fit items-center gap-3 rounded-full border border-white/70 bg-white/65 px-3 py-2 text-left shadow-sm backdrop-blur transition hover:bg-white/80"
      aria-label="Go to home page"
    >
      <div className="overflow-hidden rounded-full border border-cyan-200/70 bg-white/90 p-1">
        <img src="/logo2.png" alt="CalorieX" className="h-9 w-auto" />
      </div>
      {compact ? null : (
        <div className="hidden xl:block">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">CalorieX</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            Nutrition and coaching workspace
          </p>
        </div>
      )}
    </button>
  );
}
