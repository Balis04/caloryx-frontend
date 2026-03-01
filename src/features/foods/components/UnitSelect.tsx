import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { Food } from "../types/food.types";

interface UnitSelectProps {
  unit: "g" | "serv";
  food: Food;
  onUnitChange: (unit: "g" | "serv") => void;
}

export const UnitSelect = ({ unit, food, onUnitChange }: UnitSelectProps) => {
  return (
    <Select value={unit} onValueChange={(v: "g" | "serv") => onUnitChange(v)}>
      <SelectTrigger className="h-9 w-[120px] bg-white font-medium text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="g">{food.servingSizeUnit || "g/ml"}</SelectItem>
        {food.servingSize && (
          <SelectItem value="serv">
            Serving ({food.servingSize} {food.servingSizeUnit})
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};
