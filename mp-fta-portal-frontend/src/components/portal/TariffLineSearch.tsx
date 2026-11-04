import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { searchSuppliedLines, type TariffLineHit } from '@/services/suppliedTariffs';
import { cleanApiText } from '@/lib/utils';
import { cleanSearchQuery, formToQuery, suggestProducts } from '@/lib/productSuggest';
import { ProductSuggestions } from '@/components/portal/ProductSuggestions';

interface Props {
  id: string;
  dest: string;
  destName: string;
  query: string;
  onQueryChange: (q: string) => void;
  onPick: (hit: TariffLineHit) => void;
  placeholder?: string;
  defaultOpen?: boolean;
}

/** Last part of a hierarchical file description ("Heading: Garlic: Other" → "Other"). */
export const leafDescription = (d: string) => {
  const parts = cleanApiText(d).split(/\s*:\s+/).filter(Boolean);
  return parts.length > 1 ? parts.slice(-2).join(' — ') : parts[0] ?? '';
};

/** Product / HS code search that only offers tariff lines from the destination's supplied file. */
export function TariffLineSearch({ id, dest, destName, query, onQueryChange, onPick, placeholder, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);
  const q = useDebounce(cleanSearchQuery(query), 300);
  // Suggestions from the product list; hidden once a full 6-digit code is typed.
  const suggestions = useMemo(() => (/^\d{6,}$/.test(query.replace(/[\s.]/g, '')) ? [] : suggestProducts(query, 5)), [query]);
  const enabled = !!dest && (/^\d/.test(q) ? q.replace(/\D/g, '').length >= 2 : q.length >= 2);
  const res = useQuery({
    queryKey: ['supplied-line-search', dest, q],
    queryFn: () => searchSuppliedLines(q, dest),
    enabled,
    staleTime: 10 * 60_000,
    retry: 1,
  });
  const hits = res.data ?? [];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={query}
          onChange={(e) => { onQueryChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          placeholder={placeholder ?? 'Type a product or HS code'}
          autoComplete="off"
          className="pl-9 pr-9"
          role="combobox"
          aria-expanded={open && (enabled || suggestions.length > 0)}
          aria-controls={`${id}-results`}
        />
        {res.isFetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>
      {open && (suggestions.length > 0 || (enabled && (res.data || res.isError))) && (
        <div id={`${id}-results`} className="absolute z-30 mt-1 max-h-[26rem] w-full overflow-y-auto rounded-md border bg-popover shadow-raised">
          <ProductSuggestions
            suggestions={suggestions}
            className="border-b"
            onPickCode={(hs) => { onQueryChange(hs); setOpen(true); }}
            onPickForm={(f) => { onQueryChange(formToQuery(f)); setOpen(true); }}
          />
          {!(enabled && (res.data || res.isError)) ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">{res.isFetching ? `Searching the ${destName} tariff file…` : 'Pick a suggestion to see its tariff lines.'}</p>
          ) : res.isError ? (
            <p className="px-3 py-3 text-sm text-warning">The {destName} tariff file could not be searched. Please try again.</p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">No match in the {destName} tariff file. Try another word or the HS code.</p>
          ) : (
            <ul role="listbox" aria-label={`Tariff lines in the ${destName} file`}>
              {hits.map((h) => (
                <li key={h.code} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { onPick(h); setOpen(false); }}
                    className="flex w-full items-start gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span className="shrink-0 pt-0.5 font-mono text-xs font-semibold">{h.code}</span>
                    <span className="min-w-0">
                      <span className="block">{leafDescription(h.description)}</span>
                      <span className="block truncate text-xs text-muted-foreground">{cleanApiText(h.description)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="border-t bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">Tariff lines from the {destName} tariff file</p>
        </div>
      )}
    </div>
  );
}
