import { Sparkles } from 'lucide-react';
import type { ProductSuggestion } from '@/lib/productSuggest';

interface Props {
  suggestions: ProductSuggestion[];
  /** A product with an HS reference was chosen. */
  onPickCode: (hs: string, name: string) => void;
  /** An MP ODOP product form (no HS code in the product list) was chosen. */
  onPickForm: (form: string, name: string) => void;
  className?: string;
}

/** "Suggested products" block shared by every product / HS code search box. */
export function ProductSuggestions({ suggestions, onPickCode, onPickForm, className }: Props) {
  if (!suggestions.length) return null;
  return (
    <div className={className}>
      <p className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" aria-hidden /> Suggested products
      </p>
      <ul role="listbox" aria-label="Suggested products">
        {suggestions.map((s) =>
          s.kind === 'hs' ? (
            <li key={`hs-${s.product.name}-${s.product.hs}`} role="option" aria-selected={false}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPickCode(s.product.hs, s.product.name)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{s.product.name}</span>
                  <span className="block text-xs text-muted-foreground">{s.product.category}</span>
                </span>
                <span className="shrink-0 rounded-sm bg-primary-soft px-2 py-0.5 font-mono text-xs font-semibold text-primary">HS {s.product.hs}</span>
              </button>
            </li>
          ) : (
            <li key={`odop-${s.product.name}`} role="option" aria-selected={false} className="px-3 py-2 text-sm text-foreground">
              <span className="block font-medium">
                {s.product.name} <span className="font-normal text-xs text-accent">· MP ODOP, {s.product.districts.join(', ')}</span>
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">Choose the product form to search:</span>
              <span className="mt-1 flex flex-wrap gap-1.5">
                {s.product.forms.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onPickForm(f, s.product.name)}
                    className="rounded-full border px-2 py-0.5 text-xs hover:bg-muted"
                  >
                    {f}
                  </button>
                ))}
              </span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
