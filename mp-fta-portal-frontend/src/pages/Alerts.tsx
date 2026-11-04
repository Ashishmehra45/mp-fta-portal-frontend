import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice, DemoBadge } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries, getCountry } from '@/data/countries';
import { agreementsForCountry } from '@/data/agreements';
import { BellRing, Inbox, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface WatchItem { id: string; product: string; hs: string; market: string }
const STORE = 'mpfta.alerts.watchlist';
const PREFS = 'mpfta.alerts.prefs';

const alertTypes = [
  { id: 'concession', label: 'Tariff concession becomes effective' },
  { id: 'rate', label: 'Tariff rate changes' },
  { id: 'agreement', label: 'An agreement is implemented' },
  { id: 'origin', label: 'A relevant origin rule changes' },
  { id: 'regulatory', label: 'Market regulatory requirement changes' },
  { id: 'buyer', label: 'Relevant buyer opportunity or export event' },
];

const Alerts = () => {
  const [items, setItems] = useState<WatchItem[]>(() => JSON.parse(localStorage.getItem(STORE) || '[]'));
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => JSON.parse(localStorage.getItem(PREFS) || 'null') ?? Object.fromEntries(alertTypes.map((a) => [a.id, true])));
  const [market, setMarket] = useState('AE');

  useEffect(() => localStorage.setItem(STORE, JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem(PREFS, JSON.stringify(prefs)), [prefs]);

  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const product = String(fd.get('product') || '').trim().slice(0, 100);
    const hs = String(fd.get('hs') || '').replace(/\D/g, '').slice(0, 10);
    if (!product && hs.length < 4) { toast.error('Enter a product name or an HS code of at least 4 digits'); return; }
    setItems((s) => [...s, { id: crypto.randomUUID(), product, hs, market }]);
    e.currentTarget.reset();
    toast.success('Added to your watchlist');
  };

  return (
    <PortalLayout>
      <PageHeader eyebrow="Free Trade Agreements · Alerts" title="Personalised FTA Alerts" description="Follow changes to Free Trade Agreement duties, origin rules and regulations for your products, HS codes and markets. Alerts are issued only when verified data shows a change, with the source and effective date." />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Add to watchlist</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={add} className="grid gap-3 sm:grid-cols-12 items-end">
                <div className="sm:col-span-4 space-y-1"><Label htmlFor="w-p">Product</Label><Input id="w-p" name="product" maxLength={100} placeholder="e.g. Turmeric" /></div>
                <div className="sm:col-span-3 space-y-1"><Label htmlFor="w-h">HS code</Label><Input id="w-h" name="hs" className="font-mono" placeholder="091030" /></div>
                <div className="sm:col-span-3 space-y-1"><Label>Market</Label>
                  <Select value={market} onValueChange={setMarket}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="max-h-64">{countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <Button type="submit" className="sm:col-span-2">Add</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Your watchlist ({items.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {items.length === 0 ? <p className="px-6 pb-6 text-sm text-muted-foreground">Nothing saved yet.</p> : (
                <ul className="divide-y">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="flex-1">
                        <p className="font-medium">{i.product || 'HS line'} {i.hs && <span className="font-mono text-xs text-muted-foreground">HS {i.hs}</span>}</p>
                        <p className="text-xs text-muted-foreground">{getCountry(i.market)?.name} · {agreementsForCountry(i.market).map((a) => a.shortName).join(', ') || 'No Indian FTA'}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild><Link to={`/fta-benefit-finder?hs=${i.hs}&dest=${i.market}`}>Check</Link></Button>
                      <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => setItems((s) => s.filter((x) => x.id !== i.id))}><Trash2 className="h-4 w-4" /></Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2 rounded-md border border-dashed py-8 text-center">
                <Inbox className="h-7 w-7 text-muted-foreground" />
                <p className="font-medium">No verified alerts yet</p>
                <p className="max-w-md text-sm text-muted-foreground">Alerts will be generated once official tariff and regulatory data feeds are integrated.</p>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert format preview</p><DemoBadge /></div>
                <p className="mt-2 font-medium flex items-center gap-2"><BellRing className="h-4 w-4 text-primary" />Tariff concession effective — [HS line] to [Market]</p>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div><dt className="font-medium text-foreground">Effective date</dt><dd>[DD MMM YYYY]</dd></div>
                  <div><dt className="font-medium text-foreground">Agreement</dt><dd>[Agreement name]</dd></div>
                  <div className="col-span-2"><dt className="font-medium text-foreground">Source</dt><dd>[Official notification reference and link]</dd></div>
                </dl>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Notify me when</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {alertTypes.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3">
                  <Label htmlFor={`p-${a.id}`} className="font-normal">{a.label}</Label>
                  <Switch id={`p-${a.id}`} checked={!!prefs[a.id]} onCheckedChange={(c) => setPrefs((p) => ({ ...p, [a.id]: c }))} />
                </div>
              ))}
            </CardContent>
          </Card>
          <DataNotice variant="source" title="Delivery channels">
            In-platform alerts and preferences are saved on this device. Email alerts for registered businesses will be enabled once the official notification service is configured.
          </DataNotice>
        </aside>
      </div>
    </PortalLayout>
  );
};

export default Alerts;
