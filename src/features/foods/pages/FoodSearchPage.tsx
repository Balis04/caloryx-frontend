import { Navigate } from "react-router-dom";

import FoodSearchWorkspace from "../components/food-search/FoodSearchWorkspace";
import { useFoodSearchPage } from "../hooks/food-search/useFoodSearchPage";

export default function FoodSearchPage() {
  const foodSearch = useFoodSearchPage();

  if (!foodSearch.isValidMeal) {
    return <Navigate to="/calorie-counter" replace />;
  }

  return <FoodSearchWorkspace foodSearch={foodSearch} />;
}
