import { useQuery } from '@tanstack/react-query';
import { searchHsCodes } from '@/services/intgrowApi';
import { hasSuppliedSchedule, searchSuppliedLines } from '@/services/suppliedTariffs';

export interface HsCode {
  code: string;
  description: string;
}

export function useHsCodeSearch(query: string, importingCountryCode: string) {
  return useQuery({
    queryKey: ['hsCodes', query, importingCountryCode],
    queryFn: async () => {
      if (query.length < 2) return [];

      // Numbers search HS codes only; text searches product descriptions.
      const isNumeric = /^\s*\d[\d.\s-]*$/.test(query);
      const trimmed = isNumeric ? query.replace(/\D/g, '') : query.trim();
      if (isNumeric && trimmed.length < 2) return [];
      // Typed digits: list every code under them. Add the uploaded tariff file's lines (when the
      // importing country has one) to intGrow's results, which may return only a few codes.
      if (isNumeric) {
        const [api, file] = await Promise.all([
          searchHsCodes(trimmed.slice(0, 6), importingCountryCode).catch(() => []),
          hasSuppliedSchedule(importingCountryCode) ? searchSuppliedLines(trimmed, importingCountryCode).catch(() => []) : Promise.resolve([]),
        ]);
        const merged = new Map<string, HsCode>();
        for (const i of api) {
          const c = String(i.hs_code ?? '');
          if (c.replace(/\D/g, '').startsWith(trimmed)) merged.set(c.replace(/\D/g, ''), { code: c, description: i.product });
        }
        for (const h of file) if (!merged.has(h.code.replace(/\D/g, ''))) merged.set(h.code.replace(/\D/g, ''), { code: h.code, description: h.description });
        return [...merged.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
      }
      const codeOnly = (items: Awaited<ReturnType<typeof searchHsCodes>>) =>
        isNumeric ? items.filter((i) => String(i.hs_code ?? '').replace(/\D/g, '').startsWith(trimmed)) : items;

      // For long numeric HS codes (>6 digits) the API can return empty results
      // depending on the caller's token scope, even when a matching code exists.
      // Query with the 6-digit prefix (which is broadly supported) and filter
      // client-side by the full typed prefix so exact/partial codes always match.
      if (isNumeric && trimmed.length > 6) {
        const prefix = trimmed.slice(0, 6);
        let results = await searchHsCodes(prefix, importingCountryCode);
        // Prefer exact/prefix matches to the full query; fall back to prefix results
        const digitsOf = (c: string) => String(c ?? '').replace(/\D/g, '');
        const exact = results.filter((item) => digitsOf(item.hs_code).startsWith(trimmed));
        // Otherwise keep codes that the typed number begins with (still code-only, never description matches).
        const finalList = exact.length ? exact : results.filter((item) => digitsOf(item.hs_code).length >= 6 && trimmed.startsWith(digitsOf(item.hs_code)));
        return finalList.map((item) => ({
          code: item.hs_code,
          description: item.product,
        }));
      }

      const results = codeOnly(await searchHsCodes(trimmed, importingCountryCode));
      return results.map((item) => ({
        code: item.hs_code,
        description: item.product,
      }));
    },
    enabled: query.length >= 2 && !!importingCountryCode,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
