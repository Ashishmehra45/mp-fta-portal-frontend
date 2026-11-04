import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getDestinationCountries, type DestinationCountry } from '@/services/rateCheck';

/** Destination markets for public tools = countries with a supplied tariff schedule file only. */
export function useDestinationCountries() {
  const { isAuthenticated } = useAuth();
  return useQuery<DestinationCountry[]>({
    queryKey: ['destination-countries', isAuthenticated],
    queryFn: getDestinationCountries,
    staleTime: 60 * 60_000,
    retry: 1,
  });
}

/** Keep the selected destination inside the live list (prefer the current one, then UAE, then the first). */
export function useKeepDestinationValid(dest: string, setDest: (c: string) => void, list?: DestinationCountry[]) {
  useEffect(() => {
    if (!list?.length || list.some((c) => c.code === dest)) return;
    setDest(list.find((c) => c.code === 'AE')?.code ?? list[0].code);
  }, [list, dest, setDest]);
}
