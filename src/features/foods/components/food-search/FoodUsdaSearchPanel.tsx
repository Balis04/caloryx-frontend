import {Search } from "lucide-react";

import FoodCard from "../shared/FoodCard";
import FoodsEmptyState from "../shared/FoodsEmptyState";
import FoodsSkeletonCards from "../shared/FoodsSkeletonCards";
import { FoodSearchForm } from "./FoodSearchForm";
import type { Food, MealTime } from "../../model/food.model";

interface Props {
  consumedDate?: string;
  foods: Food[];
  isLoading: boolean;
  normalizedMeal: MealTime;
  onSearch: (product: string, brand: string) => void;
}

export default function FoodUsdaSearchPanel({
  consumedDate,
  foods,
  isLoading,
  normalizedMeal,
  onSearch,
}: Props) {
  return (
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
  );
}
