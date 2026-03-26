import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { Loader2, Trash2, UtensilsCrossed } from "lucide-react";
import FoodCard from "../components/FoodCard";
import { FoodSearchForm } from "../components/FoodSearchForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  CustomFoodResponse,
  Food,
  MealTime,
  Nutrient,
} from "../model/food.model";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useFoodService } from "../hooks/useFoodService";

const VALID_MEALS: MealTime[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

type MainTab = "usda" | "create" | "saved";
type SavedScope = "own" | "other" | "all";

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toStableNumber = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) + 1;
};

const pickNumber = (
  food: CustomFoodResponse,
  keys: Array<keyof CustomFoodResponse>
): number => {
  for (const key of keys) {
    const value = food[key];
    if (typeof value === "number") return value;
  }
  return 0;
};

const toFoodFromCustom = (food: CustomFoodResponse): Food => {
  const calories = pickNumber(food, ["calories", "caloriesPer100g"]);
  const protein = pickNumber(food, ["protein", "proteinPer100g"]);
  const carbohydrates = pickNumber(food, [
    "carbohydrates",
    "carbohydratesPer100g",
  ]);
  const fat = pickNumber(food, ["fat", "fatPer100g"]);

  const nutrients: Nutrient[] = [
    { nutrientName: "Energy", unitName: "kcal", value: calories },
    { nutrientName: "Protein", unitName: "g", value: protein },
    {
      nutrientName: "Carbohydrate, by difference",
      unitName: "g",
      value: carbohydrates,
    },
    { nutrientName: "Total lipid (fat)", unitName: "g", value: fat },
  ];

  return {
    fdcId: toStableNumber(food.id),
    customFoodId: food.id,
    description: food.name || food.foodName || "Untitled custom food",
    brandOwner:
      food.brandOwner ||
      food.createdByName ||
      food.createdBy ||
      "User custom food",
    servingSizeUnit: "g",
    servingSize: 100,
    foodNutrients: nutrients,
  };
};

