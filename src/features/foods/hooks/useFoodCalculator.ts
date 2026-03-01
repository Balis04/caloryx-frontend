import { useState } from "react";
import type { Food } from "../types/food.types";

export function useFoodCalculator(food: Food) {
  const [value, setValue] = useState<number>(100);
  const [unit, setUnit] = useState<"g" | "serv">("g");

  const totalGrams = unit === "g" ? value : value * (food.servingSize || 100);

  const calculateNutrient = (baseValue: number) =>
    Math.round((baseValue / 100) * totalGrams);

  const handleUnitChange = (newUnit: "g" | "serv") => {
    setUnit(newUnit);
    setValue(newUnit === "g" ? 100 : 1);
  };

  return {
    value,
    setValue,
    unit,
    totalGrams,
    calculateNutrient,
    handleUnitChange,
  };
}
