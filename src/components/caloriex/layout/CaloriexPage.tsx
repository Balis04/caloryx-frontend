import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function CaloriexPage({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("cx-page", className)} {...props}>
      <div className="cx-orb-left" />
      <div className="cx-orb-right" />
      <div className="relative">{children}</div>
    </div>
  );
}
