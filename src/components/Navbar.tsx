import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="text-lg font-semibold">
          Caloryx
        </a>

        {/* Menü */}
        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm font-medium hover:underline" href="/edzes">
            Edzés
          </a>
          <a className="text-sm font-medium hover:underline" href="/kaloria">
            Kalóriaszámolás
          </a>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <a href="/belepes">Belépés</a>
          </Button>
          <Button asChild>
            <a href="/regisztracio">Regisztráció</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
