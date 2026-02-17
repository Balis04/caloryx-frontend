import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: string;
  goal: string;
  activityLevel: string;
  startWeight: string;
  targetWeight: string;
  weeklyGoal: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "",
    goal: "",
    activityLevel: "",
    startWeight: "",
    targetWeight: "",
    weeklyGoal: "",
  });

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role === "trainer" ? "TRAINER" : "USER",
          goal: form.goal === "cut" ? "CUT" : "BULK",
          activityLevel:
            form.activityLevel === "low"
              ? "LOW"
              : form.activityLevel === "medium"
              ? "MEDIUM"
              : "HIGH",
          startWeightKg: Number(form.startWeight),
          targetWeightKg: Number(form.targetWeight),
          weeklyGoalKg: form.weeklyGoal ? Number(form.weeklyGoal) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        alert("Hiba történt a regisztráció során.");
        return;
      }

      const data = await response.json();
      console.log("Sikeres regisztráció:", data);

      alert("Sikeres regisztráció!");
    } catch (error) {
      console.error("Network error:", error);
      alert("Szerver nem elérhető.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Regisztráció</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Név */}
            <div className="space-y-2">
              <Label>Név</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            {/* Jelszó */}
            <div className="space-y-2">
              <Label>Jelszó</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>

            {/* Szerepkör */}
            <div className="space-y-2">
              <Label>Szerepkör</Label>
              <Select onValueChange={(value) => handleChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz szerepkört" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainer">Edző</SelectItem>
                  <SelectItem value="user">Felhasználó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cél */}
            <div className="space-y-2">
              <Label>Cél</Label>
              <Select onValueChange={(value) => handleChange("goal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz célt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cut">Fogyás</SelectItem>
                  <SelectItem value="bulk">Tömegelés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aktivitási szint */}
            <div className="space-y-2">
              <Label>Aktivitási szint</Label>
              <Select
                onValueChange={(value) => handleChange("activityLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Válassz aktivitási szintet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Alacsony</SelectItem>
                  <SelectItem value="medium">Közepes</SelectItem>
                  <SelectItem value="high">Magas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Súlyok */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kezdeti súly (kg)</Label>
                <Input
                  type="number"
                  value={form.startWeight}
                  onChange={(e) => handleChange("startWeight", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Célsúly (kg)</Label>
                <Input
                  type="number"
                  value={form.targetWeight}
                  onChange={(e) => handleChange("targetWeight", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Heti cél */}
            <div className="space-y-2">
              <Label>Heti cél (kg / hét)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.weeklyGoal}
                onChange={(e) => handleChange("weeklyGoal", e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Regisztráció
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
