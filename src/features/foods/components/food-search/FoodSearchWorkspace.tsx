import { ArrowLeft } from "lucide-react";

import { CaloriexPage, HeroBadge, PageHero } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { FoodsMainTab } from "../../lib/shared/foods.presentation";
import type { FoodSearchWorkspaceProps } from "../../types/foods.types";
import FoodCreatePanel from "./FoodCreatePanel";
import FoodSavedPanel from "./FoodSavedPanel";
import FoodSearchHeroAside from "./FoodSearchHeroAside";
import FoodUsdaSearchPanel from "./FoodUsdaSearchPanel";

export default function FoodSearchWorkspace({ foodSearch }: FoodSearchWorkspaceProps) {
  const {
    activeDeleteId,
    activeTab,
    activeTabMeta,
    consumedDate,
    createError,
    createLoading,
    filteredSavedFoods,
    foods,
    formattedConsumedDate,
    isLoading,
    mealLabel,
    navigateBack,
    newFood,
    normalizedMeal,
    performSearch,
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
  } = foodSearch;

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
        badge={<HeroBadge>Food workspace</HeroBadge>}
        title={`Build ${mealLabel.toLowerCase()} faster with search, saved items, and custom foods.`}
        description="Search the USDA dataset, save reusable foods, or create your own nutrition entries without leaving the meal flow."
        chips={[mealLabel, formattedConsumedDate, activeTabMeta.label]}
        aside={
          <FoodSearchHeroAside
            activeTabDescription={activeTabMeta.description}
            activeTabLabel={activeTabMeta.label}
            formattedDate={formattedConsumedDate}
            mealLabel={mealLabel}
          />
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
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
              mealLabel={mealLabel}
              normalizedMeal={normalizedMeal}
              onSearch={(product, brand) => performSearch({ product, brand })}
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
