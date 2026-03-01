const USDA_API_KEY = "rkH2pTcapvEVulxGECFDwFqWQG6CBuDKNT6TmLBi";
const BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

export const fetchUsdaFoods = async (product: string, brand: string) => {
  const params = new URLSearchParams({
    api_key: USDA_API_KEY,
    dataType: "Branded",
    pageSize: "25",
    sortBy: "dataType.keyword",
    sortOrder: "asc",
    ...(product && { query: product }),
    ...(brand && { brandOwner: brand }),
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error("USDA API hiba történt");
  return response.json();
};
