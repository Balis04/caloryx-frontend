import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Loader2, UtensilsCrossed } from "lucide-react";
import FoodCard from "./components/FoodCard";
import { useFoodSearch } from "./hooks/useFoodSearch";

interface SearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  placeholder?: string;
}

export default function FoodSearch() {
  const [productInput, setProductInput] = useState("cheddar cheese");
  const [brandInput, setBrandInput] = useState("LIDL");

  const { foods, isLoading, performSearch } = useFoodSearch(
    productInput,
    brandInput
  );

  const handleSearch = () => {
    performSearch({ product: productInput.trim(), brand: brandInput.trim() });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight italic text-primary">
          FoodScout
        </h1>
        <p className="text-muted-foreground">
          Official USDA Branded Food Search
        </p>
      </header>

      <Card className="p-6 shadow-lg border-2 border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <SearchInput
            label="Product"
            value={productInput}
            onChange={setProductInput}
            onEnter={handleSearch}
            placeholder="e.g. apple juice"
          />
          <SearchInput
            label="Brand Owner"
            value={brandInput}
            onChange={setBrandInput}
            onEnter={handleSearch}
            placeholder="e.g. LIDL"
          />
          <Button
            onClick={handleSearch}
            className="h-11 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" /> Search
              </>
            )}
          </Button>
        </div>
      </Card>

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

function SearchInput({
  label,
  value,
  onChange,
  onEnter,
  placeholder,
}: SearchInputProps) {
  return (
    <div className="md:col-span-2 space-y-2">
      <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder={placeholder}
        className="h-11"
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
