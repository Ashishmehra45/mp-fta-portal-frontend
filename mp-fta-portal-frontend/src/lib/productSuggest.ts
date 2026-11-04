import { masterOdopProducts, masterProducts, TRADE_FILLER_WORDS, type MasterOdopProduct, type MasterProduct } from '@/data/productMaster';

/**
 * Product / HS code suggestions from the supplied product master (src/data/productMaster.ts).
 * Every product or HS code search box on the portal uses these so suggestions stay identical.
 */

export type ProductSuggestion =
  | { kind: 'hs'; product: MasterProduct }
  | { kind: 'odop'; product: MasterOdopProduct };

const filler = new Set(TRADE_FILLER_WORDS);
const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];
/** Rough singular form so "mangoes" finds "mango" and "chilli" finds "chillies". */
const stem = (w: string) => (w.length > 4 && w.endsWith('ies') ? w.slice(0, -3) + 'i' : w.length > 4 && w.endsWith('oes') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);

/** Query words with generic trade words ("buy", "supplier", "export"…) removed. */
export function queryWords(query: string): string[] {
  const all = words(query);
  const kept = all.filter((w) => !filler.has(w));
  return kept.length ? kept : all;
}

/** Search text without generic trade words — what is actually looked up in a tariff file. */
export function cleanSearchQuery(query: string): string {
  if (/^\s*\d[\d.\s-]*$/.test(query)) return query.trim();
  return queryWords(query).join(' ');
}

const matches = (token: string, text: string[]) => {
  const t = stem(token);
  return text.some((w) => stem(w).startsWith(t));
};

function score(tokens: string[], primary: string[], secondary: string[]): number {
  let s = 0;
  for (const t of tokens) {
    if (matches(t, primary)) s += 2;
    else if (matches(t, secondary)) s += 1;
    else return 0;
  }
  if (primary[0] && stem(primary[0]).startsWith(stem(tokens[0]))) s += 1;
  return s;
}

export function suggestProducts(query: string, limit = 6): ProductSuggestion[] {
  const q = query.trim();
  if (q.length < 2) return [];

  if (/^\d[\d.\s-]*$/.test(q)) {
    const digits = q.replace(/\D/g, '');
    if (digits.length < 2) return [];
    return masterProducts
      .filter((p) => p.hs.startsWith(digits) || (digits.length > p.hs.length && digits.startsWith(p.hs)))
      .slice(0, limit)
      .map((product) => ({ kind: 'hs' as const, product }));
  }

  const tokens = queryWords(q).filter((t) => t.length >= 2);
  if (!tokens.length) return [];

  const hs = masterProducts
    .map((product) => ({ product, s: score(tokens, words(product.name), words(product.category)) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.product.name.length - b.product.name.length)
    .map(({ product }) => ({ kind: 'hs' as const, product }));

  const odop = masterOdopProducts
    .map((product) => ({
      product,
      s: score(tokens, [...words(product.name), ...product.keywords.flatMap(words)], [...product.districts.flatMap(words), ...words(product.category)]),
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ product }) => ({ kind: 'odop' as const, product }));

  const odopShown = odop.slice(0, Math.min(2, limit));
  return [...hs.slice(0, limit - odopShown.length), ...odopShown];
}

/** Turn a product form ("split chickpeas/chana dal") into tariff-file search words. */
export const formToQuery = (form: string) => cleanSearchQuery(form.replace(/[/()-]/g, ' '));
