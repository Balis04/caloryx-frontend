import { useFoodSearch } from "./hooks/useFoodSearch";
import FoodCard from "./components/FoodCard";
import { FoodSearchForm } from "./components/FoodSearchForm";
import { UtensilsCrossed } from "lucide-react";

export default function FoodSearch() {
  const { foods, isLoading, performSearch } = useFoodSearch(
    "cheddar cheese",
    "LIDL"
  );

  const handleSearch = (product: string, brand: string) => {
    performSearch({ product, brand });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight italic text-primary text-shadow-sm">
          CalorieX
        </h1>
        <p className="text-muted-foreground italic">
          Official USDA Branded Food Search
        </p>
      </header>

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
          foods.map((food) => <FoodCard key={food.fdcId} food={food} />)
        ) : (
          <EmptyState />
        )}
      </div>
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

function EmptyState() {
  return (
    <div className="col-span-full py-20 text-center space-y-3 opacity-50">
      <UtensilsCrossed className="mx-auto h-12 w-12" />
      <p className="text-xl font-medium">
        Nincs találat a keresett feltételekkel.
      </p>
    </div>
  );
}
