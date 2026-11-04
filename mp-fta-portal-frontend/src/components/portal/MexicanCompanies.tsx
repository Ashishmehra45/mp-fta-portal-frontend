import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Building2, Globe2, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataNotice } from '@/components/portal/DataNotice';
import { fetchMexicanCompanies, type MexicanCompany } from '@/services/vyaparSetuCompanies';
import { vyaparSetu as vs } from '@/config/vyaparSetu';

function CompanyCard({ c }: { c: MexicanCompany }) {
  const place = c.headquarters ?? c.city;
  const tags = [c.category, c.certification].filter(Boolean) as string[];
  return (
    <li className="flex flex-col rounded-lg border bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none" aria-hidden>🇲🇽</span>
        <div className="min-w-0">
          <h3 className="font-sans text-base font-semibold leading-snug">{c.company_name}</h3>
          {c.brand && <p className="text-sm text-primary">{c.brand}</p>}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {[place, 'Mexico'].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
      {c.description && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground leading-relaxed">{c.description}</p>}
      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li key={t} className="rounded-full border bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">{t}</li>
          ))}
        </ul>
      )}
      {c.export_markets && (
        <p className="mt-3 flex gap-1.5 text-xs text-muted-foreground">
          <Globe2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Exports to: {c.export_markets}
        </p>
      )}
      <div className="mt-auto pt-4">
        <Button size="sm" variant="outline" asChild>
          <a href={vs.registerUrl} target="_blank" rel="noopener noreferrer">
            Register to request a meeting <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </li>
  );
}

export function MexicanCompanies() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vyapar-setu', 'mexican-companies'],
    queryFn: fetchMexicanCompanies,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const categories = useMemo(
    () => [...new Set((data ?? []).map((c) => c.category).filter(Boolean) as string[])].sort(),
    [data],
  );
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (!term) return true;
      return [c.company_name, c.brand, c.category, c.city, c.headquarters, c.description]
        .some((v) => v?.toLowerCase().includes(term));
    });
  }, [data, q, category]);

  return (
    <section aria-labelledby="mx-companies-h">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Meet Mexican companies</p>
      <h2 id="mx-companies-h" className="mt-1 text-3xl font-semibold">Mexican companies on {vs.name}</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Companies from Mexico approved by the programme secretariat. Register your MP company to see their contacts and book a meeting.
      </p>

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-44 rounded-lg" />)}
        </div>
      )}

      {isError && (
        <DataNotice variant="unavailable" className="mt-6">
          The list of Mexican companies isn’t available from {vs.displayHost} right now. Register to see them on the platform.
        </DataNotice>
      )}

      {data && data.length === 0 && (
        <DataNotice variant="source" title="No approved Mexican companies yet" className="mt-6">
          Companies appear here as soon as the secretariat approves them.
        </DataNotice>
      )}

      {data && data.length > 0 && (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by company, brand or product…" className="pl-9" aria-label="Search Mexican companies" />
            </div>
            {categories.length > 1 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" /> {shown.length} of {data.length} companies
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c) => <CompanyCard key={c.id} c={c} />)}
          </ul>
        </>
      )}
    </section>
  );
}
