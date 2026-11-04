import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataNotice } from '@/components/portal/DataNotice';
import { ExternalLink, Loader2, Search, ShieldAlert, ShieldCheck } from 'lucide-react';

type Hit = {
  id: string; name: string; alt_names: string[]; type: string | null; source: string; programs: string[];
  remarks: string | null; start_date: string | null; source_list_url: string | null; addresses: string[];
};

const COUNTRIES: { code: string; name: string }[] = [
  { code: 'IN', name: 'India' }, { code: 'AE', name: 'United Arab Emirates' }, { code: 'CN', name: 'China' },
  { code: 'HK', name: 'Hong Kong' }, { code: 'RU', name: 'Russia' }, { code: 'TR', name: 'Türkiye' },
  { code: 'IR', name: 'Iran' }, { code: 'SG', name: 'Singapore' }, { code: 'MY', name: 'Malaysia' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'OM', name: 'Oman' }, { code: 'TH', name: 'Thailand' },
];
const PAGE = 10;

export function ScreeningCheck() {
  const [nameDraft, setNameDraft] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('IN');
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['screening', name, country, offset],
    enabled: !!name || country !== 'any',
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('screening-list', {
        body: { name: name || undefined, country: country === 'any' ? undefined : country, offset, size: PAGE },
      });
      if (error || data?.error) throw new Error(data?.error ?? error?.message);
      return data as { total: number; sources: { value: string; count: number }[]; results: Hit[] };
    },
    staleTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const total = data?.total ?? 0;

  return (
    <Card id="screening">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg"><ShieldAlert className="h-5 w-5 text-primary" />Restricted party screening</CardTitle>
        <p className="text-sm text-muted-foreground">Check a buyer, partner or consignee against the US Government Consolidated Screening List — sanctions, denied-party and entity lists from the Departments of Commerce, State and Treasury.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="flex flex-wrap gap-2 sm:flex-nowrap" onSubmit={(e) => { e.preventDefault(); setOffset(0); setName(nameDraft.trim()); }}>
          <Input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="Company or person name (optional)" aria-label="Name to screen" />
          <Select value={country} onValueChange={(v) => { setCountry(v); setOffset(0); }}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Country"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any country</SelectItem>
              {COUNTRIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button type="submit"><Search className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Screen</span></Button>
        </form>

        {!name && country === 'any' ? (
          <p className="py-6 text-center text-muted-foreground">Enter a name or choose a country to search the list.</p>
        ) : isLoading ? (
          <div className="flex items-center gap-2 py-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Searching the screening list…</div>
        ) : isError ? (
          <DataNotice variant="unavailable">{(error as Error)?.message || 'Screening list is unavailable right now.'}</DataNotice>
        ) : !data?.results.length ? (
          <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 p-4 text-sm">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span>No matching entries found{name ? ` for “${name}”` : ''}. This is not a clearance — keep normal due-diligence records.</span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{total.toLocaleString('en-IN')} listed entries</span>
              {data.sources.map((s) => <Badge key={s.value} variant="outline" className="font-normal">{s.value.split(' - ')[0]} · {s.count}</Badge>)}
              {isFetching && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
            <ul className="divide-y rounded-md border">
              {data.results.map((h) => (
                <li key={h.id} className="space-y-1.5 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{h.name}</span>
                    {h.type && <Badge variant="secondary">{h.type}</Badge>}
                    {h.programs.slice(0, 4).map((p) => <Badge key={p} variant="outline" className="text-destructive">{p}</Badge>)}
                  </div>
                  <p className="text-sm text-muted-foreground">{h.source}</p>
                  {h.alt_names.length > 0 && <p className="text-xs text-muted-foreground">Also known as: {h.alt_names.slice(0, 5).join('; ')}</p>}
                  {h.addresses.length > 0 && <p className="text-xs text-muted-foreground">Address: {h.addresses.slice(0, 2).join(' | ')}</p>}
                  {h.remarks && <p className="line-clamp-2 text-xs text-muted-foreground">{h.remarks}</p>}
                  {h.source_list_url && <a href={h.source_list_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">Official list<ExternalLink className="h-3 w-3" /></a>}
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
        <p className="text-xs text-muted-foreground">Source: data.trade.gov Consolidated Screening List (US ITA). Name matches can be false positives — confirm details on the official list before acting.</p>
      </CardContent>
    </Card>
  );
}
