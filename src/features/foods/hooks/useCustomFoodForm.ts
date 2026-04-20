import type { FormEvent } from "react";
import { useState } from "react";

import { createCustomFood } from "../api/food.api";
import { initialCustomFoodForm } from "../lib/foods.form";
import { validateCustomFoodForm } from "../lib/foods.validation";
import type { CustomFoodForm } from "../types";

interface UseCustomFoodFormOptions {
  onCreated?: () => void;
}

export const useCustomFoodForm = ({
  onCreated,
}: UseCustomFoodFormOptions = {}) => {
  const [form, setForm] = useState<CustomFoodForm>(initialCustomFoodForm);
  const [createLoading, setCreateLoading] = useState(false);
  const canSave = validateCustomFoodForm(form) === null;

  const createFood = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSave) {
      return;
    }

    setCreateLoading(true);

    try {
      await createCustomFood({
        name: form.name.trim(),
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbohydrates: Number(form.carbohydrates) || 0,
        fat: Number(form.fat) || 0,
      });
      setForm(initialCustomFoodForm);
      onCreated?.();
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    canSave,
    createFood,
    createLoading,
    form,
    setForm,
  };
};
