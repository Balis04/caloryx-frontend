import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function GlassChip({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("cx-chip", className)} {...props} />;
}
