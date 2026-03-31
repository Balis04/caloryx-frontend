import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function GlassCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("cx-glass-card", className)} {...props} />;
}

export function GlassCardSoft({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("cx-glass-card-soft", className)} {...props} />;
}
