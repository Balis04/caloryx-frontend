import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Flame, LineChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* HERO */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Edzésnapló és kalóriaszámolás egy helyen.
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
          Kövesd az edzéseid, számold a napi kalóriát, és lásd a haladásod.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          {!isAuthenticated ? (
            <>
              <Button size="lg" asChild>
                <Link to="/login">Belépés</Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link to="/register">Regisztráció</Link>
              </Button>
            </>
          ) : (
            <Button size="lg" asChild>
              <Link to="/profile">Profilom</Link>
            </Button>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <Dumbbell className="w-8 h-8 text-primary mb-4" />
              <CardTitle>Edzésnapló</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Rögzíts gyakorlatokat, súlyokat és ismétléseket.
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <Flame className="w-8 h-8 text-primary mb-4" />
              <CardTitle>Kalóriaszámolás</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Állíts be napi célt és kövesd a makrókat.
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <LineChart className="w-8 h-8 text-primary mb-4" />
              <CardTitle>Statisztikák</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Heti és havi trendek grafikonokon.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground mt-auto">
        © {new Date().getFullYear()} CaloryX
      </footer>
    </div>
  );
}
