import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { Food } from "../types/food.types";
import { useFoodCalculator } from "../hooks/useFoodCalculator";
import { useFoodService } from "../hooks/useFoodService";
import { createFoodLogPayload } from "../utils/foodMapper";
import { Loader2 } from "lucide-react";
import { NutrientList } from "./NutRientList";
import { UnitSelect } from "./UnitSelect";

export default function FoodCard({
  food,
  mealTime = "BREAKFAST",
}: {
  food: Food;
  mealTime?: string;
}) {
  const { saveFood } = useFoodService();
  const [isSaving, setIsSaving] = useState(false);
  const calculator = useFoodCalculator(food);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = createFoodLogPayload(
        food,
        mealTime,
        calculator.totalGrams,
        calculator.calculateNutrient
      );
      await saveFood(payload);
      alert("Sikeres mentés!");
    } catch (e: unknown) {
      alert(`Hiba: ${e instanceof Error ? e.message : "Ismeretlen"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="relative flex flex-col h-full hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
      <div className="absolute top-2 right-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleSave}
          disabled={isSaving || calculator.value <= 0}
          className="h-8 w-8 rounded-full shadow-sm hover:bg-primary hover:text-white"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <CardHeader className="p-4 pb-2 pr-12">
        <CardTitle className="text-sm font-bold line-clamp-2 min-h-[2.5rem]">
          {food.description}
        </CardTitle>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">
            {food.brandOwner || "General"}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {Math.round(calculator.totalGrams)}g total
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <NutrientList
          nutrients={food.foodNutrients}
          calculate={calculator.calculateNutrient}
        />
      </CardContent>

      <CardFooter className="p-3 pt-0 flex flex-col gap-2 border-t bg-slate-50/50 rounded-b-xl">
        <div className="flex items-center gap-2 w-full mt-2">
          <Input
            type="number"
            className="h-9 text-center font-bold bg-white"
            value={calculator.value === 0 ? "" : calculator.value}
            onChange={(e) =>
              calculator.setValue(parseFloat(e.target.value) || 0)
            }
          />
          <UnitSelect
            unit={calculator.unit}
            food={food}
            onUnitChange={calculator.handleUnitChange}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
