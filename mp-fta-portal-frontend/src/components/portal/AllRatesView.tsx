import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, BadgePercent, Equal, HelpCircle, Loader2, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { DataNotice } from '@/components/portal/DataNotice';
import { UpdatedAsOn } from '@/components/portal/UpdatedAsOn';
import { Button } from '@/components/ui/button';
import { NO_AGREEMENT_DESTINATIONS, suppliedSchedule, type ScheduleLine } from '@/services/suppliedTariffs';
import { compareCustoms, fmtPoints, summariseSavings, type BenefitKind } from '@/lib/rateCompare';
import { formatHs } from '@/data/products';
import { cleanApiText, cn } from '@/lib/utils';

const kindStyle: Record<BenefitKind, { tile: string; rate: string; chip: string; icon: typeof ArrowDownRight }> = {
  lower: { tile: 'border-accent/50 bg-accent-soft', rate: 'text-accent', chip: 'bg-accent text-accent-foreground', icon: ArrowDownRight },
  same: { tile: 'border-warning/40 bg-warning-soft', rate: 'text-warning', chip: 'bg-warning-soft text-warning border border-warning/40', icon: Equal },
  higher: { tile: 'border-destructive/40 bg-destructive-soft', rate: 'text-destructive', chip: 'bg-destructive-soft text-destructive border border-destructive/40', icon: ArrowUpRight },
  unknown: { tile: 'border-border bg-muted/50', rate: 'text-foreground', chip: 'bg-muted text-muted-foreground border', icon: HelpCircle },
};

function chipText(kind: BenefitKind, points: number | null, fta: number | null) {
  if (kind === 'lower') return fta === 0 ? `Duty-free · saves ${fmtPoints(points!)}%` : `Saves ${fmtPoints(points!)}%`;
  if (kind === 'same') return 'Same as normal rate';
  if (kind === 'higher') return `Higher by ${fmtPoints(points!)}%`;
  return 'Check rate conditions';
}

const typeLabel = { FTA: 'Free Trade Agreement', PTA: 'Preferential Trade Agreement', GSP: 'GSP preference scheme', TREATY: 'Trade treaty' } as const;
const PAGE = 15;

