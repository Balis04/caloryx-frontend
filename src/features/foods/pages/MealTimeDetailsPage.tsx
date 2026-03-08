import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCaloriesSummaryService } from "../hooks/useCaloriesSummaryService";
import { useFoodService } from "../hooks/useFoodService";
import type {
  FoodLogResponse,
  MealTime,
  MealTimeSummaryResponse,
} from "../types/food.types";

const VALID_MEALS: MealTime[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

const formatDateInput = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toMealTitle = (mealTime: MealTime): string => {
  switch (mealTime) {
    case "BREAKFAST":
      return "Breakfast";
    case "LUNCH":
      return "Lunch";
    case "DINNER":
      return "Dinner";
    case "SNACK":
      return "Snacks";
    default:
      return mealTime;
  }
};

export default function MealTimeDetailsPage() {
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { getMealTimeSummary } = useCaloriesSummaryService();
  const { updateFoodAmount, deleteFood } = useFoodService();

  const normalizedMeal = mealTime?.toUpperCase() as MealTime;
  const date = searchParams.get("date") ?? formatDateInput(new Date());

  const [summary, setSummary] = useState<MealTimeSummaryResponse | null>(null);
  const [foods, setFoods] = useState<FoodLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );

  const loadData = useCallback(async () => {
    if (!normalizedMeal || !VALID_MEALS.includes(normalizedMeal)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMealTimeSummary(date, normalizedMeal);
      setSummary(data);
      setFoods(data.foods ?? []);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Nem sikerult betolteni.";
      setError(message);
      setSummary(null);
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  }, [date, getMealTimeSummary, normalizedMeal]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const consumed = useMemo(() => {
    return foods.reduce(
      (acc, food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbohydrates += food.carbohydrates;
        acc.fat += food.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );
  }, [foods]);

  const handleDelete = async (foodId: string) => {
    const confirmed = window.confirm("Biztosan torlod ezt a tetelt?");
    if (!confirmed) return;

    setActiveFoodId(foodId);
    setActionType("delete");

    try {
      await deleteFood(foodId);
      await loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Torles sikertelen.");
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  const handleEditAmount = async (foodId: string) => {
    const current = foods.find((item) => item.id === foodId);
    if (!current) return;

    const value = prompt("Uj mennyiseg:", String(current.amount));
    if (!value) return;

    const newAmount = Number(value);
    if (Number.isNaN(newAmount) || newAmount <= 0) {
      alert("Ervenytelen mennyiseg.");
      return;
    }

    setActiveFoodId(foodId);
    setActionType("update");

    try {
      await updateFoodAmount(foodId, newAmount);
      await loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Modositas sikertelen.");
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  if (!normalizedMeal || !VALID_MEALS.includes(normalizedMeal)) {
    return <div className="p-6">Ervenytelen etkezes tipus.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => navigate("/calorie-counter")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Vissza
        </Button>
        <Badge variant="secondary">{date}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{toMealTitle(normalizedMeal)} reszletek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {isLoading && <p className="text-muted-foreground">Betoltes...</p>}
          {error && <p className="text-destructive">{error}</p>}
          {!isLoading && !error && (
            <>
              <div className="flex justify-between">
                <span>Kaloria</span>
                <span>
                  {Math.round(consumed.calories)} /{" "}
                  {Math.round(summary?.targetCalories ?? 0)} kcal
                </span>
              </div>
              <div className="flex justify-between">
                <span>Feherje</span>
                <span>
                  {Math.round(consumed.protein)} /{" "}
                  {Math.round(summary?.targetProteinGrams ?? 0)} g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Szenhidrat</span>
                <span>
                  {Math.round(consumed.carbohydrates)} /{" "}
                  {Math.round(summary?.targetCarbohydratesGrams ?? 0)} g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Zsir</span>
                <span>
                  {Math.round(consumed.fat)} / {Math.round(summary?.targetFatGrams ?? 0)} g
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {foods.map((food) => {
          const isActive = activeFoodId === food.id;

          return (
            <Card key={food.id}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{food.foodName}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(food.amount)} {food.unit}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAmount(food.id)}
                      disabled={isActive}
                    >
                      {isActive && actionType === "update" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Pencil className="h-4 w-4 mr-2" />
                      )}
                      Modositas
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(food.id)}
                      disabled={isActive}
                    >
                      {isActive && actionType === "delete" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Torles
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>{Math.round(food.calories)} kcal</div>
                  <div>F: {Math.round(food.protein)} g</div>
                  <div>CH: {Math.round(food.carbohydrates)} g</div>
                  <div>Zs: {Math.round(food.fat)} g</div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {!isLoading && !error && foods.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Ehhez az etkezeshez nincs rogzitett etel ezen a napon.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
