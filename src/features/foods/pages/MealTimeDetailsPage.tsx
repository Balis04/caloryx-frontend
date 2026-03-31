import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2, Utensils } from "lucide-react";

import {
  CaloriexPage,
  GlassCard,
  GlassMetric,
  HeroBadge,
  PageHero,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { useCaloriesSummaryService } from "../hooks/useCaloriesSummaryService";
import { useFoodService } from "../hooks/useFoodService";
import type { FoodLogResponse, MealTime, MealTimeSummaryResponse } from "../model/food.model";

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

const formatDisplayDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));

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
  const [actionType, setActionType] = useState<"update" | "delete" | null>(null);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);

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
      const message = e instanceof Error ? e.message : "Failed to load meal details.";
      setError(message);
      setSummary(null);
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  }, [date, getMealTimeSummary, normalizedMeal]);

  useEffect(() => {
    void loadData();
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

  const calorieProgress =
    (summary?.targetCalories ?? 0) > 0
      ? Math.min((consumed.calories / (summary?.targetCalories ?? 1)) * 100, 100)
      : 0;

  const openAddFood = () => {
    navigate(`/foods/${normalizedMeal.toLowerCase()}?date=${date}`);
  };

  const beginEdit = (food: FoodLogResponse) => {
    setEditingFoodId(food.id);
    setEditingAmount(String(food.amount));
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingFoodId(null);
    setEditingAmount("");
    setActionError(null);
  };

  const saveEdit = async (foodId: string) => {
    const newAmount = Number(editingAmount);
    if (Number.isNaN(newAmount) || newAmount <= 0) {
      setActionError("Amount must be a positive number.");
      return;
    }

    setActiveFoodId(foodId);
    setActionType("update");
    setActionError(null);

    try {
      await updateFoodAmount(foodId, newAmount);
      await loadData();
      cancelEdit();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  const handleDelete = async (foodId: string) => {
    setActiveFoodId(foodId);
    setActionType("delete");
    setActionError(null);

    try {
      await deleteFood(foodId);
      await loadData();
      if (editingFoodId === foodId) {
        cancelEdit();
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  if (!normalizedMeal || !VALID_MEALS.includes(normalizedMeal)) {
    return <div className="p-6">Invalid meal type.</div>;
  }

  const mealTitle = toMealTitle(normalizedMeal);

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/calorie-counter")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to diary
          </Button>
        }
        badge={<HeroBadge>{mealTitle} details</HeroBadge>}
        title={`Review everything logged for ${mealTitle.toLowerCase()} and adjust amounts without losing context.`}
        description="This meal detail view now shares the same glass-card layout, metrics, and action structure as the other refreshed CalorieX pages."
        chips={[mealTitle, formatDisplayDate(date), `${foods.length} logged item${foods.length === 1 ? "" : "s"}`]}
        aside={
          <GlassCard className="hidden overflow-hidden xl:block">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Meal snapshot</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    {Math.round(consumed.calories)} kcal
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Current total for {mealTitle.toLowerCase()} on {formatDisplayDate(date)}.
                  </p>
                </div>
                <Button onClick={openAddFood} className="rounded-full px-5">
                  <Plus className="mr-2 h-4 w-4" />
                  Add food
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <GlassMetric
                  label="Logged items"
                  value={String(foods.length)}
                  description="Foods currently included in this meal."
                />
                <GlassMetric
                  label="Target"
                  value={`${Math.round(summary?.targetCalories ?? 0)} kcal`}
                  description="Calorie target assigned to this meal."
                />
              </div>
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_340px]">
          <SummaryPanel eyebrow="Meal summary" title="Nutrition totals" icon={Utensils}>
            <div className="space-y-6 p-6">
              {isLoading ? <p className="text-sm text-slate-600">Loading meal details...</p> : null}
              {error ? <p className="text-sm text-red-700">{error}</p> : null}

              {!isLoading && !error ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <GlassMetric
                      label="Calories"
                      value={`${Math.round(consumed.calories)} kcal`}
                      description={`Goal ${Math.round(summary?.targetCalories ?? 0)} kcal`}
                    />
                    <GlassMetric
                      label="Protein"
                      value={`${Math.round(consumed.protein)} g`}
                      description={`Goal ${Math.round(summary?.targetProteinGrams ?? 0)} g`}
                    />
                    <GlassMetric
                      label="Carbs"
                      value={`${Math.round(consumed.carbohydrates)} g`}
                      description={`Goal ${Math.round(summary?.targetCarbohydratesGrams ?? 0)} g`}
                    />
                    <GlassMetric
                      label="Fat"
                      value={`${Math.round(consumed.fat)} g`}
                      description={`Goal ${Math.round(summary?.targetFatGrams ?? 0)} g`}
                    />
                  </div>

                  <div className="space-y-3 rounded-[28px] border border-white/60 bg-white/65 p-5 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">Meal calorie progress</p>
                        <p className="text-sm text-slate-600">
                          {Math.round(consumed.calories)} consumed of {Math.round(summary?.targetCalories ?? 0)} kcal
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1">
                        {Math.round(calorieProgress)}%
                      </Badge>
                    </div>
                    <Progress value={calorieProgress} className="h-3 bg-slate-200/80" />
                  </div>
                </>
              ) : null}
            </div>
          </SummaryPanel>

          <SummaryPanel
            eyebrow="Actions"
            title="Quick tools"
            icon={Plus}
            className="hidden xl:block"
          >
            <div className="space-y-4 p-6 text-sm text-slate-600">
              <p>Add another food, edit an amount inline, or delete an entry if the meal needs cleanup.</p>
              <div className="grid gap-3">
                <GlassMetric
                  label="Editable"
                  value="Amounts"
                  description="Each logged food can be updated directly from this screen."
                />
                <GlassMetric
                  label="Date"
                  value={formatDisplayDate(date)}
                  description="Changes apply only to the selected meal and day."
                />
              </div>
            </div>
          </SummaryPanel>
        </div>

        {actionError ? <p className="mt-6 text-sm text-red-700">{actionError}</p> : null}

        <div className="mt-6 space-y-4">
          {foods.map((food) => {
            const isActive = activeFoodId === food.id;
            const isEditing = editingFoodId === food.id;

            return (
              <GlassCard key={food.id} className="overflow-hidden">
                <CardContent className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xl font-semibold tracking-tight text-slate-950">
                          {food.foodName}
                        </p>

                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={editingAmount}
                              onChange={(e) => setEditingAmount(e.target.value)}
                              className="h-10 max-w-[140px] border-white/70 bg-white/80"
                            />
                            <span className="text-sm text-slate-600">{food.unit}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-600">
                            {Math.round(food.amount)} {food.unit}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MiniMetric label="Calories" value={`${Math.round(food.calories)} kcal`} />
                        <MiniMetric label="Protein" value={`${Math.round(food.protein)} g`} />
                        <MiniMetric label="Carbs" value={`${Math.round(food.carbohydrates)} g`} />
                        <MiniMetric label="Fat" value={`${Math.round(food.fat)} g`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[170px]">
                    {isEditing ? (
                      <>
                        <Button onClick={() => saveEdit(food.id)} disabled={isActive} className="rounded-full">
                          {isActive && actionType === "update" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={isActive}
                          className="rounded-full border-white/70 bg-white/70"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => beginEdit(food)}
                        disabled={isActive}
                        className="rounded-full border-white/70 bg-white/70"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit amount
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(food.id)}
                      disabled={isActive}
                      className="rounded-full"
                    >
                      {isActive && actionType === "delete" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </GlassCard>
            );
          })}

          {!isLoading && !error && foods.length === 0 ? (
            <GlassCard>
              <CardContent className="py-16 text-center">
                <p className="text-lg font-semibold text-slate-950">
                  No foods have been logged for this meal yet.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Add the first item to start tracking {mealTitle.toLowerCase()} on this date.
                </p>
                <div className="mt-6">
                  <Button onClick={openAddFood} className="rounded-full px-6">
                    <Plus className="mr-2 h-4 w-4" />
                    Add food
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          ) : null}
        </div>
      </section>
    </CaloriexPage>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-center backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
