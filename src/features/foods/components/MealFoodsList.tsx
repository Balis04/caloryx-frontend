import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { Dispatch, SetStateAction } from "react";
import type { FoodLogResponse } from "../types";

interface MealFoodListProps {
  actionType: "update" | "delete" | null;
  activeFoodId: string | null;
  editingAmount: string;
  editingFoodId: string | null;
  foods: FoodLogResponse[];
  isLoading: boolean;
  mealTitle: string;
  beginEdit: (food: FoodLogResponse) => void;
  cancelEdit: () => void;
  handleDelete: (foodId: string) => Promise<void>;
  openAddFood: () => void;
  saveEdit: (foodId: string) => Promise<void>;
  setEditingAmount: Dispatch<SetStateAction<string>>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-center backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default function MealFoodsList({
  actionType,
  activeFoodId,
  beginEdit,
  cancelEdit,
  editingAmount,
  editingFoodId,
  foods,
  handleDelete,
  isLoading,
  mealTitle,
  openAddFood,
  saveEdit,
  setEditingAmount,
}: MealFoodListProps) {
  const canSaveEdit = Number(editingAmount) > 0;

  return (
    <div className="mt-6 space-y-4">
        {foods.map((food) => {
          const isActive = activeFoodId === food.id;
          const isEditing = editingFoodId === food.id;

          return (
            <GlassCard key={food.id} className="overflow-hidden">
              <CardContent className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xl font-semibold tracking-tight text-slate-950">
                        {food.foodName}
                      </p>

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={editingAmount}
                            onChange={(event) =>
                              setEditingAmount(event.target.value)
                            }
                            className="h-10 max-w-[140px] border-white/70 bg-white/80"
                          />
                          <span className="text-sm text-slate-600">
                            {food.unit}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">
                          {Math.round(food.amount)} {food.unit}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <MiniMetric
                        label="Calories"
                        value={`${Math.round(food.calories)} kcal`}
                      />
                      <MiniMetric
                        label="Protein"
                        value={`${Math.round(food.protein)} g`}
                      />
                      <MiniMetric
                        label="Carbs"
                        value={`${Math.round(food.carbohydrates)} g`}
                      />
                      <MiniMetric
                        label="Fat"
                        value={`${Math.round(food.fat)} g`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[170px]">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => void saveEdit(food.id)}
                        disabled={isActive || !canSaveEdit}
                        className="rounded-full"
                      >
                        {isActive && actionType === "update" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={isActive}
                        className="rounded-full border-white/70 bg-white/70"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => beginEdit(food)}
                      disabled={isActive}
                      className="rounded-full border-white/70 bg-white/70"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit amount
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => void handleDelete(food.id)}
                    disabled={isActive}
                    className="rounded-full"
                  >
                    {isActive && actionType === "delete" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
            
          );
        })}
        <GlassCard className="justify-center py-4">
          <div className="flex flex-col items-center gap-3">
            <Button 
              onClick={openAddFood} 
              className="rounded-full px-8 py-6 text-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add food
            </Button>
          </div>
        </GlassCard>
        {!isLoading && foods.length === 0 ? (
          <GlassCard>
            <CardContent className="py-16 text-center">
              <p className="text-lg font-semibold text-slate-950">
                No foods have been logged for this meal yet.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Add the first item to start tracking {mealTitle.toLowerCase()}{" "}
                on this date.
              </p>
              <div className="mt-6">
                <Button onClick={openAddFood} className="rounded-full px-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Add food
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        ) : null}
      </div>
  );
}
