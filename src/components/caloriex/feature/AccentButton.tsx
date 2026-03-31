import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ACCENT_STYLES, type AccentTone } from "../theme/accent-tones";

export function AccentButton({
  tone,
  className,
  ...props
}: { tone: AccentTone } & Omit<ButtonProps, "variant">) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        "h-12 w-full rounded-2xl border shadow-sm backdrop-blur",
        ACCENT_STYLES[tone].button,
        className
      )}
    />
  );
}
