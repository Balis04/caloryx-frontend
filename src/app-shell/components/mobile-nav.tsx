import { AuthActions, type AuthActionsProps } from "@/app-shell/components/auth-actions";
import { NavbarLink } from "@/app-shell/components/navbar-link";
import type { NavItem } from "@/app-shell/model/navigation-config";

type MobileNavProps = AuthActionsProps & {
  appLinks: NavItem[];
  onNavigate: () => void;
  publicLinks: NavItem[];
};

export function MobileNav({
  appLinks,
  authState,
  isAuthenticated,
  isLoading,
  login,
  logout,
  onNavigate,
  publicLinks,
}: MobileNavProps) {
  return (
    <div className="mt-4 space-y-4 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur md:hidden">
      <nav className="grid gap-2">
        {publicLinks.map((item) => (
          <NavbarLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}

        {isAuthenticated
          ? appLinks.map((item) => (
              <NavbarLink key={item.to} item={item} onNavigate={onNavigate} />
            ))
          : null}
      </nav>

      <div className="flex flex-col gap-2 border-t border-slate-200/70 pt-4">
        <AuthActions
          authState={authState}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          login={login}
          logout={logout}
          mobile
        />
      </div>
    </div>
  );
}
