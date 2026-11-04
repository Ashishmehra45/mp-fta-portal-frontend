import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { agreements, agreementCategory, categoryLabel, statusLabel, formatDate, type AgreementCategory, type AgreementStatus } from '@/data/agreements';
import { Search, FileDown } from 'lucide-react';
import { agreementDocuments } from '@/data/agreementDocuments';
import { AgreementFlags } from '@/components/portal/AgreementFlags';
import { cn } from '@/lib/utils';

export const statusBadgeClass: Record<AgreementStatus, string> = {
  in_force: 'bg-accent text-accent-foreground hover:bg-accent',
  signed: 'bg-warning-soft text-warning border border-warning/40 hover:bg-warning-soft',
  negotiation: 'bg-muted text-muted-foreground border hover:bg-muted',
};

const Agreements = () => {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | AgreementStatus>('all');

  const list = useMemo(() => {
    const query = q.toLowerCase();
    return agreements.filter(
      (a) =>
        (status === 'all' || a.status === status) &&
        (!query || a.name.toLowerCase().includes(query) || a.shortName.toLowerCase().includes(query) || a.partners.some((p) => p.toLowerCase().includes(query))),
    );
  }, [q, status]);

  const count = (s: AgreementStatus) => agreements.filter((a) => a.status === s).length;

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Free Trade Agreement Explorer"
        title="India's Free Trade Agreements"
        description="Search by agreement or partner country. Agreements in force are clearly separated from those signed but not implemented, and those under negotiation."
      />
      <div className="container py-8 space-y-6">
        <DataNotice variant="source" title="About this directory">
          Statuses and dates reflect public announcements and are pending official verification. Always confirm on the Department of Commerce website before relying on a preference.
        </DataNotice>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agreement or partner country" className="pl-9" aria-label="Search agreements" />
          </div>
          <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All ({agreements.length})</TabsTrigger>
              <TabsTrigger value="in_force">In force ({count('in_force')})</TabsTrigger>
              <TabsTrigger value="signed">Signed ({count('signed')})</TabsTrigger>
              <TabsTrigger value="negotiation">Negotiating ({count('negotiation')})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {([
          ...(['fta', 'pta', 'treaty'] as AgreementCategory[]).map((cat) => ({
            key: cat,
            title: cat === 'treaty' ? categoryLabel[cat] : `${categoryLabel[cat]} in force`,
            note: cat === 'pta' ? 'Tariff concessions on a limited list of products only — not full free trade agreements.' : cat === 'treaty' ? 'Bilateral trade treaties with neighbouring countries — not FTAs or PTAs.' : null,
            items: list.filter((a) => a.status === 'in_force' && agreementCategory(a) === cat),
          })),
          {
            key: 'ongoing',
            title: 'Ongoing discussions — signed or under negotiation',
            note: 'Not yet in force — no tariff preferences can be claimed under these agreements yet.',
            items: list.filter((a) => a.status !== 'in_force'),
          },
        ]).map(({ key: cat, title, note, items }) => {
          if (!items.length) return null;
          return (
            <section key={cat} className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between gap-3 border-b pb-2">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <span className="text-sm text-muted-foreground">{items.length}</span>
              </div>
              {note && <p className="text-sm text-muted-foreground">{note}</p>}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((a) => (
                <div key={a.id} className="flex flex-col rounded-lg border bg-card shadow-card hover:border-primary">
                <Link to={`/trade-agreements/${a.id}`} className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-2"><AgreementFlags codes={a.partnerCodes} /><span className="font-mono text-xs text-muted-foreground">{a.type}</span></span>
                    <Badge className={cn('text-[11px]', statusBadgeClass[a.status])}>{statusLabel[a.status]}</Badge>
                  </div>
                  <h3 className="mt-2 font-sans text-lg font-semibold">{a.shortName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.name}</p>
                  <p className="mt-3 text-sm"><span className="text-muted-foreground">Partners: </span>{a.partners.join(', ')}</p>
                  <dl className="mt-auto pt-4 grid grid-cols-2 gap-2 text-xs">
                    <div><dt className="text-muted-foreground">Signed</dt><dd className="font-mono">{formatDate(a.signed)}</dd></div>
                    <div><dt className="text-muted-foreground">In force</dt><dd className="font-mono">{formatDate(a.inForce)}</dd></div>
                  </dl>
                </Link>
                {agreementDocuments[a.id] && (
                  <div className="flex flex-wrap gap-2 border-t px-5 py-3">
                    {agreementDocuments[a.id].map((d) => (
                      <a key={d.url} href={d.url} download={d.filename} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
                        <FileDown className="h-3.5 w-3.5" /> {d.label} (PDF)
                      </a>
                    ))}
                  </div>
                )}
                </div>
                ))}
              </div>
            </section>
          );
        })}
        {list.length === 0 && <p className="text-muted-foreground">No agreements match your search.</p>}
      </div>
    </PortalLayout>
  );
};

export default Agreements;
