import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products, sectors, sectorName, formatHs, type SectorId } from '@/data/products';
import { getCountry } from '@/data/countries';
import { agreements, agreementsForCountry, statusLabel } from '@/data/agreements';
import { ArrowRight, Search } from 'lucide-react';
import { DestinationSelect } from '@/components/portal/DestinationSelect';
import { useDestinationCountries, useKeepDestinationValid } from '@/hooks/useDestinationCountries';

export function OpportunitySearch({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [dest, setDest] = useState<string>('AE');
  const [sector, setSector] = useState<SectorId | 'all'>('all');
  const [agreementId, setAgreementId] = useState<string>('any');
  const destList = useDestinationCountries();
  useKeepDestinationValid(dest, setDest, destList.data);
  const destName = destList.data?.find((c) => c.code === dest)?.name ?? getCountry(dest)?.name ?? dest;

  const destAgreements = useMemo(() => agreementsForCountry(dest), [dest]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    return products
      .filter((p) => (sector === 'all' ? true : p.sector === sector))
      .filter((p) => {
        if (!query) return true;
        if (digits.length >= 2 && /^[\d.\s]+$/.test(query)) return p.hs.startsWith(digits.slice(0, 6));
        return p.name.toLowerCase().includes(query) || sectorName(p.sector).toLowerCase().includes(query);
      })
      .slice(0, 8);
  }, [q, sector]);

  const selectedAgreement = agreementId === 'any' ? null : agreements.find((a) => a.id === agreementId);
  const agreementMismatch = selectedAgreement && !selectedAgreement.partnerCodes.includes(dest);

  return (
    <div className="rounded-lg border bg-card shadow-card">
      <div className="grid gap-3 p-4 md:grid-cols-12 border-b">
        <div className="md:col-span-4 relative">
          <label htmlFor="opp-q" className="sr-only">Product name or HS code</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="opp-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Product name or HS code" className="pl-9" />
        </div>
        <div className="md:col-span-2">
          <Select value="IN" disabled>
            <SelectTrigger aria-label="Exporting country"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="IN">From: India</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <DestinationSelect value={dest} onChange={setDest} countries={destList.data} isLoading={destList.isLoading} isError={destList.isError} />
        </div>
        <div className="md:col-span-2">
          <Select value={sector} onValueChange={(v) => setSector(v as SectorId | 'all')}>
            <SelectTrigger aria-label="Industry sector"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={agreementId} onValueChange={setAgreementId}>
            <SelectTrigger aria-label="Trade agreement"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="any">Any agreement</SelectItem>
              {agreements.map((a) => <SelectItem key={a.id} value={a.id}>{a.shortName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 border-b bg-muted/40 text-sm flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground">Agreements covering {getCountry(dest)?.name}:</span>
        {destAgreements.length === 0 && <Badge variant="outline">No Indian trade agreement — MFN rates apply</Badge>}
        {destAgreements.map((a) => (
          <Link key={a.id} to={`/trade-agreements/${a.id}`}>
            <Badge variant={a.status === 'in_force' ? 'default' : 'outline'} className={a.status === 'in_force' ? 'bg-accent hover:bg-accent/90' : ''}>
              {a.shortName} · {statusLabel[a.status]}
            </Badge>
          </Link>
        ))}
        {agreementMismatch && (
          <span className="text-warning font-medium">{selectedAgreement?.shortName} does not cover {getCountry(dest)?.name}.</span>
        )}
      </div>

      <ul className="divide-y">
        {results.length === 0 && <li className="p-6 text-sm text-muted-foreground">No products match. Try a different keyword or a 4–6 digit HS code.</li>}
        {results.map((p) => (
          <li key={p.hs} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-mono">HS {formatHs(p.hs)}</span> · {sectorName(p.sector)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-sm border border-warning/40 bg-warning-soft px-2 py-1 text-foreground">Tariff: verify in calculator</span>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/fta-benefit-finder?hs=${p.hs}&dest=${dest}`}>
                  Check benefit <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
