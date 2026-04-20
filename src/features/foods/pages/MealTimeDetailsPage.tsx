import { Utensils } from "lucide-react";

import { CaloriexPage, GlassMetric, SummaryPanel } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import MealFoodsList from "../components/MealFoodsList";
import { useMealTimeDetailsPage } from "../hooks/useMealTimeDetailsPage";

export default function MealTimeDetailsPage() {
  const {
    actionType,
    activeFoodId,
    beginEdit,
    calorieProgress,
    cancelEdit,
    consumed,
    editingAmount,
    editingFoodId,
    foods,
    handleDelete,
    isLoading,
    isValidMeal,
    mealTitle,
    openAddFood,
    saveEdit,
    setEditingAmount,
    summary,
  } = useMealTimeDetailsPage();

  if (!isValidMeal) {
    return <div className="p-6">Invalid meal type.</div>;
  }

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <SummaryPanel
          eyebrow="Meal summary"
          title="Nutrition totals"
          icon={Utensils}
        >
          <div className="space-y-6 p-6">
            {isLoading ? (
              <p className="text-sm text-slate-600">Loading meal details...</p>
            ) : null}

            {!isLoading ? (
              <>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <GlassMetric
                    label="Calories"
                    value={`${Math.round(consumed.calories)} kcal`}
                    description={`Goal ${Math.round(
                      summary?.targetCalories ?? 0
                    )} kcal`}
                  />
                  <GlassMetric
                    label="Protein"
                    value={`${Math.round(consumed.protein)} g`}
                    description={`Goal ${Math.round(
                      summary?.targetProteinGrams ?? 0
                    )} g`}
                  />
                  <GlassMetric
                    label="Carbs"
                    value={`${Math.round(consumed.carbohydrates)} g`}
                    description={`Goal ${Math.round(
                      summary?.targetCarbohydratesGrams ?? 0
                    )} g`}
                  />
                  <GlassMetric
                    label="Fat"
                    value={`${Math.round(consumed.fat)} g`}
                    description={`Goal ${Math.round(
                      summary?.targetFatGrams ?? 0
                    )} g`}
                  />
                </div>

                <div className="space-y-3 rounded-[28px] border border-white/60 bg-white/65 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-950">
                        Meal calorie progress
                      </p>
                      <p className="text-sm text-slate-600">
                        {Math.round(consumed.calories)} consumed of{" "}
                        {Math.round(summary?.targetCalories ?? 0)} kcal
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {Math.round(calorieProgress)}%
                    </Badge>
                  </div>
                  <Progress
                    value={calorieProgress}
                    className="h-3 bg-slate-200/80"
                  />
                </div>
              </>
            ) : null}
          </div>
        </SummaryPanel>

        <MealFoodsList
          actionType={actionType}
          activeFoodId={activeFoodId}
          beginEdit={beginEdit}
          cancelEdit={cancelEdit}
          editingAmount={editingAmount}
          editingFoodId={editingFoodId}
          foods={foods}
          handleDelete={handleDelete}
          isLoading={isLoading}
          mealTitle={mealTitle}
          openAddFood={openAddFood}
          saveEdit={saveEdit}
          setEditingAmount={setEditingAmount}
        />
      </section>
    </CaloriexPage>
  );
}
