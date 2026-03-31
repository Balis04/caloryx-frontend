import { useState } from "react";
import { Loader2, Search } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <GlassCard>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-end">
          <div className="space-y-2 md:col-span-2">
            <label className="ml-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Product
            </label>
            <Input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. apple juice"
              className="h-11 border-white/70 bg-white/80"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="ml-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Brand owner
            </label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. LIDL"
              className="h-11 border-white/70 bg-white/80"
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-full"
            disabled={isLoading || (!product.trim() && !brand.trim())}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </GlassCard>
  );
}
