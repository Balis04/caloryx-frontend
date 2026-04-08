import type { UseFoodSearchPageResult } from "../hooks/food-search/useFoodSearchPage";

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
