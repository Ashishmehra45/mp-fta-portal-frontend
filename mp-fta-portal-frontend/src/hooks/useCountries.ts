import { useQuery } from "@tanstack/react-query";
import { getCountries, mapApiCountryToAppFormat } from "@/services/intgrowApi";

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  isImport: boolean;
  isExport: boolean;
}

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const apiCountries = await getCountries();
      return apiCountries.map(mapApiCountryToAppFormat);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useImportCountries() {
  const { data: countries, ...rest } = useCountries();
  return {
    data: countries?.filter((c) => c.isImport),
    ...rest,
  };
}

export function useExportCountries() {
  const { data: countries, ...rest } = useCountries();
  return {
    data: countries?.filter((c) => c.isExport),
    ...rest,
  };
}
