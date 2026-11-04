import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries, getCountry } from '@/data/countries';
import { searchProducts, formatHs } from '@/data/products';
import { agreementsForCountry, statusLabel, formatDate, type Agreement } from '@/data/agreements';
import { ArrowRight } from 'lucide-react';
import { RateVerification } from '@/components/portal/RateVerification';
import { AllRatesView } from '@/components/portal/AllRatesView';
import { hasSuppliedSchedule } from '@/services/suppliedTariffs';
import { DestinationSelect } from '@/components/portal/DestinationSelect';
import { TariffLineSearch, leafDescription } from '@/components/portal/TariffLineSearch';
import { useDestinationCountries, useKeepDestinationValid } from '@/hooks/useDestinationCountries';
import { cn } from '@/lib/utils';
import { odop, odopFor } from '@/data/odop';

/** ODOP goods only (services such as tourism have no tariff line). */
const odopGoods = odop.filter((o) => o.sectors.length > 0).sort((a, b) => a.district.localeCompare(b.district));



const FtaFinder = () => {
  const [params] = useSearchParams();
  // Search text for the destination's tariff file, and the chosen line's description.
  const [search, setSearch] = useState('');
  const [productLabel, setProductLabel] = useState('');
  const [hs, setHs] = useState('');
  // Read ?dest= up front so the destination check never overrides a linked country.
  const [dest, setDest] = useState(() => {
    const d = params.get('dest');
    return d && /^[A-Za-z]{2}$/.test(d) ? d.toUpperCase() : 'AE';
  });
  const [agreementId, setAgreementId] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill from query string (?q=, ?hs=, ?dest=)
  useEffect(() => {
    const q = params.get('q');
    const pHs = params.get('hs');
    const pDest = params.get('dest');
    if (pDest && /^[A-Za-z]{2}$/.test(pDest)) setDest(pDest.toUpperCase());
    if (pHs) {
      setHs(pHs.replace(/\D/g, ''));
      setSubmitted(true);
    }
    if (q) {
      const country = /\d/.test(q) ? undefined : countries.find((c) => c.name.toLowerCase().includes(q.toLowerCase()));
      if (country) setDest(country.code);
      else if (/^\d[\d.\s]*$/.test(q)) { setHs(q.replace(/\D/g, '')); setSearch(q.replace(/\D/g, '')); }
      else setSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const destList = useDestinationCountries();
  useKeepDestinationValid(dest, setDest, destList.data);
  const destName = destList.data?.find((c) => c.code === dest)?.name ?? getCountry(dest)?.name ?? 'Destination';

  const destAgreements = useMemo(() => agreementsForCountry(dest), [dest]);
  const inForce = destAgreements.filter((a) => a.status === 'in_force');

  useEffect(() => {
    setAgreementId(inForce[0]?.id ?? '');
  }, [dest]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected: Agreement | null = inForce.find((a) => a.id === agreementId) ?? null;
  const canRun = hs.replace(/\D/g, '').length >= 4;

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Free Trade Agreements · Duty benefit"
        title="FTA Benefit Finder"
        description="Choose the destination, pick your product from its tariff file and see every normal (MFN) and Free Trade Agreement (FTA) customs duty rate in one click — with the savings highlighted."
      />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 h-fit">
          <CardHeader><CardTitle className="text-xl">Your product and market</CardTitle></CardHeader>
          <CardContent>
            <form
              className="space-y-5"
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            >
              <div className="space-y-2">
                <Label>1. Destination market</Label>
                <DestinationSelect value={dest} onChange={setDest} countries={destList.data} isLoading={destList.isLoading} isError={destList.isError} ariaLabel="Destination market" />
                {destList.isError && (
                  <p className="text-xs text-warning">The list of destination countries could not be loaded. Please try again shortly.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">2. Product or HS code</Label>
                <TariffLineSearch
                  id="product"
                  dest={dest}
                  destName={destName}
                  query={search}
                  onQueryChange={setSearch}
                  onPick={(h) => { setHs(h.code.replace(/\D/g, '')); setProductLabel(leafDescription(h.description)); setSearch(leafDescription(h.description)); }}
                  placeholder="e.g. Garlic, cotton, 0703"
                />
                <p className="text-xs text-muted-foreground">Products and HS codes come from the {destName} tariff file.</p>
              </div>
              <div className="space-y-2">
                <Label>Or pick your district's ODOP product</Label>
                <Select
                  value=""
                  onValueChange={(district) => {
                    const o = odopFor(district);
                    if (!o) return;
                    // Look the product up in the destination's file; the user picks the exact line.
                    const match = searchProducts(o.product)[0];
                    setSearch(match?.hs.slice(0, 6) ?? o.product);
                    setProductLabel(o.product);
                    setHs('');
                    setTimeout(() => document.getElementById('product')?.focus(), 50);
                  }}
                >
                  <SelectTrigger aria-label="District ODOP product"><SelectValue placeholder="Select a district (One District One Product)" /></SelectTrigger>
                  <SelectContent>
                    {odopGoods.map((o) => <SelectItem key={o.district} value={o.district}>{o.district} — {o.product}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hs">HS code</Label>
                  <Input id="hs" value={hs} onChange={(e) => { setHs(e.target.value.replace(/[^\d]/g, '').slice(0, 12)); setProductLabel(''); }} placeholder="4–10 digits" className="font-mono" inputMode="numeric" />
                </div>
                <div className="space-y-2">
                  <Label>Exporting country</Label>
                  <Select value="IN" disabled><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="IN">India</SelectItem></SelectContent></Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!canRun}>Show all MFN and FTA rates</Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          {!submitted ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-muted-foreground">
                Choose the destination and your product, then select <span className="font-medium text-foreground">Show all MFN and FTA rates</span>.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">India → {destName}</p>
                  <CardTitle className="text-xl">
                    {productLabel || 'Product'} {hs && <span className="font-mono text-base text-muted-foreground">HS {formatHs(hs)}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Applicable agreements</p>
                    {destAgreements.length === 0 ? (
                      <p className="text-sm text-muted-foreground">India has no trade agreement with {destName}. Standard MFN customs duty applies.</p>
                    ) : (
                      <div className="space-y-2">
                        {destAgreements.map((a) => (
                          <label key={a.id} className={cn('flex items-start gap-3 rounded-md border p-3', a.status === 'in_force' ? 'cursor-pointer hover:border-primary' : 'opacity-80')}>
                            <input
                              type="radio"
                              name="agreement"
                              className="mt-1 accent-[hsl(var(--primary))]"
                              disabled={a.status !== 'in_force'}
                              checked={agreementId === a.id}
                              onChange={() => setAgreementId(a.id)}
                            />
                            <span className="flex-1">
                              <span className="flex flex-wrap items-center gap-2">
                                <Link to={`/trade-agreements/${a.id}`} className="font-medium text-primary hover:underline">{a.shortName}</Link>
                                <Badge variant={a.status === 'in_force' ? 'default' : 'outline'} className={a.status === 'in_force' ? 'bg-accent hover:bg-accent' : ''}>{statusLabel[a.status]}</Badge>
                              </span>
                              <span className="block text-xs text-muted-foreground mt-1">
                                {a.inForce ? `In force since ${formatDate(a.inForce)}` : a.statusNote}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <p className="text-sm font-medium">Customs duty: normal (MFN) vs FTA rates</p>
                    {hasSuppliedSchedule(dest) ? <AllRatesView hs={hs} dest={dest} destName={destName} /> : <RateVerification hs={hs} dest={dest} destName={destName} />}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-xl">Before you claim the FTA rate</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {selected?.origin && (
                    <div className="rounded-md border p-4 text-sm space-y-1">
                      <p className="font-medium">Rules of origin reference — {selected.shortName}</p>
                      <p className="text-muted-foreground">{selected.origin.general}</p>
                      <p className="text-muted-foreground">Certificate: {selected.origin.certificate}</p>
                    </div>
                  )}
                  <DataNotice variant="advisory">
                    An FTA rate applies only if your product meets the agreement's rules of origin and carries a valid certificate of origin. These rates are for guidance, not a legally binding determination.
                  </DataNotice>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                      <Link to={`/rules-of-origin?dest=${dest}&hs=${hs}`}>Run Rules of Origin Advisor <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                    <Button variant="outline" asChild><Link to={`/compliance-navigator?dest=${dest}`}>Check market requirements</Link></Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Source: {selected?.officialSource.label ?? 'Department of Commerce'} · Agreement status last verified: {selected?.lastVerified ?? 'pending official verification'}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default FtaFinder;