function LineCard({ line, noAgreement }: { line: ScheduleLine; noAgreement: boolean }) {
  const rows = line.preferential.map((p) => ({ p, c: compareCustoms(line.mfn, p.rate) }));
  const saves = rows.some((r) => r.c.kind === 'lower');
  return (
    <li className={cn('rounded-lg border bg-card p-4', saves && 'border-accent/60 shadow-sm')}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 text-sm">
          <span className="font-mono font-semibold">{line.code}</span>
          <span className="text-muted-foreground"> — {cleanApiText(line.description)}</span>
        </p>
        {saves && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"><Sparkles className="h-3 w-3" />FTA saving</span>}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-md border border-primary/30 bg-primary-soft p-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Normal (MFN)</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-primary whitespace-pre-wrap break-words">{line.mfn ? cleanApiText(line.mfn) : '—'}</p>
        </div>
        {rows.length === 0 ? (
          <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground sm:col-span-1 lg:col-span-2 flex items-center">
            {noAgreement ? 'No Free Trade Agreement (FTA) rate — the normal rate applies.' : 'No preference for Indian goods — the normal rate applies.'}
          </div>
        ) : (
          rows.map(({ p, c }) => {
            const s = kindStyle[c.kind];
            const Icon = s.icon;
            return (
              <div key={p.short} className={cn('rounded-md border p-3', s.tile)} title={cleanApiText(p.agreement)}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{cleanApiText(p.short)}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={cn('font-mono text-2xl font-semibold whitespace-pre-wrap break-words', s.rate)}>{p.rate ? cleanApiText(p.rate) : '—'}</span>
                  {c.kind === 'lower' && line.mfn && <span className="font-mono text-xs text-muted-foreground line-through">{cleanApiText(line.mfn)}</span>}
                </div>
                <span className={cn('mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', s.chip)}>
                  <Icon className="h-3.5 w-3.5" />{chipText(c.kind, c.points, c.fta)}
                </span>
                {p.rulesOfOrigin && <p className="mt-2 text-xs text-muted-foreground">Rule of origin: <span className="font-medium text-foreground">{cleanApiText(p.rulesOfOrigin)}</span></p>}
                {p.footnote && <p className="mt-2 whitespace-pre-line text-xs text-muted-foreground">Note: {cleanApiText(p.footnote)}</p>}
              </div>
            );
          })
        )}
        {line.additional.map((a) => (
          <div key={a.short} className="rounded-md border border-destructive/40 bg-destructive-soft p-3" title={cleanApiText(a.name)}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{cleanApiText(a.name)}</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-2xl font-semibold text-destructive whitespace-pre-wrap break-words"><Plus className="h-5 w-5 shrink-0" />{cleanApiText(a.rate)}</p>
            <span className="mt-2 inline-flex rounded-md border border-destructive/40 px-2 py-0.5 text-xs font-medium text-destructive">Charged on top of the normal rate</span>
            {a.footnote && <p className="mt-2 whitespace-pre-line text-xs text-muted-foreground">Note: {cleanApiText(a.footnote)}</p>}
          </div>
        ))}
      </div>
    </li>
  );
}

/** One-click view of every tariff line under the HS code with normal (MFN) and every agreement rate. Customs duty only. */
export function AllRatesView({ hs, dest, destName }: { hs: string; dest: string; destName: string }) {
  const digits = hs.replace(/\D/g, '');
  const [onlySavings, setOnlySavings] = useState(false);
  const [shown, setShown] = useState(PAGE);

  const q = useQuery({
    queryKey: ['supplied-schedule', digits, dest],
    queryFn: () => suppliedSchedule(digits, dest),
    enabled: digits.length >= 4,
    staleTime: 10 * 60_000,
  });

  const lines = q.data?.lines ?? [];
  const noAgreement = NO_AGREEMENT_DESTINATIONS.has(dest.toUpperCase());
  const hasAdditional = lines.some((l) => l.additional.length > 0);
  const summary = useMemo(() => summariseSavings(lines), [lines]);
  const agreements = useMemo(() => {
    const m = new Map<string, { name: string; type: keyof typeof typeLabel }>();
    lines.forEach((l) => l.preferential.forEach((p) => m.set(p.short, { name: p.agreement, type: p.agreementType ?? 'FTA' })));
    return [...m.entries()];
  }, [lines]);
  const visible = (onlySavings ? lines.filter((l) => l.preferential.some((p) => compareCustoms(l.mfn, p.rate).kind === 'lower')) : lines);

  if (digits.length < 4) {
    return <DataNotice variant="source" title="Enter an HS code to see customs duty rates">Pick a product from the suggestions or type at least 4 digits of its HS code.</DataNotice>;
  }
  if (q.isLoading) return <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading {destName} customs duty rates…</p>;
  if (q.isError) return <DataNotice variant="unavailable" title="Rates could not be loaded">Please try again shortly.</DataNotice>;
  if (!lines.length) {
    return <DataNotice variant="unavailable" title="No tariff line found">No {destName} tariff line matches HS {formatHs(digits)}. Check the code and try again.</DataNotice>;
  }

  return (
    <div className="space-y-4">
      {noAgreement ? (
        <div className="rounded-xl border bg-muted/50 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">No Free Trade Agreement (FTA) with {destName}</p>
          <p className="mt-1 text-sm">India has no Free Trade Agreement in force with {destName}, so Indian goods pay the normal (MFN) rate. {hasAdditional ? 'Some tariff lines under this HS code also carry additional duties, shown in red, charged on top of the normal rate.' : 'No additional duty is listed for these tariff lines.'}</p>
        </div>
      ) : summary.withSaving > 0 ? (
        <div className="relative overflow-hidden rounded-xl border border-accent/50 bg-gradient-to-br from-accent-soft via-card to-primary-soft p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><BadgePercent className="h-7 w-7" /></span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">FTA duty saving available</p>
              <p className="font-display text-2xl font-semibold sm:text-3xl">
                Save up to <span className="text-accent">{fmtPoints(summary.maxPoints)}%</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Best under <span className="font-medium text-foreground">{summary.bestAgreement}</span> · lower FTA rate on {summary.withSaving} of {summary.total} tariff line{summary.total > 1 ? 's' : ''}
                {summary.dutyFree > 0 && <> · duty-free on {summary.dutyFree}</>}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/50 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">No FTA saving found</p>
          <p className="mt-1 text-sm">None of the {summary.total} tariff line{summary.total > 1 ? 's' : ''} under HS {formatHs(digits)} has a lower agreement rate for Indian goods — the normal (MFN) rate applies.</p>
        </div>
      )}

      {agreements.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-xs">
          {agreements.map(([code, a]) => (
            <li key={code} className="rounded-md border bg-card px-2 py-1">
              <span className="font-semibold">{code}</span> <span className="text-muted-foreground">— {cleanApiText(a.name)} ({typeLabel[a.type]})</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-md border p-0.5 text-sm" role="group" aria-label="Filter tariff lines">
          <button type="button" onClick={() => { setOnlySavings(false); setShown(PAGE); }} className={cn('rounded px-3 py-1', !onlySavings ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>All lines ({summary.total})</button>
          {!noAgreement && <button type="button" onClick={() => { setOnlySavings(true); setShown(PAGE); }} disabled={!summary.withSaving} className={cn('rounded px-3 py-1 disabled:opacity-50', onlySavings ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>With FTA saving ({summary.withSaving})</button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <UpdatedAsOn />
          <Button variant="ghost" size="sm" onClick={() => q.refetch()} disabled={q.isFetching}>
            <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', q.isFetching && 'animate-spin')} />Re-check
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {visible.slice(0, shown).map((l) => <LineCard key={l.code} line={l} noAgreement={noAgreement} />)}
      </ul>
      {visible.length > shown && (
        <Button variant="outline" className="w-full" onClick={() => setShown((n) => n + PAGE)}>Show more lines ({visible.length - shown} more)</Button>
      )}

      <p className="text-xs text-muted-foreground">
        Source: {q.data!.source} · Checked {new Date(q.data!.checkedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · {noAgreement ? 'Customs duty and listed additional duties only — other taxes are not included' : 'Customs duty only — other duties and taxes are not included'}
      </p>
    </div>
  );
}
