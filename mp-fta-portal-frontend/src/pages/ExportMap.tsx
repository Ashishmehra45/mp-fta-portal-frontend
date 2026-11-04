import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice, DemoBadge } from '@/components/portal/DataNotice';
import { DistrictTileMap } from '@/components/portal/DistrictTileMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { districts, divisions, type Division } from '@/data/districts';
import { sectors, sectorName, type SectorId } from '@/data/products';
import { countries } from '@/data/countries';
import { inForceForCountry } from '@/data/agreements';
import { odop, odopFor, odopImage, odopFacts, districtSectors, ODOP_SOURCE_URL, ODOP_SELLERS_PDF } from '@/data/odop';
import { Award, ExternalLink, Factory, FileDown, Globe2, Handshake, Package, ScrollText, Sparkles } from 'lucide-react';

function OdopPic({ image, alt, className }: { image: string; alt: string; className?: string }) {
  const src = odopImage(image);
  if (!src) return <div className={`rounded-full bg-saffron/15 ${className ?? ''}`} aria-hidden />;
  return <img src={src} alt={alt} loading="lazy" className={`rounded-full object-cover ${className ?? ''}`} />;
}

const ExportMap = () => {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string>(() => {
    const p = params.get('district');
    return p && districts.some((d) => d.name === p) ? p : 'Indore';
  });
  const [division, setDivision] = useState<Division | 'all'>('all');
  const [sector, setSector] = useState<SectorId | 'all'>('all');

  const d = districts.find((x) => x.name === selected)!;
  const dOdop = odopFor(d.name);
  const profiled = districts.filter((x) => x.profile);

  const odopList = useMemo(
    () =>
      odop
        .map((o) => ({ o, dist: districts.find((x) => x.name === o.district) }))
        .filter(({ o, dist }) => (division === 'all' || dist?.division === division) && (sector === 'all' || o.sectors.includes(sector)))
        .sort((a, b) => a.o.district.localeCompare(b.o.district)),
    [division, sector],
  );

  const marketAgreements = (name: string) => {
    const c = countries.find((x) => x.name === name || (name === 'UAE' && x.code === 'AE') || (name === 'USA' && x.code === 'US') || (name === 'UK' && x.code === 'GB'));
    return c ? inForceForCountry(c.code) : [];
  };

  const pick = (name: string) => { setSelected(name); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Free Trade Agreements · MP districts"
        title="Madhya Pradesh Export Intelligence"
        description="Each district's One District One Product (ODOP), its industrial clusters and the Free Trade Agreements (FTAs) that can take it to world markets."
      />
      <div className="container py-8 space-y-6">
        {/* ODOP programme — official */}
        <Card className="overflow-hidden">
          <div className="tricolour-rule h-1" aria-hidden />
          <CardContent className="grid gap-6 p-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-3">
              <Badge variant="outline" className="border-saffron/50 text-saffron">Government of Madhya Pradesh</Badge>
              <h2 className="text-2xl font-semibold">One District One Product (ODOP)</h2>
              <p className="text-muted-foreground">
                The state's flagship scheme that identifies and promotes a unique product from each district, and takes it to national and international markets.
              </p>
              <p className="flex items-center gap-2 text-sm font-medium"><Award className="h-4 w-4 text-saffron" />{odopFacts.award}</p>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {odopFacts.stats.map((s) => (
                  <div key={s.label} className="rounded-lg border bg-muted/40 p-3 text-center">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-2xl font-semibold text-primary">{s.value}</dd>
                    <dd className="text-xs text-muted-foreground">{s.label}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Showcased at:</span> {odopFacts.outreach.join(' · ')}. Retail presence at {odopFacts.retail.join(' and ')}.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={ODOP_SELLERS_PDF} target="_blank" rel="noopener noreferrer"><FileDown className="h-4 w-4" />ODOP sellers list (PDF)</a>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href={ODOP_SOURCE_URL} target="_blank" rel="noopener noreferrer">Source: MP Trade Portal<ExternalLink className="h-3.5 w-3.5" /></a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="flex flex-wrap gap-3">
          <Select value={division} onValueChange={(v) => setDivision(v as Division | 'all')}>
            <SelectTrigger className="w-48" aria-label="Division"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All divisions</SelectItem>{divisions.map((v) => <SelectItem key={v} value={v}>{v} division</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sector} onValueChange={(v) => setSector(v as SectorId | 'all')}>
            <SelectTrigger className="w-56" aria-label="Sector"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All sectors</SelectItem>{sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">District map</CardTitle>
            </CardHeader>
            <CardContent>
              <DistrictTileMap selected={selected} onSelect={(x) => setSelected(x.name)} division={division} sector={sector} />
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Schematic tile layout — approximate relative positions, not to scale.</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-saffron" />ODOP product listed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader className="pb-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{d.division} division</p>
              <CardTitle className="text-2xl">{d.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {dOdop ? (
                <section className="flex items-center gap-4 rounded-lg border border-saffron/40 bg-saffron/5 p-3">
                  <OdopPic image={dOdop.image} alt={dOdop.product} className="h-16 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron"><Sparkles className="h-3.5 w-3.5" />ODOP product</p>
                    <p className="text-lg font-semibold">{dOdop.product}</p>
                    <a href={dOdop.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">District ODOP profile<ExternalLink className="h-3 w-3" /></a>
                  </div>
                </section>
              ) : (
                <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">No ODOP product is listed for {d.name} on the official ODOP page.</p>
              )}

              {d.profile ? (
                <>
                  <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wider district profile</p><DemoBadge /></div>
                  <section><h3 className="flex items-center gap-2 font-sans font-semibold"><Package className="h-4 w-4 text-primary" />Other export products</h3><p className="mt-1 text-muted-foreground">{d.profile.products.join(' · ')}</p>
                    <div className="mt-2 flex flex-wrap gap-1">{districtSectors(d).map((s) => <Badge key={s} variant="outline">{sectorName(s)}</Badge>)}</div></section>
                  <section><h3 className="flex items-center gap-2 font-sans font-semibold"><Factory className="h-4 w-4 text-primary" />Industrial clusters</h3><p className="mt-1 text-muted-foreground">{d.profile.clusters.join(' · ') || 'Not recorded'}</p></section>
                  <section><h3 className="flex items-center gap-2 font-sans font-semibold"><Globe2 className="h-4 w-4 text-primary" />Relevant international markets</h3>
                    <ul className="mt-1 space-y-1">{d.profile.markets.map((m) => {
                      const ags = marketAgreements(m);
                      return <li key={m} className="flex flex-wrap items-center gap-2"><span>{m}</span>{ags.length ? ags.map((a) => <Link key={a.id} to={`/trade-agreements/${a.id}`}><Badge className="bg-accent hover:bg-accent text-[10px]">{a.shortName}</Badge></Link>) : <Badge variant="outline" className="text-[10px]">No FTA</Badge>}</li>;
                    })}</ul></section>
                  <section><h3 className="flex items-center gap-2 font-sans font-semibold"><ScrollText className="h-4 w-4 text-primary" />Potential FTA opportunities</h3><p className="mt-1 text-muted-foreground">{d.profile.ftaNotes}</p></section>
                  <section><h3 className="flex items-center gap-2 font-sans font-semibold"><Handshake className="h-4 w-4 text-primary" />Export support services</h3><p className="mt-1 text-muted-foreground">{[odopFacts.cell.name, ...d.profile.support].join(' · ')}</p></section>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">A wider district profile (clusters, markets) has not been loaded yet. Export support: {odopFacts.cell.name}, {odopFacts.cell.phone}.</p>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" asChild>
                  <Link to={dOdop && dOdop.sectors.length ? `/fta-benefit-finder?q=${encodeURIComponent(dOdop.product)}` : '/fta-benefit-finder'}>
                    {dOdop && dOdop.sectors.length ? `Check FTA benefit for ${dOdop.product}` : 'Check FTA benefits'}
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild><Link to="/export-readiness">Assess readiness</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">ODOP products by district ({odopList.length})</CardTitle>
            <a href={ODOP_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">Official list</a>
          </CardHeader>
          <CardContent>
            {odopList.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No ODOP products match these filters.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {odopList.map(({ o, dist }) => (
                  <li key={o.district}>
                    <button
                      type="button"
                      onClick={() => pick(o.district)}
                      aria-pressed={selected === o.district}
                      className={`flex h-full w-full flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors hover:border-primary hover:bg-muted/50 ${selected === o.district ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <OdopPic image={o.image} alt={o.product} className="h-20 w-20" />
                      <span className="text-sm font-semibold leading-tight">{o.district}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{o.product}</span>
                      {dist && <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{dist.division}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <div className="mt-8">
        <DataNotice variant="demo" title="ODOP products are official — other district details are demonstration data">
          ODOP products and figures come from the Government of Madhya Pradesh ODOP page (mptradeportal.org). Other products, clusters and markets are compiled from public references for illustration and must be verified with the State Industries Department. Export values per district are not yet integrated. Demo profiles: {profiled.length} of {districts.length} districts.
        </DataNotice>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ExportMap;
