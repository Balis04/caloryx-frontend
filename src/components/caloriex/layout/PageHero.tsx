import type { ReactNode } from "react";

import { GlassChip } from "../primitives/GlassChip";

export function PageHero({
  badge,
  title,
  description,
  chips,
  aside,
  leading,
}: {
  badge: ReactNode;
  title: string;
  description: string;
  chips?: readonly string[];
  aside?: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <section className="relative border-b border-white/40">
      <div className="container mx-auto px-6 py-8 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            {leading}
            {badge}

            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-7xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                {description}
              </p>
            </div>

            {chips?.length ? (
              <div className="flex flex-wrap gap-3">
                {chips.map((chip) => (
                  <GlassChip key={chip}>{chip}</GlassChip>
                ))}
              </div>
            ) : null}
          </div>

          {aside}
        </div>
      </div>
    </section>
  );
}
