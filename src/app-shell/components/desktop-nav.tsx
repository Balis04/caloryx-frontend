import { AuthActions, type AuthActionsProps } from "@/app-shell/components/auth-actions";
import { Brand } from "@/app-shell/components/brand";
import { FeaturesMenu } from "@/app-shell/components/features-menu";
import { NavbarLink } from "@/app-shell/components/navbar-link";
import type { NavItem } from "@/app-shell/model/navigation-config";

type DesktopNavProps = AuthActionsProps & {
  appLinks: NavItem[];
  isFeatureMenuActive: boolean;
  onNavigate: (to: string) => void;
  onNavigateHome: () => void;
  publicLinks: NavItem[];
};

export function DesktopNav({
  appLinks,
  authState,
  isAuthenticated,
  isFeatureMenuActive,
  isLoading,
  login,
  logout,
  onNavigate,
  onNavigateHome,
  publicLinks,
}: DesktopNavProps) {
  return (
    <div className="hidden grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 md:grid lg:gap-6">
      <Brand onNavigateHome={onNavigateHome} />

      <div className="min-w-0 overflow-hidden">
        <nav className="flex min-w-0 items-center justify-center gap-2 overflow-x-auto px-2 py-1">
          {publicLinks.map((item) => (
            <NavbarLink key={item.to} item={item} />
          ))}

          {isAuthenticated ? (
            <>
              <div className="hidden lg:contents">
                {appLinks.map((item) => (
                  <NavbarLink key={item.to} item={item} />
                ))}
              </div>

              <div className="lg:hidden">
                <FeaturesMenu
                  items={appLinks}
                  isActive={isFeatureMenuActive}
                  onNavigate={onNavigate}
                />
              </div>
            </>
          ) : null}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 justify-self-end">
        <AuthActions
          authState={authState}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          login={login}
          logout={logout}
        />
      </div>
    </div>
  );
}
