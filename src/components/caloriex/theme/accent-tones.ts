export type AccentTone =
  | "emerald"
  | "rose"
  | "violet"
  | "sky"
  | "amber"
  | "slate";

export type AccentClasses = {
  accent: string;
  surface: string;
  glow: string;
  iconWrap: string;
  badge: string;
  button: string;
};

export const ACCENT_STYLES: Record<AccentTone, AccentClasses> = {
  emerald: {
    accent: "from-emerald-400/30 via-cyan-300/10 to-slate-950/0",
    surface: "border-emerald-300/40 bg-white/60",
    glow: "bg-emerald-400/20",
    iconWrap: "border-emerald-300/50 bg-emerald-100/70 text-emerald-950",
    badge: "border-emerald-400/40 bg-emerald-200/50 text-emerald-950",
    button: "border-emerald-300/50 bg-emerald-100/80 text-emerald-950 hover:bg-emerald-200/90",
  },
  rose: {
    accent: "from-rose-300/30 via-amber-300/10 to-slate-950/0",
    surface: "border-rose-300/40 bg-white/60",
    glow: "bg-rose-300/20",
    iconWrap: "border-rose-300/50 bg-rose-100/75 text-rose-950",
    badge: "border-rose-400/40 bg-rose-200/50 text-rose-950",
    button: "border-rose-300/50 bg-rose-100/80 text-rose-950 hover:bg-rose-200/90",
  },
  violet: {
    accent: "from-violet-300/30 via-sky-300/10 to-slate-950/0",
    surface: "border-violet-300/40 bg-white/60",
    glow: "bg-violet-300/20",
    iconWrap: "border-violet-300/50 bg-violet-100/75 text-violet-950",
    badge: "border-violet-400/40 bg-violet-200/50 text-violet-950",
    button: "border-violet-300/50 bg-violet-100/80 text-violet-950 hover:bg-violet-200/90",
  },
  sky: {
    accent: "from-sky-300/30 via-cyan-300/15 to-slate-950/0",
    surface: "border-sky-300/40 bg-white/60",
    glow: "bg-sky-300/20",
    iconWrap: "border-sky-300/50 bg-sky-100/80 text-sky-950",
    badge: "border-sky-400/40 bg-sky-200/55 text-sky-950",
    button: "border-sky-300/50 bg-sky-100/80 text-sky-950 hover:bg-sky-200/90",
  },
  amber: {
    accent: "from-amber-300/35 via-orange-300/15 to-slate-950/0",
    surface: "border-amber-300/40 bg-white/60",
    glow: "bg-amber-300/20",
    iconWrap: "border-amber-300/50 bg-amber-100/80 text-amber-950",
    badge: "border-amber-400/40 bg-amber-200/60 text-amber-950",
    button: "border-amber-300/50 bg-amber-100/80 text-amber-950 hover:bg-amber-200/90",
  },
  slate: {
    accent: "from-violet-300/30 via-cyan-300/10 to-slate-950/0",
    surface: "border-slate-300/40 bg-white/60",
    glow: "bg-cyan-300/20",
    iconWrap: "border-slate-300/50 bg-slate-100/80 text-slate-950",
    badge: "border-slate-400/40 bg-slate-200/60 text-slate-950",
    button: "border-slate-300/50 bg-slate-100/80 text-slate-950 hover:bg-slate-200/90",
  },
};
