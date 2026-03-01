import type { Nutrient } from "../types/food.types";

interface NutrientListProps {
  nutrients: Nutrient[];
  calculate: (v: number) => number;
}

export const NutrientList = ({ nutrients, calculate }: NutrientListProps) => (
  <div className="space-y-1.5 border-t border-dashed pt-3">
    {nutrients.slice(0, 4).map((n, i) => (
      <div key={i} className="flex justify-between text-xs">
        <span className="text-muted-foreground">
          {n.nutrientName.split(/[,(]/)[0].trim()}
        </span>
        <span className="font-mono font-bold">
          {calculate(n.value)} {n.unitName.toLowerCase()}
        </span>
      </div>
    ))}
  </div>
);
