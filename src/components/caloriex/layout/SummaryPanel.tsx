import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { CardContent } from "@/components/ui/card";

import { GlassCardSoft } from "../primitives/GlassCard";
import { cn } from "@/lib/utils";

export function SummaryPanel({
  eyebrow,
  title,
  icon: Icon,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlassCardSoft className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="border-b border-white/50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
            </div>
            <div className="rounded-full border border-cyan-300/40 bg-cyan-100/60 p-3 text-slate-700">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>

        {children}
      </CardContent>
    </GlassCardSoft>
  );
}
