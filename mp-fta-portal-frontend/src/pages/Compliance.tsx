import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories, destinations, destinationOptions, indiaByCategory, indiaCommon, type Category, type ReqType, type Requirement } from '@/data/compliance';
import { getCountry } from '@/data/countries';
import { downloadCsv, downloadPdfReport } from '@/lib/reports';
import { Download, ExternalLink, FileDown, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const typeStyle: Record<ReqType, string> = {
  mandatory: 'bg-primary text-primary-foreground hover:bg-primary',
  recommended: 'bg-accent-soft text-accent border border-accent/40 hover:bg-accent-soft',
  guidance: 'bg-muted text-muted-foreground border hover:bg-muted',
};
const typeLabel: Record<ReqType, string> = { mandatory: 'Mandatory', recommended: 'Recommended', guidance: 'General guidance' };
const STORE = 'mpfta.compliance.checklists';

const Compliance = () => {
  const [params] = useSearchParams();
  const [category, setCategory] = useState<Category>('food');
  const [dest, setDest] = useState(() => {
    const p = params.get('dest');
    if (p && destinations[p]) return p;
    if (p && ['FR', 'NL', 'IT', 'ES', 'BE', 'PL'].includes(p)) return 'DE';
    return 'AE';
  });
  const [checked, setChecked] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | ReqType>('all');

  const key = `${dest}:${category}`;
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    setChecked(saved[key] ?? []);
  }, [key]);

  const destination = destinations[dest];
  const destReqs = destination.items[category] ?? [];
  const all: { group: string; items: Requirement[] }[] = useMemo(
    () => [
      { group: `Destination: ${dest === 'DE' ? 'European Union' : getCountry(dest)?.name}`, items: destReqs },
      { group: 'India — sector requirements', items: indiaByCategory[category] },
      { group: 'India — all exporters', items: indiaCommon },
    ],
    [dest, destReqs, category],
  );
  const flat = all.flatMap((g) => g.items);
  const done = flat.filter((i) => checked.includes(i.id)).length;

  const save = () => {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    saved[key] = checked;
    localStorage.setItem(STORE, JSON.stringify(saved));
    toast.success('Checklist saved on this device');
  };
  const destName = dest === 'DE' ? 'European Union' : getCountry(dest)?.name ?? dest;
  const catName = categories.find((c) => c.id === category)!.name;

  const exportCsv = () =>
    downloadCsv(`compliance-${dest}-${category}.csv`, ['Group', 'Requirement', 'Topic', 'Type', 'Authority', 'Source', 'Completed'],
      all.flatMap((g) => g.items.map((i) => [g.group, i.title, i.topic, typeLabel[i.type], i.authority, i.url, checked.includes(i.id) ? 'Yes' : 'No'])));

  const exportPdf = () =>
    downloadPdfReport(`compliance-${dest}-${category}.pdf`, 'Market access & compliance checklist', `${catName} · India → ${destName}`,
      all.map((g) => ({ heading: g.group, lines: g.items.map((i) => `[${checked.includes(i.id) ? 'x' : ' '}] ${i.title} — ${typeLabel[i.type]} · ${i.authority} (${i.url})${i.note ? ` · ${i.note}` : ''}`) })),
      'Requirements vary by HS line and change over time. Confirm with the linked authority before shipment.');

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Free Trade Agreements · Market access"
        title="Market Access & Compliance Navigator"
        description="Standards, technical regulations, SPS measures, labelling, licensing, certification and documentation for your product and destination, alongside the FTA certificate of origin you need."
        actions={<>
          <Button variant="outline" onClick={save}><Save className="mr-2 h-4 w-4" />Save checklist</Button>
          <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />CSV</Button>
          <Button onClick={exportPdf}><FileDown className="mr-2 h-4 w-4" />PDF</Button>
        </>}
      />
      <div className="container py-8 space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label>Product category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Destination</Label>
            <Select value={dest} onValueChange={setDest}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>{destinationOptions.map((c) => <SelectItem key={c} value={c}>{c === 'DE' ? 'European Union' : getCountry(c)?.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Show</Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All requirements</SelectItem><SelectItem value="mandatory">Mandatory only</SelectItem><SelectItem value="recommended">Recommended</SelectItem><SelectItem value="guidance">General guidance</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-sm"><span className="font-semibold">{done}</span> of {flat.length} completed</div>
        </div>

        <DataNotice variant="source" title={`Authoritative portal: ${destination.portal.label}`}>
          Each item links to the responsible authority. Requirements depend on the exact HS line and may change. <a href={destination.portal.url} target="_blank" rel="noreferrer" className="text-primary underline">Visit {destination.portal.label} ↗</a>
        </DataNotice>

        {all.map((g) => {
          const items = g.items.filter((i) => filter === 'all' || i.type === filter);
          return (
            <Card key={g.group}>
              <CardHeader className="pb-2"><CardTitle className="text-lg">{g.group}</CardTitle></CardHeader>
              <CardContent className="p-0">
                {items.length === 0 ? (
                  <p className="px-6 pb-6 text-sm text-muted-foreground">No requirements recorded for this filter. <span className="text-warning font-medium">Data unavailable — verification required.</span></p>
                ) : (
                  <ul className="divide-y">
                    {items.map((i) => (
                      <li key={i.id} className={cn('flex items-start gap-3 px-6 py-4', checked.includes(i.id) && 'bg-accent-soft/40')}>
                        <Checkbox id={i.id} checked={checked.includes(i.id)} onCheckedChange={(c) => setChecked((s) => (c ? [...s, i.id] : s.filter((x) => x !== i.id)))} className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor={i.id} className="font-medium cursor-pointer">{i.title}</label>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge className={cn('text-[10px]', typeStyle[i.type])}>{typeLabel[i.type]}</Badge>
                            <span>{i.topic}</span><span>·</span><span>{i.authority}</span>
                          </div>
                          {i.note && <p className="mt-1 text-xs text-muted-foreground">{i.note}</p>}
                        </div>
                        <a href={i.url} target="_blank" rel="noreferrer" className="text-primary" aria-label={`Source for ${i.title}`}><ExternalLink className="h-4 w-4" /></a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PortalLayout>
  );
};

export default Compliance;
