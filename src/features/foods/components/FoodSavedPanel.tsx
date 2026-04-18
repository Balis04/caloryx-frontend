import { Loader2, Trash2, UtensilsCrossed } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FoodCard from "./FoodCard";
import FoodsEmptyState from "./FoodsEmptyState";
import FoodsSkeletonCards from "./FoodsSkeletonCards";
import type { SavedFoodsScope } from "../lib/foods.constants";
import type { Food, MealTime } from "../types";

interface Props {
  activeDeleteId: string | null;
  consumedDate?: string;
  foods: Food[];
  normalizedMeal: MealTime;
  savedError: string | null;
  savedLoading: boolean;
  savedScope: SavedFoodsScope;
  savedSearchTerm: string;
  setSavedScope: (value: SavedFoodsScope) => void;
  setSavedSearchTerm: (value: string) => void;
  onDeleteSavedFood: (foodId?: string) => Promise<void>;
}

export default function FoodSavedPanel({
  activeDeleteId,
  consumedDate,
  foods,
  normalizedMeal,
  onDeleteSavedFood,
  savedError,
  savedLoading,
  savedScope,
  savedSearchTerm,
  setSavedScope,
  setSavedSearchTerm,
}: Props) {
  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader className="border-b border-white/50 pb-5">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
            Saved foods
          </CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Browse foods from the backend and filter them before adding them to
            this meal.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <Tabs
            value={savedScope}
            onValueChange={(value) => setSavedScope(value as SavedFoodsScope)}
          >
            <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-[22px] border border-white/60 bg-slate-100/60 p-2">
              <TabsTrigger value="own" className="rounded-[18px] py-2 text-sm">
                Own
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="rounded-[18px] py-2 text-sm"
              >
                Others
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-[18px] py-2 text-sm">
                All
              </TabsTrigger>
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

          {savedError ? (
            <p className="text-sm text-red-700">{savedError}</p>
          ) : null}
        </CardContent>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {savedLoading ? (
          <FoodsSkeletonCards count={6} />
        ) : foods.length > 0 ? (
          foods.map((food) => (
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
                  onClick={() => void onDeleteSavedFood(food.customFoodId)}
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
          <FoodsEmptyState
            icon={UtensilsCrossed}
            message="No custom foods match your search."
            description="Try another keyword or switch to a broader saved-food scope."
          />
        )}
      </div>
    </div>
  );
}
