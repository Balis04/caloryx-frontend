import { Navigate } from "react-router-dom";
import { CaloriexPage } from "@/components/caloriex";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FoodCreatePanel from "../components/food-search/FoodCreatePanel";
import FoodSavedPanel from "../components/food-search/FoodSavedPanel";
import FoodUsdaSearchPanel from "../components/food-search/FoodUsdaSearchPanel";
import { useFoodSearchPage } from "../hooks/food-search/useFoodSearchPage";
import type { FoodsMainTab } from "../lib/shared/foods.presentation";

export default function FoodSearchPage() {
  const {
    activeDeleteId,
    activeTab,
    consumedDate,
    createError,
    createLoading,
    filteredSavedFoods,
    foods,
    isLoading,
    isValidMeal,
    newFood,
    onSearch,
    normalizedMeal,
    savedError,
    savedLoading,
    savedScope,
    savedSearchTerm,
    setActiveTab,
    setNewFood,
    setSavedScope,
    setSavedSearchTerm,
    handleCreateFood,
    handleDeleteSavedFood,
  } = useFoodSearchPage();

  if (!isValidMeal) {
    return <Navigate to="/calorie-counter" replace />;
  }

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FoodsMainTab)}>
          <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-[28px] border border-white/60 bg-white/55 p-2 backdrop-blur">
            <TabsTrigger value="usda" className="rounded-[20px] py-3 text-sm">
              USDA
            </TabsTrigger>
            <TabsTrigger value="create" className="rounded-[20px] py-3 text-sm">
              Create food
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-[20px] py-3 text-sm">
              Saved foods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usda" className="mt-8">
            <FoodUsdaSearchPanel
              consumedDate={consumedDate}
              foods={foods}
              isLoading={isLoading}
              normalizedMeal={normalizedMeal}
              onSearch={(product, brand) => void onSearch(product, brand)}
            />
          </TabsContent>

          <TabsContent value="create" className="mt-8">
            <FoodCreatePanel
              createError={createError}
              createLoading={createLoading}
              newFood={newFood}
              onCreateFood={handleCreateFood}
              onNewFoodChange={setNewFood}
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            <FoodSavedPanel
              activeDeleteId={activeDeleteId}
              consumedDate={consumedDate}
              foods={filteredSavedFoods}
              normalizedMeal={normalizedMeal}
              onDeleteSavedFood={handleDeleteSavedFood}
              savedError={savedError}
              savedLoading={savedLoading}
              savedScope={savedScope}
              savedSearchTerm={savedSearchTerm}
              setSavedScope={setSavedScope}
              setSavedSearchTerm={setSavedSearchTerm}
            />
          </TabsContent>
        </Tabs>
      </section>
    </CaloriexPage>
  );
}
