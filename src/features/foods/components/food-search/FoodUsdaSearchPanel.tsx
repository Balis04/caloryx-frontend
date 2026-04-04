import { Database, Search } from "lucide-react";

import { GlassChip, SummaryPanel } from "@/components/caloriex";

import FoodCard from "../shared/FoodCard";
import FoodsEmptyState from "../shared/FoodsEmptyState";
import FoodsSkeletonCards from "../shared/FoodsSkeletonCards";
import { FoodSearchForm } from "./FoodSearchForm";
import type { Food, MealTime } from "../../model/food.model";

interface Props {
  consumedDate?: string;
  foods: Food[];
  isLoading: boolean;
  mealLabel: string;
  normalizedMeal: MealTime;
  onSearch: (product: string, brand: string) => void;
}

export default function FoodUsdaSearchPanel({
  consumedDate,
  foods,
  isLoading,
  mealLabel,
  normalizedMeal,
  onSearch,
}: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
      <div className="space-y-6">
        <FoodSearchForm
          onSearch={onSearch}
          isLoading={isLoading}
          initialProduct="cheddar cheese"
          initialBrand="LIDL"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <FoodsSkeletonCards count={6} />
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
            <FoodsEmptyState
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
  );
}