export default function FoodSearchPage() {
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const consumedDate = searchParams.get("date") ?? undefined;

  const normalizedMealParam = mealTime?.toUpperCase();
  const isValidMeal =
    !!normalizedMealParam && VALID_MEALS.includes(normalizedMealParam as MealTime);
  const normalizedMeal = (normalizedMealParam as MealTime) ?? "BREAKFAST";

  const { foods, isLoading, performSearch } = useFoodSearch(
    "cheddar cheese",
    "LIDL"
  );

  const {
    getAllCustomFoods,
    getMyCustomFoods,
    getOtherCustomFoods,
    createCustomFood,
    deleteCustomFood,
  } = useFoodService();

  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<MainTab>("usda");
  const [savedScope, setSavedScope] = useState<SavedScope>("own");
  const [savedFoods, setSavedFoods] = useState<Food[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [savedSearchTerm, setSavedSearchTerm] = useState("");
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  const handleSearch = (product: string, brand: string) => {
    performSearch({ product, brand });
  };

  const loadSavedFoods = useCallback(async () => {
    setSavedLoading(true);
    setSavedError(null);

    try {
      const response =
        savedScope === "own"
          ? await getMyCustomFoods()
          : savedScope === "other"
            ? await getOtherCustomFoods()
            : await getAllCustomFoods();

      const items = Array.isArray(response)
        ? response
        : ((response as { content?: CustomFoodResponse[] }).content ?? []);
      setSavedFoods(items.map(toFoodFromCustom));
    } catch (e) {
      setSavedError(e instanceof Error ? e.message : "Failed to load saved foods.");
      setSavedFoods([]);
    } finally {
      setSavedLoading(false);
    }
  }, [getAllCustomFoods, getMyCustomFoods, getOtherCustomFoods, savedScope]);

  useEffect(() => {
    if (activeTab === "saved") {
      loadSavedFoods();
    }
  }, [activeTab, loadSavedFoods]);

  const filteredSavedFoods = useMemo(() => {
    const query = savedSearchTerm.trim().toLowerCase();
    if (!query) return savedFoods;

    return savedFoods.filter((food) =>
      food.description.toLowerCase().includes(query)
    );
  }, [savedFoods, savedSearchTerm]);

  const handleCreateFood = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const name = newFood.name.trim();
    if (!name) {
      setCreateError("Name is required.");
      return;
    }

    const calories = toNumber(newFood.calories);
    const protein = toNumber(newFood.protein);
    const carbohydrates = toNumber(newFood.carbohydrates);
    const fat = toNumber(newFood.fat);

    if ([calories, protein, carbohydrates, fat].some((value) => value < 0)) {
      setCreateError("Nutrition values cannot be negative.");
      return;
    }

    setCreateLoading(true);

    try {
      await createCustomFood({
        name,
        calories,
        protein,
        carbohydrates,
        fat,
      });

      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbohydrates: "",
        fat: "",
      });

      setSavedScope("own");
      setSavedSearchTerm("");
      setActiveTab("saved");
      await loadSavedFoods();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Creation failed.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSavedFood = async (foodId?: string) => {
    if (!foodId) return;

    setActiveDeleteId(foodId);
    setSavedError(null);

    try {
      await deleteCustomFood(foodId);
      await loadSavedFoods();
    } catch (e) {
      setSavedError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setActiveDeleteId(null);
    }
  };

  if (!isValidMeal) {
    return <Navigate to="/calorie-counter" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight italic text-primary text-shadow-sm">
          CalorieX
        </h1>
        <p className="text-muted-foreground italic">Food search and custom food manager</p>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MainTab)}>
        <TabsList className="grid w-full grid-cols-3 h-auto gap-1 p-1">
          <TabsTrigger value="usda">USDA</TabsTrigger>
          <TabsTrigger value="create">Create New Food</TabsTrigger>
          <TabsTrigger value="saved">Saved Foods</TabsTrigger>
        </TabsList>

        <TabsContent value="usda" className="space-y-6">
          <FoodSearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            initialProduct="cheddar cheese"
            initialBrand="LIDL"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              <SkeletonCards count={8} />
            ) : foods.length > 0 ? (
              foods.map((food) => (
                <FoodCard
                  key={food.fdcId}
                  food={food}
                  mealTime={normalizedMeal}
                  consumedDate={consumedDate}
                />
              ))
            ) : (
              <EmptyState message="No results match your search." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Food (per 100 g)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFood} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="food-name">Name</Label>
                  <Input
                    id="food-name"
                    value={newFood.name}
                    onChange={(e) =>
                      setNewFood((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Oatmeal with milk"
                  />
                </div>

                <NutrientInput
                  id="food-calories"
                  label="Calories (kcal / 100 g)"
                  value={newFood.calories}
                  onChange={(value) =>
                    setNewFood((prev) => ({ ...prev, calories: value }))
                  }
                />

                <NutrientInput
                  id="food-protein"
                  label="Protein (g / 100 g)"
                  value={newFood.protein}
                  onChange={(value) =>
                    setNewFood((prev) => ({ ...prev, protein: value }))
                  }
                />

                <NutrientInput
                  id="food-carbs"
                  label="Carbohydrates (g / 100 g)"
                  value={newFood.carbohydrates}
                  onChange={(value) =>
                    setNewFood((prev) => ({ ...prev, carbohydrates: value }))
                  }
                />

                <NutrientInput
                  id="food-fat"
                  label="Fat (g / 100 g)"
                  value={newFood.fat}
                  onChange={(value) =>
                    setNewFood((prev) => ({ ...prev, fat: value }))
                  }
                />

                {createError && (
                  <p className="text-sm text-destructive md:col-span-2">{createError}</p>
                )}

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" disabled={createLoading}>
                    {createLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Save to Saved Foods
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Foods saved by users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                These come from the backend, and all nutrition values are per 100 g.
              </p>

              <Tabs
                value={savedScope}
                onValueChange={(value) => setSavedScope(value as SavedScope)}
              >
                <TabsList className="grid w-full grid-cols-3 h-auto gap-1 p-1">
                  <TabsTrigger value="own">Own</TabsTrigger>
                  <TabsTrigger value="other">Created by other user</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="saved-food-search">Search by name</Label>
                <Input
                  id="saved-food-search"
                  placeholder="e.g. chicken breast"
                  value={savedSearchTerm}
                  onChange={(e) => setSavedSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {savedError && <p className="text-sm text-destructive">{savedError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedLoading ? (
              <SkeletonCards count={8} />
            ) : filteredSavedFoods.length > 0 ? (
              filteredSavedFoods.map((food) => (
                <div key={food.customFoodId || food.fdcId} className="space-y-2">
                  <FoodCard
                    food={food}
                    mealTime={normalizedMeal}
                    consumedDate={consumedDate}
                  />

                  {savedScope === "own" && food.customFoodId ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDeleteSavedFood(food.customFoodId)}
                      disabled={activeDeleteId === food.customFoodId}
                    >
                      {activeDeleteId === food.customFoodId ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Remove from saved foods
                    </Button>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState message="No custom foods match your search." />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NutrientInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
      ))}
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-20 text-center space-y-3 opacity-50">
      <UtensilsCrossed className="mx-auto h-12 w-12" />
      <p className="text-xl font-medium">{message}</p>
    </div>
  );
}
