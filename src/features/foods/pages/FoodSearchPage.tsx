import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Loader2,
  NotebookPen,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

import {
  CaloriexPage,
  GlassCard,
  GlassChip,
  GlassMetric,
  HeroBadge,
  PageHero,
  SummaryPanel,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FoodCard from "../components/FoodCard";
import { FoodSearchForm } from "../components/FoodSearchForm";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useFoodService } from "../hooks/useFoodService";
import type { CustomFoodResponse, Food, MealTime, Nutrient } from "../model/food.model";

const VALID_MEALS: MealTime[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

type MainTab = "usda" | "create" | "saved";
type SavedScope = "own" | "other" | "all";

const MEAL_LABELS: Record<MealTime, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snacks",
};

const TAB_META: Record<MainTab, { label: string; description: string }> = {
  usda: {
    label: "USDA search",
    description: "Search public food entries and log them straight into the selected meal.",
  },
  create: {
    label: "Create custom food",
    description: "Save your own reusable food with nutrition values per 100 grams.",
  },
  saved: {
    label: "Saved foods",
    description: "Browse food items already created by you or other users.",
  },
};

const formatDateLabel = (date?: string) => {
  if (!date) return "Today";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

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

const pickNumber = (food: CustomFoodResponse, keys: Array<keyof CustomFoodResponse>): number => {
  for (const key of keys) {
    const value = food[key];
    if (typeof value === "number") return value;
  }
  return 0;
};

const toFoodFromCustom = (food: CustomFoodResponse): Food => {
  const calories = pickNumber(food, ["calories", "caloriesPer100g"]);
  const protein = pickNumber(food, ["protein", "proteinPer100g"]);
  const carbohydrates = pickNumber(food, ["carbohydrates", "carbohydratesPer100g"]);
  const fat = pickNumber(food, ["fat", "fatPer100g"]);

  const nutrients: Nutrient[] = [
    { nutrientName: "Energy", unitName: "kcal", value: calories },
    { nutrientName: "Protein", unitName: "g", value: protein },
    { nutrientName: "Carbohydrate, by difference", unitName: "g", value: carbohydrates },
    { nutrientName: "Total lipid (fat)", unitName: "g", value: fat },
  ];

  return {
    fdcId: toStableNumber(food.id),
    customFoodId: food.id,
    description: food.name || food.foodName || "Untitled custom food",
    brandOwner: food.brandOwner || food.createdByName || food.createdBy || "User custom food",
    servingSizeUnit: "g",
    servingSize: 100,
    foodNutrients: nutrients,
  };
};

export default function FoodSearchPage() {
  const navigate = useNavigate();
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const consumedDate = searchParams.get("date") ?? undefined;

  const normalizedMealParam = mealTime?.toUpperCase();
  const isValidMeal =
    !!normalizedMealParam && VALID_MEALS.includes(normalizedMealParam as MealTime);
  const normalizedMeal = (normalizedMealParam as MealTime) ?? "BREAKFAST";

  const { foods, isLoading, performSearch } = useFoodSearch("cheddar cheese", "LIDL");
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
      void loadSavedFoods();
    }
  }, [activeTab, loadSavedFoods]);

  const filteredSavedFoods = useMemo(() => {
    const query = savedSearchTerm.trim().toLowerCase();
    if (!query) return savedFoods;
    return savedFoods.filter((food) => food.description.toLowerCase().includes(query));
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
      await createCustomFood({ name, calories, protein, carbohydrates, fat });

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

  const mealLabel = MEAL_LABELS[normalizedMeal];
  const activeTabMeta = TAB_META[activeTab];

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
        badge={<HeroBadge>Food workspace</HeroBadge>}
        title={`Build ${mealLabel.toLowerCase()} faster with search, saved items, and custom foods.`}
        description="Search the USDA dataset, save reusable foods, or create your own nutrition entries without leaving the meal flow."
        chips={[mealLabel, formatDateLabel(consumedDate), activeTabMeta.label]}
        aside={
          <GlassCard className="hidden overflow-hidden xl:block">
            <CardContent className="space-y-6 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Current focus</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  {activeTabMeta.label}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{activeTabMeta.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <GlassMetric
                  label="Meal"
                  value={mealLabel}
                  description="Selected destination for the next food log."
                />
                <GlassMetric
                  label="Date"
                  value={formatDateLabel(consumedDate)}
                  description="Foods added here will use this diary date."
                />
              </div>
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MainTab)}>
          <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-[28px] border border-white/60 bg-white/55 p-2 backdrop-blur">
            <TabsTrigger value="usda" className="rounded-[20px] py-3 text-sm">USDA</TabsTrigger>
            <TabsTrigger value="create" className="rounded-[20px] py-3 text-sm">Create food</TabsTrigger>
            <TabsTrigger value="saved" className="rounded-[20px] py-3 text-sm">Saved foods</TabsTrigger>
          </TabsList>

          <TabsContent value="usda" className="mt-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
              <div className="space-y-6">
                <FoodSearchForm
                  onSearch={(product, brand) => performSearch({ product, brand })}
                  isLoading={isLoading}
                  initialProduct="cheddar cheese"
                  initialBrand="LIDL"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {isLoading ? (
                    <SkeletonCards count={6} />
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
                    <EmptyState
                      icon={Search}
                      message="No results match your search."
                      description="Try a broader product name or remove the brand filter."
                    />
                  )}
                </div>
              </div>

              <SummaryPanel
                eyebrow="Search flow"
                title="How this works"
                icon={Database}
                className="hidden xl:block"
              >
                <div className="space-y-4 p-6 text-sm text-slate-600">
                  <p>
                    USDA results are shown with estimated nutrients, then you can adjust the amount
                    before logging the item into your diary.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <GlassChip>Search product + brand</GlassChip>
                    <GlassChip>Adjust grams or servings</GlassChip>
                    <GlassChip>Save into {mealLabel.toLowerCase()}</GlassChip>
                  </div>
                </div>
              </SummaryPanel>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
              <GlassCard>
                <CardHeader className="border-b border-white/50 pb-5">
                  <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                    Create custom food
                  </CardTitle>
                  <p className="text-sm leading-6 text-slate-600">
                    Save nutrition values per 100 grams so the item becomes reusable in future meal logging.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCreateFood} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="food-name">Name</Label>
                      <Input
                        id="food-name"
                        value={newFood.name}
                        onChange={(e) => setNewFood((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Oatmeal with milk"
                        className="h-11 border-white/70 bg-white/75"
                      />
                    </div>

                    <NutrientInput
                      id="food-calories"
                      label="Calories (kcal / 100 g)"
                      value={newFood.calories}
                      onChange={(value) => setNewFood((prev) => ({ ...prev, calories: value }))}
                    />
                    <NutrientInput
                      id="food-protein"
                      label="Protein (g / 100 g)"
                      value={newFood.protein}
                      onChange={(value) => setNewFood((prev) => ({ ...prev, protein: value }))}
                    />
                    <NutrientInput
                      id="food-carbs"
                      label="Carbohydrates (g / 100 g)"
                      value={newFood.carbohydrates}
                      onChange={(value) => setNewFood((prev) => ({ ...prev, carbohydrates: value }))}
                    />
                    <NutrientInput
                      id="food-fat"
                      label="Fat (g / 100 g)"
                      value={newFood.fat}
                      onChange={(value) => setNewFood((prev) => ({ ...prev, fat: value }))}
                    />

                    {createError ? <p className="text-sm text-red-700 md:col-span-2">{createError}</p> : null}

                    <div className="flex justify-end md:col-span-2">
                      <Button type="submit" disabled={createLoading} className="rounded-full px-6">
                        {createLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save to saved foods
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </GlassCard>

              <SummaryPanel
                eyebrow="Custom entry"
                title="Entry rules"
                icon={NotebookPen}
                className="hidden xl:block"
              >
                <div className="space-y-4 p-6 text-sm text-slate-600">
                  <p>Name your item clearly and keep the macros aligned to 100 grams for easier reuse.</p>
                  <div className="grid gap-3">
                    <GlassMetric
                      label="Format"
                      value="Per 100 g"
                      description="This keeps the calculator consistent across saved foods."
                    />
                    <GlassMetric
                      label="Reuse"
                      value="Own list"
                      description="Freshly created foods land in your saved-food collection."
                    />
                  </div>
                </div>
              </SummaryPanel>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
              <div className="space-y-6">
                <GlassCard>
                  <CardHeader className="border-b border-white/50 pb-5">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                      Saved foods
                    </CardTitle>
                    <p className="text-sm leading-6 text-slate-600">
                      Browse foods from the backend and filter them before adding them to this meal.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <Tabs value={savedScope} onValueChange={(value) => setSavedScope(value as SavedScope)}>
                      <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-[22px] border border-white/60 bg-slate-100/60 p-2">
                        <TabsTrigger value="own" className="rounded-[18px] py-2 text-sm">Own</TabsTrigger>
                        <TabsTrigger value="other" className="rounded-[18px] py-2 text-sm">Others</TabsTrigger>
                        <TabsTrigger value="all" className="rounded-[18px] py-2 text-sm">All</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="space-y-2">
                      <Label htmlFor="saved-food-search">Search by name</Label>
                      <Input
                        id="saved-food-search"
                        placeholder="e.g. chicken breast"
                        value={savedSearchTerm}
                        onChange={(e) => setSavedSearchTerm(e.target.value)}
                        className="h-11 border-white/70 bg-white/75"
                      />
                    </div>

                    {savedError ? <p className="text-sm text-red-700">{savedError}</p> : null}
                  </CardContent>
                </GlassCard>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {savedLoading ? (
                    <SkeletonCards count={6} />
                  ) : filteredSavedFoods.length > 0 ? (
                    filteredSavedFoods.map((food) => (
                      <div key={food.customFoodId || food.fdcId} className="space-y-3">
                        <FoodCard
                          food={food}
                          mealTime={normalizedMeal}
                          consumedDate={consumedDate}
                        />

                        {savedScope === "own" && food.customFoodId ? (
                          <Button
                            variant="outline"
                            className="w-full rounded-full border-white/70 bg-white/70"
                            onClick={() => handleDeleteSavedFood(food.customFoodId)}
                            disabled={activeDeleteId === food.customFoodId}
                          >
                            {activeDeleteId === food.customFoodId ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Remove from saved foods
                          </Button>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={UtensilsCrossed}
                      message="No custom foods match your search."
                      description="Try another keyword or switch to a broader saved-food scope."
                    />
                  )}
                </div>
              </div>

              <SummaryPanel
                eyebrow="Saved library"
                title="Filters"
                icon={Database}
                className="hidden xl:block"
              >
                <div className="space-y-4 p-6 text-sm text-slate-600">
                  <p>
                    Narrow the list to your own foods, foods from other users, or everything stored
                    in the backend.
                  </p>
                  <div className="grid gap-3">
                    <GlassMetric
                      label="Scope"
                      value={savedScope === "own" ? "Own" : savedScope === "other" ? "Others" : "All"}
                      description="Changes which saved-food dataset gets loaded."
                    />
                    <GlassMetric
                      label="Visible items"
                      value={String(filteredSavedFoods.length)}
                      description="Filtered cards currently shown on the page."
                    />
                  </div>
                </div>
              </SummaryPanel>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </CaloriexPage>
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
        className="h-11 border-white/70 bg-white/75"
      />
    </div>
  );
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} className="h-72 animate-pulse bg-white/40" />
      ))}
    </>
  );
}

function EmptyState({
  icon: Icon,
  message,
  description,
}: {
  icon: typeof Search;
  message: string;
  description: string;
}) {
  return (
    <GlassCard className="col-span-full">
      <CardContent className="space-y-3 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-500">
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-xl font-semibold text-slate-950">{message}</p>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </GlassCard>
  );
}
