import MealTimeDetailsWorkspace from "../components/meal-time/MealTimeDetailsWorkspace";
import { useMealTimeDetailsPage } from "../hooks/meal-time/useMealTimeDetailsPage";

export default function MealTimeDetailsPage() {
  const mealDetails = useMealTimeDetailsPage();

  if (!mealDetails.isValidMeal) {
    return <div className="p-6">Invalid meal type.</div>;
  }

  return <MealTimeDetailsWorkspace mealDetails={mealDetails} />;
}
