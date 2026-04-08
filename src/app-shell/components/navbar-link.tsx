import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/app-shell/model/navigation-config";

type NavbarLinkProps = {
  item: NavItem;
  onNavigate?: () => void;
};

export function NavbarLink({ item, onNavigate }: NavbarLinkProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition",
          isActive
            ? "border-slate-900 bg-slate-900 text-slate-50"
            : "border-white/70 bg-white/65 text-slate-700 hover:bg-white/80 hover:text-slate-950"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}
