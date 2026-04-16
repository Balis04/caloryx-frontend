import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlassCard, GlassChip } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { saveFood } from "../../api/food.api";
import { createFoodLogPayload } from "../../lib/food.mapper";
import type { Food } from "../../model/food.model";
import { NutrientList } from "./NutrientList";
import { UnitSelect } from "./UnitSelect";

export default function FoodCard({
  food,
  mealTime = "BREAKFAST",
  consumedDate,
}: {
  food: Food;
  mealTime?: string;
  consumedDate?: string;
}) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [amount, setAmount] = useState(100);
  const [unit, setUnit] = useState<"g" | "serv">("g");

  const totalGrams = unit === "g" ? amount : amount * (food.servingSize || 100);
  const calculateNutrient = (baseValue: number) =>
    Math.round((baseValue / 100) * totalGrams);

  const handleUnitChange = (nextUnit: "g" | "serv") => {
    setUnit(nextUnit);
    setAmount(nextUnit === "g" ? 100 : 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const payload = createFoodLogPayload(
        food,
        mealTime,
        totalGrams,
        calculateNutrient,
        consumedDate
      );
      await saveFood(payload);
      navigate("/calorie-counter");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Sikertelen mentes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <GlassCard className="flex h-full flex-col overflow-hidden">
      <CardHeader className="space-y-4 p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <CardTitle className="line-clamp-2 text-base font-semibold tracking-tight text-slate-950">
              {food.description}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <GlassChip className="px-3 py-1 text-xs">{food.brandOwner || "General"}</GlassChip>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                {Math.round(totalGrams)} g total
              </Badge>
            </div>
          </div>

          <Button
            size="icon"
            onClick={handleSave}
            disabled={isSaving || amount <= 0}
            className="h-10 w-10 rounded-full"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-5 pt-0">
        <NutrientList nutrients={food.foodNutrients} calculate={calculateNutrient} />
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-white/50 bg-white/35 p-5 pt-4">
        <div className="flex w-full items-center gap-2">
          <Input
            type="number"
            className="h-10 border-white/70 bg-white/80 text-center font-semibold"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          />
          <UnitSelect unit={unit} food={food} onUnitChange={handleUnitChange} />
        </div>

        {saveError ? <p className="w-full text-xs text-red-700">{saveError}</p> : null}
      </CardFooter>
    </GlassCard>
  );
}
