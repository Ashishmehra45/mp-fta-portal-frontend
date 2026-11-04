import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice, DemoBadge } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sectors, type SectorId } from '@/data/products';
import { getCountry } from '@/data/countries';
import { demoMarkets, demoScores, factorLabels, type Factor } from '@/data/marketDemo';
import { inForceForCountry } from '@/data/agreements';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RotateCcw } from 'lucide-react';

const defaultWeights: Record<Factor, number> = { demand: 30, tariff: 25, competition: 15, compliance: 15, logistics: 15 };
const factors = Object.keys(defaultWeights) as Factor[];

const MarketOpportunities = () => {
  const [sector, setSector] = useState<SectorId>('agriculture');
  const [weights, setWeights] = useState(defaultWeights);
  const [expanded, setExpanded] = useState<string | null>(null);

  const total = factors.reduce((s, f) => s + weights[f], 0) || 1;

  const ranked = useMemo(() => {
    return demoMarkets
      .map((m) => {
        const s = demoScores(sector, m);
        const score = factors.reduce((acc, f) => acc + (s[f] * weights[f]) / total, 0);
        return { code: m, name: getCountry(m)?.name ?? m, s, score: Math.round(score) };
      })
      .sort((a, b) => b.score - a.score);
  }, [sector, weights, total]);

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Free Trade Agreements · Markets"
        title="Global Market Opportunity Engine"
        description="Rank destination markets — including India's Free Trade Agreement partners — with a transparent scoring model. Change the weights to reflect what matters most to your business."
      />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Product sector</CardTitle></CardHeader>
            <CardContent>
              <Select value={sector} onValueChange={(v) => setSector(v as SectorId)}>
                <SelectTrigger aria-label="Sector"><SelectValue /></SelectTrigger>
                <SelectContent>{sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} <span className="text-muted-foreground">({s.chapters})</span></SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Factor weights</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setWeights(defaultWeights)}><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {factors.map((f) => (
                <div key={f} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>{factorLabels[f].label}</Label>
                    <span className="font-mono text-xs text-muted-foreground">{Math.round((weights[f] / total) * 100)}%</span>
                  </div>
                  <Slider value={[weights[f]]} min={0} max={50} step={1} onValueChange={([v]) => setWeights((w) => ({ ...w, [f]: v }))} aria-label={`${factorLabels[f].label} weight`} />
                  <p className="text-xs text-muted-foreground">{factorLabels[f].help}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <DataNotice variant="advisory">An opportunity score indicates relative attractiveness under your chosen weights. It is not a guarantee of commercial success.</DataNotice>
        </aside>

        <div className="lg:col-span-8 space-y-6">
          <DataNotice variant="demo">
            Factor scores are illustrative and will be replaced by validated import-demand, tariff and competition datasets in Phase 2. Only the FTA-preference flag uses the agreement directory.
          </DataNotice>
          <Card>
            <CardHeader className="pb-0 flex-row items-center justify-between space-y-0"><CardTitle className="text-lg">Opportunity score by market</CardTitle><DemoBadge /></CardHeader>
            <CardContent className="h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ranked.slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Score breakdown</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">#</th><th className="px-4 py-3">Market</th>
                      {factors.map((f) => <th key={f} className="px-3 py-3 text-right hidden md:table-cell">{factorLabels[f].label}</th>)}
                      <th className="px-4 py-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ranked.map((r, i) => (
                      <Fragment key={r.code}>
                        <tr className="hover:bg-muted/50 cursor-pointer" onClick={() => setExpanded(expanded === r.code ? null : r.code)}>
                          <td className="px-4 py-3 font-mono text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-medium">{r.name}</span>{' '}
                            {r.s.fta ? <Badge className="ml-1 bg-accent hover:bg-accent text-[10px]">FTA in force</Badge> : <Badge variant="outline" className="ml-1 text-[10px]">No FTA</Badge>}
                          </td>
                          {factors.map((f) => <td key={f} className="px-3 py-3 text-right font-mono text-xs hidden md:table-cell">{r.s[f]}</td>)}
                          <td className="px-4 py-3 text-right font-semibold">{r.score}</td>
                        </tr>
                        {expanded === r.code && (
                          <tr className="bg-muted/30">
                            <td colSpan={8} className="px-4 py-4">
                              <div className="grid gap-3 md:grid-cols-5">
                                {factors.map((f) => (
                                  <div key={f}>
                                    <p className="text-xs text-muted-foreground">{factorLabels[f].label}</p>
                                    <div className="mt-1 h-2 rounded bg-border"><div className="h-2 rounded bg-primary" style={{ width: `${r.s[f]}%` }} /></div>
                                    <p className="mt-1 font-mono text-xs">{r.s[f]} × {Math.round((weights[f] / total) * 100)}% = {((r.s[f] * weights[f]) / total).toFixed(1)}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                {inForceForCountry(r.code).map((a) => <Link key={a.id} to={`/trade-agreements/${a.id}`} className="text-primary underline">{a.shortName}</Link>)}
                                <Link to={`/fta-benefit-finder?dest=${r.code}`} className="text-primary underline">Check a product for {r.name}</Link>
                                <Link to={`/compliance-navigator?dest=${r.code}`} className="text-primary underline">Compliance requirements</Link>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card id="methodology" hidden>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Methodology and data sources</CardTitle></CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="space-y-2">
                <p className="font-medium">How the score is calculated</p>
                <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                  <li>Each market gets a score from 0 to 100 on five factors for the selected product sector.</li>
                  <li>Each factor score is multiplied by its weight (the sliders), and the weights are scaled to add up to 100%.</li>
                  <li>The weighted factor scores are added together to give the opportunity score, and markets are ranked from highest to lowest.</li>
                </ol>
                <p className="rounded-md border bg-muted/40 px-3 py-2 font-mono text-xs">
                  Score = Σ (factor score × factor weight) ÷ Σ weights
                </p>
                <p className="text-muted-foreground">Default weights: Import demand 30%, Tariff advantage 25%, Competitive openness 15%, Compliance ease 15%, Logistics &amp; entry 15%.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr><th className="px-3 py-2">Factor</th><th className="px-3 py-2">What it measures</th><th className="px-3 py-2">Data source</th></tr>
                  </thead>
                  <tbody className="divide-y align-top">
                    <tr><td className="px-3 py-2 font-medium">Import demand</td><td className="px-3 py-2 text-muted-foreground">Size and recent growth of the market's imports of the sector's products</td><td className="px-3 py-2 text-muted-foreground">Planned: UN Comtrade / ITC Trade Map import statistics</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Tariff advantage</td><td className="px-3 py-2 text-muted-foreground">Gap between the normal (MFN) rate and the FTA rate for Indian goods</td><td className="px-3 py-2 text-muted-foreground">FTA status: the portal's agreement list (Department of Commerce). Rate gap planned from the tariff files used in the FTA Benefit Finder</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Competitive openness</td><td className="px-3 py-2 text-muted-foreground">How spread out the market's supplier countries are (less concentrated = higher)</td><td className="px-3 py-2 text-muted-foreground">Planned: supplier shares from UN Comtrade / ITC Trade Map</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Compliance ease</td><td className="px-3 py-2 text-muted-foreground">Number and difficulty of standards, SPS and technical rules</td><td className="px-3 py-2 text-muted-foreground">Planned: WTO notifications and market regulations</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Logistics &amp; entry</td><td className="px-3 py-2 text-muted-foreground">Transit time, shipping connections and ease of entering the market</td><td className="px-3 py-2 text-muted-foreground">Planned: World Bank Logistics Performance Index and shipping connectivity data</td></tr>
                  </tbody>
                </table>
              </div>

              <DataNotice variant="demo" title="Current data status">
                Only the "FTA in force" label uses real data, from the portal's agreement list. All factor scores shown today are illustrative examples, not trade statistics. They will be replaced by the sources above once those datasets are loaded and checked.
              </DataNotice>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
};

export default MarketOpportunities;
