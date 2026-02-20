import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";

type MealKey = "breakfast" | "snack1" | "lunch" | "snack2" | "dinner";

const dailyGoal = 2000;

export default function CaloriePage() {
  const [meals, setMeals] = useState<Record<MealKey, number>>({
    breakfast: 0,
    snack1: 0,
    lunch: 0,
    snack2: 0,
    dinner: 0,
  });

  const totalCalories = Object.values(meals).reduce((a, b) => a + b, 0);
  const remaining = dailyGoal - totalCalories;
  const percent = Math.min((totalCalories / dailyGoal) * 100, 100);

  const addCalories = (meal: MealKey) => {
    const value = prompt("Hány kalória?");
    if (!value) return;

    const num = Number(value);
    if (isNaN(num)) return;

    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal] + num,
    }));
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Ma</h1>

      {/* SUMMARY */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Napi összegzés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold">{remaining}</div>
            <div className="text-muted-foreground">Remaining kcal</div>
          </div>

          <Progress value={percent} className="mb-4" />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{totalCalories} elfogyasztva</span>
            <span>{dailyGoal} cél</span>
          </div>
        </CardContent>
      </Card>

      {/* MEALS */}
      <div className="space-y-4">
        {[
          { key: "breakfast", label: "Reggeli" },
          { key: "snack1", label: "Tízórai" },
          { key: "lunch", label: "Ebéd" },
          { key: "snack2", label: "Uzsonna" },
          { key: "dinner", label: "Vacsora" },
        ].map((meal) => (
          <Card key={meal.key}>
            <CardContent className="flex justify-between items-center py-4">
              <div>
                <div className="font-medium">{meal.label}</div>
                <div className="text-sm text-muted-foreground">
                  {meals[meal.key as MealKey]} kcal
                </div>
              </div>

              <button
                onClick={() => addCalories(meal.key as MealKey)}
                className="p-2 rounded-full bg-primary text-white"
              >
                <Plus size={16} />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
