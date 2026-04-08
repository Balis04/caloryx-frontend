import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/app-shell/components/desktop-nav";
import { MobileNav } from "@/app-shell/components/mobile-nav";
import { Brand } from "@/app-shell/components/brand";
import {
  getAppLinks,
  isNavItemActive,
  publicLinks,
} from "@/app-shell/model/navigation-config";
import { useAuth } from "@/features/auth/use-auth";

export function Navbar() {
  const { authState, isAuthenticated, isLoading, login, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCoach = hasAnyRole("COACH");
  const appLinks = getAppLinks(isCoach);
  const isFeatureMenuActive = appLinks.some((item) =>
    isNavItemActive(location.pathname, item)
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#f3f7fb]/80 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <Brand
            onNavigateHome={() => {
              setIsMobileMenuOpen(false);
              navigate("/");
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-full border-white/70 bg-white/70 shadow-sm backdrop-blur"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <DesktopNav
          appLinks={appLinks}
          authState={authState}
          isAuthenticated={isAuthenticated}
          isFeatureMenuActive={isFeatureMenuActive}
          isLoading={isLoading}
          login={login}
          logout={logout}
          onNavigate={navigate}
          onNavigateHome={() => {
            setIsMobileMenuOpen(false);
            navigate("/");
          }}
          publicLinks={publicLinks}
        />

        {isMobileMenuOpen ? (
          <MobileNav
            appLinks={appLinks}
            authState={authState}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            login={login}
            logout={logout}
            onNavigate={() => setIsMobileMenuOpen(false)}
            publicLinks={publicLinks}
          />
        ) : null}
      </div>
    </header>
  );
}
