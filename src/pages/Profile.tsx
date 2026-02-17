import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/types/user";
import { GoalConfig } from "@/constant/goal";

export default function ProfilePage() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiFetch("/api/auth/me", {
          method: "GET",
        });

        if (!res.ok) {
          logout();
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Betöltés...
      </div>
    );
  }

  if (!user) return null;

  const start = user.startWeightKg;
  const target = user.targetWeightKg;
  const current = user.currentWeightKg;

  const totalToLose = start - target;
  const lostSoFar = start - current;

  const progress =
    totalToLose > 0 ? Math.min((lostSoFar / totalToLose) * 100, 100) : 0;

  return (
    <div className="min-h-screen text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profil</h1>
        <Settings className="w-6 h-6 text-cyan-400 cursor-pointer" />
      </div>

      {/* TABS */}
      <Tabs defaultValue="me">
        <TabsList className="bg-transparent border-b border-gray-700 w-full justify-start rounded-none p-0">
          <TabsTrigger
            value="me"
            className="data-[state=active]:border-b-2 border-cyan-400 rounded-none"
          >
            Én
          </TabsTrigger>
          <TabsTrigger value="friends" className="rounded-none">
            Barátok
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* PROFIL KÁRTYA */}
      <Card className="border-none rounded-2xl">
        <CardContent className="p-6 flex gap-6 items-center">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded-full">
              PRO
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-400 text-sm">
              🎂 33 év • {user?.goal ? GoalConfig[user.goal].icon : ""}
              {user?.goal ? GoalConfig[user.goal].label : ""}
            </p>

            <div className="flex gap-8 pt-2">
              <div>
                <p className="text-gray-400 text-xs">Kcal maradt</p>
                <p className="text-lg font-semibold">475</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Lépések</p>
                <p className="text-lg font-semibold">3 490</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HALADÁS */}
      <Card className="border-none rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            🎉 {lostSoFar.toFixed(1)} kg fogyás!
          </h3>

          <p className="text-gray-400 text-sm">
            Gratulálunk, haladsz a célod felé!
          </p>

          <Slider value={[progress]} min={0} max={100} step={1} disabled />

          <div className="flex justify-between text-sm text-gray-400">
            <span>{start} kg</span>
            <span>{target} kg</span>
          </div>

          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-xl">
            Cél módosítása
          </Button>
        </CardContent>
      </Card>

      {/* CÉLOK */}
      <Card className="border-none rounded-2xl">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Céljaim</h3>

          <div className="text-gray-300 text-sm space-y-1">
            <p>• Diéta: Standard</p>
            <p>• Cél: Fogyás</p>
            <p>• Súly: 67 kg</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
