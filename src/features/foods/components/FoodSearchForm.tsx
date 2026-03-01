import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface FoodSearchFormProps {
  onSearch: (product: string, brand: string) => void;
  isLoading: boolean;
  initialProduct?: string;
  initialBrand?: string;
}

export function FoodSearchForm({
  onSearch,
  isLoading,
  initialProduct = "",
  initialBrand = "",
}: FoodSearchFormProps) {
  const [product, setProduct] = useState(initialProduct);
  const [brand, setBrand] = useState(initialBrand);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(product.trim(), brand.trim());
  };

  return (
    <Card className="p-6 shadow-lg border-2 border-primary/10">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
      >
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
            Product
          </label>
          <Input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. apple juice"
            className="h-11"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
            Brand Owner
          </label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. LIDL"
            className="h-11"
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full"
          disabled={isLoading || (!product.trim() && !brand.trim())}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" /> Search
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
