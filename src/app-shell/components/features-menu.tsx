import { ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/app-shell/model/navigation-config";

type FeaturesMenuProps = {
  items: NavItem[];
  isActive: boolean;
  onNavigate: (to: string) => void;
};

export function FeaturesMenu({
  items,
  isActive,
  onNavigate,
}: FeaturesMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur",
            isActive
              ? "border-slate-900 bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50"
              : "border-white/70 bg-white/65 text-slate-700 hover:bg-white/80 hover:text-slate-950"
          )}
        >
          <Users className="h-4 w-4" />
          Features
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="min-w-[220px] rounded-2xl border-white/70 bg-white/90 p-2 shadow-xl backdrop-blur"
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.to}
              onClick={() => onNavigate(item.to)}
              className="rounded-xl px-3 py-2 text-slate-700 focus:bg-slate-900 focus:text-slate-50"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
