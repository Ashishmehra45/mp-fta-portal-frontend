import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mpExportSource, mpMonthly, mpProducts, stateExports } from '@/data/mpExports';
import {
  fmtInrCr, fmtPct, fmtUsdBn, fmtUsdMn, monthlyAverage, mpShareOfIndia, mpState, mpTotalInrCr, mpTotalUsdMn,
  nationalLeaders, peakMonth, productShare, sectorTotals, shortSector, stateRank,
} from '@/lib/exportStats';
import { downloadCsv } from '@/lib/reports';
import { cn } from '@/lib/utils';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Award, Download, Factory, IndianRupee, Landmark, Search, TrendingUp } from 'lucide-react';

const tooltipStyle = { background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 12 };
const fy = mpExportSource.fiscalYear;

const MpExportStrength = () => {
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('all');
  const [sort, setSort] = useState<'value' | 'share'>('value');
  const [showAll, setShowAll] = useState(false);

  const leaders = useMemo(() => nationalLeaders(25), []);
  const spotlight = useMemo(() => nationalLeaders(50).slice(0, 4), []);
  const sectors = useMemo(() => sectorTotals(8), []);
  const top10 = mpProducts.slice(0, 10).map((p) => ({ ...p, share: productShare(p) }));
  const rank25 = stateRank('usdMn2025');
  const rankYtd = stateRank('usdMn2026Ytd');
  const statesTop = [...stateExports].sort((a, b) => b.usdMn2026Ytd - a.usdMn2026Ytd).slice(0, 15);
  const trend = mpMonthly.map((m) => ({ ...m, label: `${m.month} ${String(m.year).slice(2)}` }));
  const sectorOptions = [...new Set(mpProducts.map((p) => p.sector))].sort();

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return mpProducts
      .filter((p) => p.usdMn > 0 && (sector === 'all' || p.sector === sector) && (!t || p.name.toLowerCase().includes(t) || p.sector.toLowerCase().includes(t)))
      .map((p) => ({ ...p, share: productShare(p) }))
      .sort((a, b) => (sort === 'value' ? b.usdMn - a.usdMn : b.share - a.share));
  }, [q, sector, sort]);
  const visible = showAll ? rows : rows.slice(0, 20);

  const exportCsv = () => downloadCsv(`mp-exports-${fy.replace(/\s/g, '-')}.csv`,
    ['Principal commodity', 'Sector', `MP exports ${fy} (US$ Mn)`, `MP exports ${fy} (Rs crore)`, `India exports ${fy} (US$ Mn)`, "MP share of India (%)"],
    rows.map((r) => [r.name, r.sector, r.usdMn.toFixed(2), r.inrCr.toFixed(2), r.indiaUsdMn.toFixed(2), r.share.toFixed(2)]));

  const kpis = [
    { icon: IndianRupee, label: `Total exports, ${fy}`, value: fmtUsdBn(mpTotalUsdMn), sub: fmtInrCr(mpTotalInrCr) },
    { icon: Landmark, label: "Share of India's exports", value: fmtPct(mpShareOfIndia), sub: `${fy}, all principal commodities` },
    { icon: Award, label: 'Rank among states & UTs', value: `#${rankYtd.rank} of ${rankYtd.of}`, sub: `${mpExportSource.stateYears.ytd}; #${rank25.rank} in ${mpExportSource.stateYears.full}` },
    { icon: TrendingUp, label: `Exports ${mpExportSource.stateYears.ytd}`, value: fmtUsdBn(mpState.usdMn2026Ytd), sub: `${fmtPct(mpState.share2026)} national share` },
  ];

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Official export statistics · FTA opportunity"
        title="Madhya Pradesh Export Strength"
        description="What Madhya Pradesh sells to the world, where the State leads India, and how it compares with other states."
        actions={<Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Download CSV</Button>}
      />

      <div className="container py-8 space-y-10">
        <DataNotice variant="source" title={`Source: ${mpExportSource.label}`}>
          Commodity and monthly figures cover {fy}. State comparison uses the state-wise share file ({mpExportSource.stateYears.full} and {mpExportSource.stateYears.ytd}). MP's share of India is MP exports divided by India's exports for the same commodity and year. Data extracted on 23 Oct 2026.
        </DataNotice>

        {/* KPIs */}
        <dl className="grid gap-px overflow-hidden rounded-lg border bg-border shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="relative bg-card p-6">
              <k.icon className="h-5 w-5 text-accent" />
              <dt className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{k.label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-primary">{k.value}</dd>
              <dd className="mt-1 text-sm text-muted-foreground">{k.sub}</dd>
            </div>
          ))}
        </dl>

        {/* WHERE MP LEADS INDIA */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Where Madhya Pradesh leads India</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-semibold">Products where MP supplies a large share of India's exports</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spotlight.map((p, i) => (
              <div key={p.name} className="relative overflow-hidden rounded-lg border bg-card p-5 shadow-card">
                <span className={cn('absolute inset-x-0 top-0 h-1', ['bg-saffron', 'bg-primary', 'bg-accent', 'bg-saffron'][i])} aria-hidden />
                <p className="text-sm font-semibold leading-snug">{p.name}</p>
                <p className="mt-3 font-display text-4xl font-semibold text-primary">{fmtPct(p.share)}</p>
                <p className="text-xs text-muted-foreground">of India's exports of this product</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(p.share, 100)}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">MP {fmtUsdMn(p.usdMn)} of India {fmtUsdMn(p.indiaUsdMn)}</p>
              </div>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-0"><CardTitle className="text-base">MP share of India's exports, by product ({fy}, products above US$ 25 Mn)</CardTitle></CardHeader>
            <CardContent className="h-[420px] pt-4">
              <ResponsiveContainer>
                <BarChart data={leaders.slice(0, 12)} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="name" width={210} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtPct(v), 'MP share of India']} />
                  <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                    {leaders.slice(0, 12).map((p, i) => <Cell key={p.name} fill={i < 4 ? 'hsl(var(--accent))' : 'hsl(var(--chart-1))'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* TOP PRODUCTS + SECTORS */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-0"><CardTitle className="text-base">Top 10 export products ({fy}, US$ Mn)</CardTitle></CardHeader>
            <CardContent className="h-[400px] pt-4">
              <ResponsiveContainer>
                <BarChart data={top10} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtUsdMn(v), 'MP exports']} />
                  <Bar dataKey="usdMn" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0"><CardTitle className="text-base">Export mix by sector ({fy})</CardTitle></CardHeader>
            <CardContent className="pt-5">
              <ul className="space-y-3">
                {sectors.map((s, i) => (
                  <li key={s.sector}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                      <span className="min-w-0 font-medium">{s.label}</span>
                      <span className="shrink-0 text-muted-foreground"><span className="font-semibold text-foreground">{fmtPct(s.share)}</span> · {fmtUsdMn(s.usdMn)}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div className={cn('h-full rounded-full', i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : i === 2 ? 'bg-saffron' : 'bg-primary/50')} style={{ width: `${(s.share / sectors[0].share) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* MONTHLY TREND */}
        <Card>
          <CardHeader className="pb-0 flex-row flex-wrap items-end justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Month-wise exports, {fy} (US$ Mn)</CardTitle>
            <p className="text-sm text-muted-foreground">Peak: <span className="font-semibold text-foreground">{peakMonth.month} {peakMonth.year}, {fmtUsdMn(peakMonth.usdMn)}</span> · Monthly average {fmtUsdMn(monthlyAverage)}</p>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ left: 0, right: 16 }}>
                <defs>
                  <linearGradient id="mpTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[500, 'auto']} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtUsdMn(v), 'MP exports']} />
                <ReferenceLine y={monthlyAverage} stroke="hsl(var(--saffron))" strokeDasharray="4 4" label={{ value: 'Average', position: 'insideTopRight', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Area type="monotone" dataKey="usdMn" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#mpTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* STATE COMPARISON */}
        <Card>
          <CardHeader className="pb-0"><CardTitle className="text-base">Top 15 exporting states and UTs, {mpExportSource.stateYears.ytd} (US$ Mn)</CardTitle></CardHeader>
          <CardContent className="h-[440px] pt-4">
            <ResponsiveContainer>
              <BarChart data={statesTop} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="state" width={170} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, _n, item) => [`${fmtUsdMn(v)} (${fmtPct(item.payload.share2026)} share)`, 'Exports']} />
                <Bar dataKey="usdMn2026Ytd" radius={[0, 4, 4, 0]}>
                  {statesTop.map((s) => <Cell key={s.state} fill={s.state === 'Madhya Pradesh' ? 'hsl(var(--saffron))' : 'hsl(var(--chart-5))'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PRODUCT TABLE */}
        <section>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">All products</p>
              <h2 className="mt-1 text-2xl font-semibold">Search Madhya Pradesh exports by product</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product or sector" className="w-60 pl-9" aria-label="Search product or sector" />
              </div>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="w-56" aria-label="Sector"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All sectors</SelectItem>{sectorOptions.map((s) => <SelectItem key={s} value={s}>{shortSector(s)}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as 'value' | 'share')}>
                <SelectTrigger className="w-48" aria-label="Sort by"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="value">Sort by export value</SelectItem><SelectItem value="share">Sort by share of India</SelectItem></SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Sector</th>
                  <th className="px-4 py-3 text-right">MP exports (US$ Mn)</th>
                  <th className="px-4 py-3 text-right hidden md:table-cell">MP exports (₹ crore)</th>
                  <th className="px-4 py-3 text-right">MP share of India</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((r) => (
                  <tr key={r.name} className="hover:bg-muted/50">
                    <td className="px-4 py-2.5 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 hidden lg:table-cell text-muted-foreground">{shortSector(r.sector)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{r.usdMn.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums hidden md:table-cell">{r.inrCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={cn('inline-block min-w-[4rem] rounded-sm px-2 py-0.5 text-xs font-semibold tabular-nums', r.share >= 10 ? 'bg-accent text-accent-foreground' : r.share >= 5 ? 'bg-primary-soft text-primary' : 'text-muted-foreground')}>
                        {r.indiaUsdMn > 0 ? fmtPct(r.share) : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No products match your search.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>Showing {visible.length} of {rows.length} products</span>
            {rows.length > 20 && <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)}>{showAll ? 'Show top 20' : 'Show all products'}</Button>}
          </div>
        </section>

        {/* NEXT STEPS */}
        <section className="rounded-lg bg-primary-strong p-8 text-primary-foreground">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <Factory className="h-8 w-8 shrink-0 text-saffron" />
              <div>
                <h2 className="text-2xl font-semibold">Grow these strengths in new markets</h2>
                <p className="mt-1 text-primary-foreground/80">Check where India's trade agreements cut the customs duty on MP's leading products.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" asChild><Link to="/fta-benefit-finder">Check FTA benefit</Link></Button>
              <Button variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link to="/mp-export-intelligence">District export map <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
};

export default MpExportStrength;
