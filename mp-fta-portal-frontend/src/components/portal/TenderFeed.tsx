import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataNotice } from '@/components/portal/DataNotice';
import { CalendarClock, ExternalLink, Loader2, Search } from 'lucide-react';

type Lead = {
  id: string; url: string; country_code: string; title: string; description: string | null;
  published_date: string | null; tender_end_date: string | null; contract_start_date: string | null; contract_end_date: string | null;
};

const PAGE = 10;
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const iso = (c: string) => (c === 'UK' ? 'GB' : c);
const countryName = (c: string) => { try { return regionNames.of(iso(c)) ?? c; } catch { return c; } };
const flag = (c: string) => iso(c).toUpperCase().replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null);

export function TenderFeed() {
  const [draft, setDraft] = useState('');
  const [q, setQ] = useState('');
  const [offset, setOffset] = useState(0);
  const [country, setCountry] = useState('all');
  const [allCountries, setAllCountries] = useState<{ code: string; count: number }[]>([]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['trade-leads', country, q, offset],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('trade-leads', { body: { country: country === 'all' ? undefined : country, q: q || undefined, offset, size: PAGE } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message);
      if (country === 'all' && !q && data.countries?.length) setAllCountries(data.countries);
      return data as { total: number; results: Lead[]; countries: { code: string; count: number }[] };
    },
    staleTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const total = data?.total ?? 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
          🇬🇧 Live UK public tenders
          <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">Other countries — coming soon</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Live government tenders from the United Kingdom. Tenders for other countries are coming soon.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="flex flex-wrap gap-2 sm:flex-nowrap" onSubmit={(e) => { e.preventDefault(); setOffset(0); setQ(draft.trim()); }}>
          <Select value={country} onValueChange={(v) => { setCountry(v); setOffset(0); }}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Country"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All available</SelectItem>
              {allCountries.map((c) => <SelectItem key={c.code} value={c.code}>{flag(c.code)} {countryName(c.code)} ({c.count})</SelectItem>)}
              <SelectItem value="soon" disabled>Other countries — coming soon</SelectItem>
            </SelectContent>
          </Select>
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search tenders, e.g. textiles, medical, steel" aria-label="Search tenders" />
          <Button type="submit"><Search className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Search</span></Button>
        </form>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading tenders…</div>
        ) : isError ? (
          <DataNotice variant="unavailable">Tender feed is unavailable right now. Please try again later.</DataNotice>
        ) : !data?.results.length ? (
          <p className="py-6 text-center text-muted-foreground">No tenders found{q ? ` for “${q}”` : ''}.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{total.toLocaleString('en-IN')} tenders{q ? ` matching “${q}”` : ''} {isFetching && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}</p>
            <ul className="divide-y rounded-md border">
              {data.results.map((l) => (
                <li key={l.id} className="space-y-2 p-4">
                  <Badge variant="outline">{flag(l.country_code)} {countryName(l.country_code)}</Badge>
                  <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 font-medium text-primary hover:underline">
                    {l.title}<ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" />
                  </a>
                  {l.description && <p className="line-clamp-3 text-sm text-muted-foreground">{l.description}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {fmt(l.published_date) && <span>Published {fmt(l.published_date)}</span>}
                    {fmt(l.tender_end_date) && <span className="inline-flex items-center gap-1 font-medium text-warning"><CalendarClock className="h-3.5 w-3.5" />Closes {fmt(l.tender_end_date)}</span>}
                    {fmt(l.contract_start_date) && <span>Contract {fmt(l.contract_start_date)}{fmt(l.contract_end_date) ? ` – ${fmt(l.contract_end_date)}` : ''}</span>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Previous</Button>
              <span className="text-sm text-muted-foreground">{offset + 1}–{Math.min(offset + PAGE, total)} of {total}</span>
              <Button variant="outline" size="sm" disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>Next</Button>
            </div>
          </>
        )}
        <p className="text-xs text-muted-foreground">Source: data.trade.gov (ITA Trade Leads) and the official national procurement sites linked on each notice. Check eligibility and bid rules on the official notice before applying.</p>
      </CardContent>
    </Card>
  );
}
