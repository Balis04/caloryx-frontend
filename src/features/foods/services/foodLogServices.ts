import type { FoodLogRequest, FoodLogResponse } from "../types/food.types";

export const saveFoodEntry = async (
  payload: FoodLogRequest,
  token: string
): Promise<FoodLogResponse> => {
  const response = await fetch("/food-log/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Szerver hiba történt";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (response.status === 401) errorMessage = "Bejelentkezés szükséges!";
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
