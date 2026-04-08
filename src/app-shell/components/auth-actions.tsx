import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthContextValue } from "@/features/auth/auth-context";

export type AuthActionsProps = {
  authState: AuthContextValue["authState"];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: (publicPath?: string) => Promise<void>;
  mobile?: boolean;
};

export function AuthActions({
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
          <span className={cn("font-medium text-slate-900", mobile ? "" : "block truncate")}>
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
