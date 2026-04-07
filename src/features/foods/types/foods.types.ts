import type { Dispatch, SetStateAction } from "react";

import type { UseDiaryPageResult } from "../hooks/diary/useDiaryPage";
import type { UseFoodSearchPageResult } from "../hooks/food-search/useFoodSearchPage";
import type { UseMealTimeDetailsPageResult } from "../hooks/meal-time/useMealTimeDetailsPage";
import type { FoodLogResponse } from "../model/food.model";

export interface FoodSearchWorkspaceProps {
  foodSearch: UseFoodSearchPageResult;
}

export interface NewFoodDraft {
  name: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
}

export interface DiaryWorkspaceProps {
  diary: UseDiaryPageResult;
}

export interface MealTimeDetailsWorkspaceProps {
  mealDetails: UseMealTimeDetailsPageResult;
}

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
