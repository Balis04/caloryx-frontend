import { Navigate } from "react-router-dom";
import { CaloriexPage } from "@/components/caloriex";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FoodCreatePanel from "../components/FoodCreatePanel";
import FoodSavedPanel from "../components/FoodSavedPanel";
import FoodUsdaSearchPanel from "../components/FoodUsdaSearchPanel";
import { useCustomFoods } from "../hooks/useCustomFoods";
import { useFoodSearchPage } from "../hooks/useFoodSearchPage";
import { useUsdaFoodSearch } from "../hooks/useUsdaFoodSearch";
import type { FoodsMainTab } from "../lib/foods.formatters";

export default function FoodSearchPage() {
  const { activeTab, consumedDate, isValidMeal, normalizedMeal, setActiveTab } =
    useFoodSearchPage();
  const usdaFoods = useUsdaFoodSearch();
  const customFoods = useCustomFoods({
    isSavedTabActive: activeTab === "saved",
    onCreated: () => setActiveTab("saved"),
  });

  if (!isValidMeal) {
    return <Navigate to="/calorie-counter" replace />;
  }

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as FoodsMainTab)}
        >
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
              foods={usdaFoods.foods}
              isLoading={usdaFoods.loading}
              normalizedMeal={normalizedMeal}
              onSearch={(product, brand) =>
                void usdaFoods.search(product, brand)
              }
            />
          </TabsContent>

          <TabsContent value="create" className="mt-8">
            <FoodCreatePanel
              createError={customFoods.createError}
              createLoading={customFoods.createLoading}
              newFood={customFoods.form}
              onCreateFood={customFoods.createFood}
              onNewFoodChange={customFoods.setForm}
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            <FoodSavedPanel
              activeDeleteId={customFoods.activeDeleteId}
              consumedDate={consumedDate}
              foods={customFoods.filteredSavedFoods}
              normalizedMeal={normalizedMeal}
              onDeleteSavedFood={customFoods.deleteSavedFood}
              savedError={customFoods.savedError}
              savedLoading={customFoods.savedLoading}
              savedScope={customFoods.savedScope}
              savedSearchTerm={customFoods.savedSearchTerm}
              setSavedScope={customFoods.setSavedScope}
              setSavedSearchTerm={customFoods.setSavedSearchTerm}
            />
          </TabsContent>
        </Tabs>
      </section>
    </CaloriexPage>
  );
}
