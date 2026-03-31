import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function HeroBadge({
  className,
  ...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
  return <Badge {...props} variant="outline" className={cn("cx-hero-badge", className)} />;
}
