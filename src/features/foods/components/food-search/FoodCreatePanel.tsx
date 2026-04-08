import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Loader2, NotebookPen } from "lucide-react";

import { GlassCard, GlassMetric, SummaryPanel } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { NewFoodDraft } from "../../types/food-search.types";

interface NutrientInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function NutrientInput({ id, label, value, onChange }: NutrientInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 border-white/70 bg-white/75"
      />
    </div>
  );
}

interface Props {
  createError: string | null;
  createLoading: boolean;
  newFood: NewFoodDraft;
  onCreateFood: (event: FormEvent) => Promise<void>;
  onNewFoodChange: Dispatch<SetStateAction<NewFoodDraft>>;
}

export default function FoodCreatePanel({
  createError,
  createLoading,
  newFood,
  onCreateFood,
  onNewFoodChange,
}: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
      <GlassCard>
        <CardHeader className="border-b border-white/50 pb-5">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
            Create custom food
          </CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Save nutrition values per 100 grams so the item becomes reusable in future meal
            logging.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={(event) => void onCreateFood(event)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="food-name">Name</Label>
              <Input
                id="food-name"
                value={newFood.name}
                onChange={(e) =>
                  onNewFoodChange((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Oatmeal with milk"
                className="h-11 border-white/70 bg-white/75"
              />
            </div>

            <NutrientInput
              id="food-calories"
              label="Calories (kcal / 100 g)"
              value={newFood.calories}
              onChange={(value) =>
                onNewFoodChange((prev) => ({ ...prev, calories: value }))
              }
            />
            <NutrientInput
              id="food-protein"
              label="Protein (g / 100 g)"
              value={newFood.protein}
              onChange={(value) => onNewFoodChange((prev) => ({ ...prev, protein: value }))}
            />
            <NutrientInput
              id="food-carbs"
              label="Carbohydrates (g / 100 g)"
              value={newFood.carbohydrates}
              onChange={(value) =>
                onNewFoodChange((prev) => ({ ...prev, carbohydrates: value }))
              }
            />
            <NutrientInput
              id="food-fat"
              label="Fat (g / 100 g)"
              value={newFood.fat}
              onChange={(value) => onNewFoodChange((prev) => ({ ...prev, fat: value }))}
            />

            {createError ? (
              <p className="text-sm text-red-700 md:col-span-2">{createError}</p>
            ) : null}

            <div className="flex justify-end md:col-span-2">
              <Button type="submit" disabled={createLoading} className="rounded-full px-6">
                {createLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save to saved foods
              </Button>
            </div>
          </form>
        </CardContent>
      </GlassCard>

      <SummaryPanel
        eyebrow="Custom entry"
        title="Entry rules"
        icon={NotebookPen}
        className="hidden xl:block"
      >
        <div className="space-y-4 p-6 text-sm text-slate-600">
          <p>
            Name your item clearly and keep the macros aligned to 100 grams for easier reuse.
          </p>
          <div className="grid gap-3">
            <GlassMetric
              label="Format"
              value="Per 100 g"
              description="This keeps the calculator consistent across saved foods."
            />
            <GlassMetric
              label="Reuse"
              value="Own list"
              description="Freshly created foods land in your saved-food collection."
            />
          </div>
        </div>
      </SummaryPanel>
    </div>
  );
}
