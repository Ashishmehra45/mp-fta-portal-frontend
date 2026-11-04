import { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { rooGlossary, type GlossaryTerm } from '@/data/rooGlossary';

const all = rooGlossary.flatMap((s) => s.terms);
/** Abbreviation in brackets, e.g. "Change in Tariff Heading (CTH)" → "CTH". */
const abbr = (t: GlossaryTerm) => t.term.match(/\(([A-Z][A-Za-z0-9-]*)\)/)?.[1] ?? (/^[A-Z]{2,6}$/.test(t.term) ? t.term : null);

/** Glossary terms whose abbreviation (or "Wholly Obtained") appears in a rule text. */
export function termsInRule(rule: string | null | undefined): GlossaryTerm[] {
  if (!rule) return [];
  const seen = new Set<string>();
  return all.filter((t) => {
    const a = abbr(t);
    const hit = a ? new RegExp(`\\b${a}\\b`).test(rule) || (a === 'WO' && /wholly obtained/i.test(rule)) : false;
    if (!hit || seen.has(a!)) return false;
    seen.add(a!);
    return true;
  });
}

export function RuleTerms({ rule }: { rule: string | null | undefined }) {
  const terms = termsInRule(rule);
  if (!terms.length) return null;
  return (
    <div className="rounded-md border p-3">
      <p className="mb-1 text-xs font-medium text-muted-foreground">What this rule means</p>
      <dl className="space-y-1.5 text-xs">
        {terms.map((t) => (
          <div key={t.term}><dt className="inline font-semibold">{t.term}: </dt><dd className="inline text-muted-foreground">{t.meaning}</dd></div>
        ))}
      </dl>
    </div>
  );
}

/** Searchable Rules of Origin glossary. */
export function RooGlossary() {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const sections = useMemo(
    () => rooGlossary.map((s) => ({ ...s, terms: query ? s.terms.filter((t) => t.term.toLowerCase().includes(query) || t.meaning.toLowerCase().includes(query)) : s.terms })).filter((s) => s.terms.length),
    [query],
  );
  return (
    <section className="rounded-lg border bg-card p-4 shadow-card sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold"><BookOpen className="h-5 w-5 text-primary" />Rules of Origin glossary</h2>
      <p className="mt-1 text-sm text-muted-foreground">Common Rules of Origin terms explained. Always check the specific agreement and its product-specific rules.</p>
      <div className="relative mt-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a term, e.g. CTH, RVC, de minimis" className="pl-9" aria-label="Search glossary" />
      </div>
      {sections.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No term matches your search.</p>
      ) : (
        <Accordion type="multiple" value={query ? sections.map((s) => s.title) : undefined} className="mt-2">
          {sections.map((s) => (
            <AccordionItem key={s.title} value={s.title}>
              <AccordionTrigger className="text-left">{s.title} <span className="ml-auto mr-2 text-xs font-normal text-muted-foreground">{s.terms.length}</span></AccordionTrigger>
              <AccordionContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {s.terms.map((t) => (
                    <div key={t.term} className="rounded border p-3"><dt className="font-semibold">{t.term}</dt><dd className="mt-1 text-sm text-muted-foreground">{t.meaning}</dd></div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}
