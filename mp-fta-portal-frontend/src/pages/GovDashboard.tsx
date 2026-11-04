import { useMemo, useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice, DemoBadge } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { districts, divisions } from '@/data/districts';
import { sectors } from '@/data/products';
import { downloadCsv } from '@/lib/reports';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mpExportSource } from '@/data/mpExports';
import { fmtPct, fmtUsdBn, mpShareOfIndia, mpTotalUsdMn } from '@/lib/exportStats';

// Deterministic DEMONSTRATION numbers — not official statistics.
const seed = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 100003; return h; };
const periods = ['FY 2023-24', 'FY 2024-25', 'FY 2025-26'];
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const tooltipStyle = { background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 12 };

const GovDashboard = () => {
  const [period, setPeriod] = useState(periods[2]);
  const [division, setDivision] = useState('all');
  const [sector, setSector] = useState('all');

  const key = `${period}-${division}-${sector}`;
  const k = (s: string) => seed(`${key}-${s}`);

  const kpis = [
    { tier: '1. Potential identified', label: 'FTA opportunities identified', value: 200 + (k('opp') % 900) },
    { tier: '2. Estimated benefit', label: 'Potential duty savings identified (₹ lakh)', value: 50 + (k('sav') % 800) },
    { tier: '3. Verified utilisation', label: 'Preferential CoOs verified', value: 'Data unavailable' },
    { tier: '4. Confirmed outcomes', label: 'Export orders confirmed', value: 'Data unavailable' },
  ];
  const ops = [
    { label: 'Exporters assessed', value: 40 + (k('ex') % 400) },
    { label: 'FTA-related enquiries', value: 60 + (k('enq') % 500) },
    { label: 'Origin assessments needing help', value: 5 + (k('roo') % 80) },
    { label: 'Compliance referrals', value: 5 + (k('cmp') % 60) },
    { label: 'Buyer connections facilitated', value: k('buy') % 40 },
  ];

  const byDistrict = useMemo(() => districts
    .filter((d) => d.profile && (division === 'all' || d.division === division) && (sector === 'all' || d.profile.sectors.includes(sector as never)))
    .map((d) => ({ name: d.name, enquiries: 5 + (k(d.name) % 90), assessments: 2 + (k(d.name + 'a') % 40) }))
    .sort((a, b) => b.enquiries - a.enquiries).slice(0, 10), [division, sector, key]); // eslint-disable-line react-hooks/exhaustive-deps

  const bySector = sectors.map((s) => ({ name: s.name.split(' ')[0], opportunities: 10 + (k(s.id) % 120) }));
  const trend = months.map((m, i) => ({ month: m, enquiries: 20 + (k(m) % 60) + i * 3, assessments: 8 + (k(m + 'x') % 30) + i * 2 }));
  const dests = ['UAE', 'Australia', 'Japan', 'ASEAN', 'UK', 'EFTA', 'Mauritius', 'Korea'].map((d) => ({ name: d, enquiries: 10 + (k(d) % 150) }));

  const exportCsv = () => downloadCsv(`dashboard-${period}.csv`, ['Section', 'Metric', 'Value', 'Note'], [
    ...kpis.map((x) => ['KPI', x.label, x.value, 'DEMONSTRATION DATA']),
    ...ops.map((x) => ['Operations', x.label, x.value, 'DEMONSTRATION DATA']),
    ...byDistrict.map((x) => ['District', x.name, x.enquiries, 'DEMONSTRATION DATA — enquiries']),
  ]);

  return (
    <PortalLayout>
      <PageHeader eyebrow="Free Trade Agreements · Utilisation" title="Government Administration Dashboard" description="District, sector and destination indicators for Free Trade Agreement (FTA) utilisation — separating potential, estimated, verified and confirmed outcomes."
        actions={<Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Export CSV</Button>} />
      <div className="container py-8 space-y-6">
        <Link to="/mp-export-strength" className="group flex flex-col gap-3 rounded-lg border border-accent/40 bg-card p-5 shadow-card transition-colors hover:border-accent sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Official export statistics</p>
            <p className="mt-1 font-semibold">Madhya Pradesh exported {fmtUsdBn(mpTotalUsdMn)} in {mpExportSource.fiscalYear} — {fmtPct(mpShareOfIndia)} of India's exports</p>
            <p className="text-sm text-muted-foreground">See top products, sectors, monthly trend and where MP leads India.</p>
          </div>
          <span className="inline-flex shrink-0 items-center text-sm font-medium text-primary">Open MP Export Strength <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
        </Link>

        <DataNotice variant="demo" title="Demonstration dashboard — all figures are illustrative">
          Numbers are generated for layout demonstration and are not government statistics. In production this dashboard is restricted to authorised officials with role-based permissions and audit logs; exports are subject to permissions.
        </DataNotice>

        <div className="flex flex-wrap gap-3">
          <div className="space-y-1"><Label>Reporting period</Label><Select value={period} onValueChange={setPeriod}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>{periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Division</Label><Select value={division} onValueChange={setDivision}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All divisions</SelectItem>{divisions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Sector</Label><Select value={sector} onValueChange={setSector}><SelectTrigger className="w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All sectors</SelectItem>{sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((x) => (
            <Card key={x.label}>
              <CardContent className="pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{x.tier}</p>
                <p className="mt-1 text-sm text-muted-foreground">{x.label}</p>
                <p className={typeof x.value === 'number' ? 'mt-2 font-display text-3xl font-semibold' : 'mt-2 text-sm font-semibold text-warning'}>{typeof x.value === 'number' ? x.value.toLocaleString('en-IN') : `${x.value} — verification required`}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ops.map((o) => (
            <div key={o.label} className="rounded-md border bg-card p-4"><p className="text-xs text-muted-foreground">{o.label}</p><p className="mt-1 text-xl font-semibold">{o.value}</p></div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-0 flex-row items-center justify-between space-y-0"><CardTitle className="text-base">District-wise FTA enquiries & assessments</CardTitle><DemoBadge /></CardHeader>
            <CardContent className="h-80 pt-4">
              <ResponsiveContainer><BarChart data={byDistrict}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="enquiries" fill="hsl(var(--chart-1))" /><Bar dataKey="assessments" fill="hsl(var(--chart-2))" /></BarChart></ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0 flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Sector-wise opportunities identified</CardTitle><DemoBadge /></CardHeader>
            <CardContent className="h-80 pt-4">
              <ResponsiveContainer><BarChart data={bySector}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="opportunities" fill="hsl(var(--chart-3))" /></BarChart></ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0 flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Monthly trend — {period}</CardTitle><DemoBadge /></CardHeader>
            <CardContent className="h-72 pt-4">
              <ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Line dataKey="enquiries" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} /><Line dataKey="assessments" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-0 flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Destination-market interest</CardTitle><DemoBadge /></CardHeader>
            <CardContent className="h-72 pt-4">
              <ResponsiveContainer><BarChart data={dests} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="enquiries" fill="hsl(var(--chart-1))" /></BarChart></ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 flex items-start gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <p className="text-muted-foreground">Production safeguards: role-based access for district and state officials, audit logging of every view and export, and masking of confidential business information. Realised export outcomes are shown only where verified data is available.</p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default GovDashboard;
