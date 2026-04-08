import type { Dispatch, SetStateAction } from "react";

import type { FoodLogResponse } from "../model/food.model";

export interface MealFoodListProps {
  actionError: string | null;
  actionType: "update" | "delete" | null;
  activeFoodId: string | null;
  editingAmount: string;
  editingFoodId: string | null;
  foods: FoodLogResponse[];
  isLoading: boolean;
  error: string | null;
  mealTitle: string;
  beginEdit: (food: FoodLogResponse) => void;
  cancelEdit: () => void;
  handleDelete: (foodId: string) => Promise<void>;
  openAddFood: () => void;
  saveEdit: (foodId: string) => Promise<void>;
  setEditingAmount: Dispatch<SetStateAction<string>>;
}
