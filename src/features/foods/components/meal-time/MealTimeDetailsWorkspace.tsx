import { ArrowLeft, Plus, Utensils } from "lucide-react";

import {
  CaloriexPage,
  GlassMetric,
  HeroBadge,
  PageHero,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import MealFoodsList from "./MealFoodsList";
import MealTimeDetailsHeroAside from "./MealTimeDetailsHeroAside";
import type { MealTimeDetailsWorkspaceProps } from "../../types/meal-time-workspace.types";

export default function MealTimeDetailsWorkspace({
  mealDetails,
}: MealTimeDetailsWorkspaceProps) {
  const {
    actionError,
    actionType,
    activeFoodId,
    beginEdit,
    calorieProgress,
    cancelEdit,
    consumed,
    editingAmount,
    editingFoodId,
    error,
    foods,
    formattedDate,
    handleDelete,
    isLoading,
    mealTitle,
    navigateBack,
    openAddFood,
    saveEdit,
    setEditingAmount,
    summary,
  } = mealDetails;

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to diary
          </Button>
        }
        badge={<HeroBadge>{mealTitle} details</HeroBadge>}
        title={`Review everything logged for ${mealTitle.toLowerCase()} and adjust amounts without losing context.`}
        description="This meal detail view now shares the same glass-card layout, metrics, and action structure as the other refreshed CalorieX pages."
        chips={[
          mealTitle,
          formattedDate,
          `${foods.length} logged item${foods.length === 1 ? "" : "s"}`,
        ]}
        aside={
          <MealTimeDetailsHeroAside
            consumedCalories={consumed.calories}
            foodsCount={foods.length}
            formattedDate={formattedDate}
            mealTitle={mealTitle}
            onAddFood={openAddFood}
            targetCalories={summary?.targetCalories ?? 0}
          />
        }
      />

      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_340px]">
          <SummaryPanel eyebrow="Meal summary" title="Nutrition totals" icon={Utensils}>
            <div className="space-y-6 p-6">
              {isLoading ? <p className="text-sm text-slate-600">Loading meal details...</p> : null}
              {error ? <p className="text-sm text-red-700">{error}</p> : null}

              {!isLoading && !error ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <GlassMetric
                      label="Calories"
                      value={`${Math.round(consumed.calories)} kcal`}
                      description={`Goal ${Math.round(summary?.targetCalories ?? 0)} kcal`}
                    />
                    <GlassMetric
                      label="Protein"
                      value={`${Math.round(consumed.protein)} g`}
                      description={`Goal ${Math.round(summary?.targetProteinGrams ?? 0)} g`}
                    />
                    <GlassMetric
                      label="Carbs"
                      value={`${Math.round(consumed.carbohydrates)} g`}
                      description={`Goal ${Math.round(summary?.targetCarbohydratesGrams ?? 0)} g`}
                    />
                    <GlassMetric
                      label="Fat"
                      value={`${Math.round(consumed.fat)} g`}
                      description={`Goal ${Math.round(summary?.targetFatGrams ?? 0)} g`}
                    />
                  </div>

                  <div className="space-y-3 rounded-[28px] border border-white/60 bg-white/65 p-5 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">Meal calorie progress</p>
                        <p className="text-sm text-slate-600">
                          {Math.round(consumed.calories)} consumed of{" "}
                          {Math.round(summary?.targetCalories ?? 0)} kcal
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1">
                        {Math.round(calorieProgress)}%
                      </Badge>
                    </div>
                    <Progress value={calorieProgress} className="h-3 bg-slate-200/80" />
                  </div>
                </>
              ) : null}
            </div>
          </SummaryPanel>

          <SummaryPanel
            eyebrow="Actions"
            title="Quick tools"
            icon={Plus}
            className="hidden xl:block"
          >
            <div className="space-y-4 p-6 text-sm text-slate-600">
              <p>
                Add another food, edit an amount inline, or delete an entry if the meal needs
                cleanup.
              </p>
              <div className="grid gap-3">
                <GlassMetric
                  label="Editable"
                  value="Amounts"
                  description="Each logged food can be updated directly from this screen."
                />
                <GlassMetric
                  label="Date"
                  value={formattedDate}
                  description="Changes apply only to the selected meal and day."
                />
              </div>
            </div>
          </SummaryPanel>
        </div>

        <MealFoodsList
          actionError={actionError}
          actionType={actionType}
          activeFoodId={activeFoodId}
          beginEdit={beginEdit}
          cancelEdit={cancelEdit}
          editingAmount={editingAmount}
          editingFoodId={editingFoodId}
          error={error}
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
