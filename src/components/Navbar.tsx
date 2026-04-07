import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/use-auth";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Compass,
  Dumbbell,
  Home,
  LogIn,
  LogOut,
  Menu,
  X,
  Salad,
  UserCircle2,
  Users,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
};

const publicLinks: NavItem[] = [
  { to: "/community-training-plans", label: "Plans", icon: Compass },
];

type AuthActionsProps = {
  authState: ReturnType<typeof useAuth>["authState"];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: (publicPath?: string) => Promise<void>;
  mobile?: boolean;
};

export default function Navbar() {
  const { authState, isAuthenticated, isLoading, login, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCoach = hasAnyRole("COACH");

  const appLinks: NavItem[] = [
    { to: "/profile", label: "Profile", icon: UserCircle2 },
    { to: "/calorie-counter", label: "Calories", icon: Salad },
    {
      to: isCoach ? "/training-requests" : "/training-request",
      label: isCoach ? "Requests" : "Coaches",
      icon: Users,
    },
    ...(isCoach ? [{ to: "/coach-profile", label: "Coach", icon: Dumbbell }] : []),
  ];
  const isFeatureMenuActive = appLinks.some((item) =>
    location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#f3f7fb]/80 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <Brand onNavigateHome={() => {
            setIsMobileMenuOpen(false);
            navigate("/");
          }} />
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

function Brand({
  onNavigateHome,
  compact = false,
}: {
  onNavigateHome: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onNavigateHome}
      className="group flex w-fit items-center gap-3 rounded-full border border-white/70 bg-white/65 px-3 py-2 text-left shadow-sm backdrop-blur transition hover:bg-white/80"
      aria-label="Go to home page"
    >
      <div className="overflow-hidden rounded-full border border-cyan-200/70 bg-white/90 p-1">
        <img src="/logo2.png" alt="CalorieX" className="h-9 w-auto" />
      </div>
      {compact ? null : (
        <div className="hidden xl:block">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">CalorieX</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            Nutrition and coaching workspace
          </p>
        </div>
      )}
    </button>
  );
}

function DesktopNav({
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
}: {
  appLinks: NavItem[];
  authState: AuthActionsProps["authState"];
  isAuthenticated: boolean;
  isFeatureMenuActive: boolean;
  isLoading: boolean;
  login: () => void;
  logout: (publicPath?: string) => Promise<void>;
  onNavigate: (to: string) => void;
  onNavigateHome: () => void;
  publicLinks: NavItem[];
}) {
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

function MobileNav({
  appLinks,
  authState,
  isAuthenticated,
  isLoading,
  login,
  logout,
  onNavigate,
  publicLinks,
}: {
  appLinks: NavItem[];
  authState: AuthActionsProps["authState"];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: (publicPath?: string) => Promise<void>;
  onNavigate: () => void;
  publicLinks: NavItem[];
}) {
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

function AuthActions({
  authState,
  isAuthenticated,
  isLoading,
  login,
  logout,
  mobile = false,
}: AuthActionsProps) {
  if (isAuthenticated) {
    return (
      <>
        <div
          className={cn(
            "rounded-full border border-white/70 bg-white/65 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur",
            mobile ? "" : "max-w-[160px] lg:max-w-[200px] xl:max-w-none"
          )}
        >
          <span
            className={cn(
              "font-medium text-slate-900",
              mobile ? "" : "block truncate"
            )}
          >
            {authState?.fullName?.trim() || authState?.email || "Signed in"}
          </span>
        </div>

        <Button
          variant="outline"
          onClick={() => void logout("/")}
          className="rounded-full border-white/70 bg-white/70 shadow-sm backdrop-blur"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </>
    );
  }

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      className="rounded-full bg-slate-950 px-5 text-white shadow-sm hover:bg-slate-800"
    >
      <LogIn className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Login"}
    </Button>
  );
}

function NavbarLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
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

function FeaturesMenu({
  items,
  isActive,
  onNavigate,
}: {
  items: NavItem[];
  isActive: boolean;
  onNavigate: (to: string) => void;
}) {
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
