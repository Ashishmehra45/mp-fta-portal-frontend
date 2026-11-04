import { useQuery } from "@tanstack/react-query";
import { getCountryCurrencies, mapApiCurrencyToAppFormat } from "@/services/intgrowApi";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  value: string; // The raw value from the API (used in API requests)
}

export function useCurrencies(importingCountryCode?: string) {
  return useQuery({
    queryKey: ["currencies", importingCountryCode],
    queryFn: async () => {
      if (!importingCountryCode) return [];
      const apiCurrencies = await getCountryCurrencies(importingCountryCode);
      return apiCurrencies.map(mapApiCurrencyToAppFormat);
    },
    enabled: !!importingCountryCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
