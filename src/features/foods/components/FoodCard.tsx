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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Tag, Scale } from "lucide-react";
import type { Food } from "../types/food.types";
import { useFoodCalculator } from "../hooks/useFoodCalculator";
import { useFoodService } from "../hooks/useFoodService";
import type { MealTime, FoodLogRequest } from "../types/food.types";
import type { Nutrient } from "../types/food.types";

export default function FoodCard({
  food,
  mealTime = "BREAKFAST",
}: {
  food: Food;
  mealTime?: string;
}) {
  const { saveFood } = useFoodService();
  const [isSaving, setIsSaving] = useState(false);

  const {
    value,
    setValue,
    unit,
    totalGrams,
    calculateNutrient,
    handleUnitChange,
  } = useFoodCalculator(food);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const getVal = (name: string) =>
        food.foodNutrients.find((n) =>
          n.nutrientName.toLowerCase().includes(name.toLowerCase())
        )?.value || 0;

      const payload: FoodLogRequest = {
        foodName: food.description,
        mealTime: mealTime.toUpperCase() as MealTime,
        amount: totalGrams,
        unit: "g",
        calories: calculateNutrient(getVal("Energy")),
        protein: calculateNutrient(getVal("Protein")),
        carbohydrates: calculateNutrient(getVal("Carbohydrate")),
        fat: calculateNutrient(getVal("Total lipid")),
        consumedAt: new Date().toISOString(),
      };

      await saveFood(payload);
      alert("Sikeres mentés!");
    } catch {
      alert("Hiba történt a mentés során.");
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
          disabled={isSaving || value <= 0}
          className="h-8 w-8 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
          onClick={handleSave}
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
          <div className="flex items-center text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md w-fit">
            <Tag className="h-3 w-3 mr-1" />
            {food.brandOwner || "General"}
          </div>
          <div className="flex items-center text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md w-fit">
            <Scale className="h-3 w-3 mr-1" />
            {Math.round(totalGrams)} {food.servingSizeUnit || "g"} total
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <div className="space-y-1.5 border-t border-dashed pt-3">
          {food.foodNutrients.slice(0, 4).map((n: Nutrient, i: number) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {n.nutrientName.split(/[,(]/)[0].trim()}
              </span>
              <span className="font-mono font-bold">
                {calculateNutrient(n.value)} {n.unitName.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex flex-col gap-2 border-t bg-slate-50/50 rounded-b-xl">
        <div className="flex items-center gap-2 w-full mt-2">
          <Input
            type="number"
            min="0"
            className="h-9 flex-grow text-center font-bold bg-white"
            value={value === 0 ? "" : value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setValue(isNaN(val) ? 0 : val);
            }}
          />

          <Select
            value={unit}
            onValueChange={(v: "g" | "serv") => handleUnitChange(v)}
          >
            <SelectTrigger className="h-9 w-[120px] bg-white font-medium text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="g">
                {food.servingSizeUnit || "g/ml"}
              </SelectItem>
              {food.servingSize && (
                <SelectItem value="serv">
                  Serving ({food.servingSize} {food.servingSizeUnit})
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}
