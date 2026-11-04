import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Equal, HelpCircle, Loader2, LogIn, RefreshCw, ShieldCheck, Trophy } from 'lucide-react';
import { DataNotice } from '@/components/portal/DataNotice';
import { UpdatedAsOn } from '@/components/portal/UpdatedAsOn';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { findTariffLines, verifyRates, hasCalculatorSession, RateCheckError, type PreferentialRate } from '@/services/rateCheck';
import { useAuth } from '@/contexts/AuthContext';
import { formatHs } from '@/data/products';
import { cleanApiText, cn } from '@/lib/utils';
import { compareCustoms, fmtPoints, type BenefitKind } from '@/lib/rateCompare';

const retryable = (n: number, e: unknown) => n < 1 && !(e instanceof RateCheckError && e.code !== 'upstream_error');

function ErrorNotice({ error }: { error: unknown }) {
  const code = error instanceof RateCheckError ? error.code : 'upstream_error';
  const location = useLocation();
  if (code === 'needs_details') {
    return (
      <DataNotice variant="unavailable" title="This tariff line needs more product details">
        The customs duty for this line depends on extra product attributes, so it cannot be shown here.
      </DataNotice>
    );
  }
  if (code === 'country_unsupported') {
    return <DataNotice variant="unavailable">Live customs duty rates for this destination are not yet covered by the tariff service.</DataNotice>;
  }
  if (code === 'key_invalid' || code === 'key_missing') {
    const signedIn = hasCalculatorSession();
    return (
      <div className="space-y-3">
        <DataNotice variant="unavailable" title={signedIn ? 'Your sign-in has expired' : 'Sign in to see live customs duty rates'}>
          {signedIn
            ? 'Sign in again to see live customs duty rates here.'
            : 'Live customs duty rates need a portal sign-in. The rest of this page stays open to everyone.'}
        </DataNotice>
        <Button size="sm" asChild>
          <Link to="/signin" state={{ from: { pathname: location.pathname + location.search } }}><LogIn className="mr-2 h-4 w-4" />Sign in to see rates</Link>
        </Button>
      </div>
    );
  }
  return (
    <DataNotice variant="unavailable" title="Live rate check is temporarily unavailable">
      The tariff service could not be reached, so no rate is shown. Please try again later.
    </DataNotice>
  );
}

const benefitStyle: Record<BenefitKind, { cls: string; bar: string; text: string; icon: typeof ArrowDownRight }> = {
  lower: { cls: 'border-accent/40 bg-accent-soft text-accent', bar: 'bg-accent', text: 'text-accent', icon: ArrowDownRight },
  same: { cls: 'border-warning/40 bg-warning-soft text-warning', bar: 'bg-warning', text: 'text-warning', icon: Equal },
  higher: { cls: 'border-destructive/40 bg-destructive-soft text-destructive', bar: 'bg-destructive', text: 'text-destructive', icon: ArrowUpRight },
  unknown: { cls: 'border-border bg-muted text-muted-foreground', bar: 'bg-muted-foreground/40', text: 'text-foreground', icon: HelpCircle },
};

function benefitLabel(kind: BenefitKind, points: number | null, ftaValue: number | null) {
  if (kind === 'lower') return ftaValue === 0 ? `Duty-free — saves ${fmtPoints(points!)}%` : `Saves ${fmtPoints(points!)}%`;
  if (kind === 'same') return 'No reduction — same as normal rate';
  if (kind === 'higher') return `Higher by ${fmtPoints(points!)}%`;
  return 'Compare rate conditions';
}

function RateBar({ value, max, cls }: { value: number | null; max: number; cls: string }) {
  if (value === null || max <= 0) return null;
  const pct = Math.max(value === 0 ? 0 : 3, (value / max) * 100);
  return (
    <div className="h-2 w-full rounded-full bg-muted" aria-hidden>
      <div className={cn('h-2 rounded-full transition-all', cls)} style={{ width: `${pct}%` }} />
    </div>
  );
}

const typeLabel = { FTA: 'FTA', PTA: 'Preferential Trade Agreement', GSP: 'GSP preference scheme', TREATY: 'Trade treaty' } as const;
function preferentialHeading(list: PreferentialRate[]) {
  const types = [...new Set(list.map((p) => p.agreementType ?? 'FTA'))];
  return `Customs duty under ${(types.length ? types : ['FTA' as const]).map((t) => typeLabel[t]).join(' / ')} (Indian origin)`;
}

function Comparison({ normal, normalName, preferential }: { normal: string | null; normalName: string; preferential: PreferentialRate[] }) {
  const rows = preferential.map((p) => ({ p, c: compareCustoms(normal, p.rate) }));
  const normalValue = compareCustoms(normal, normal).normal;
  const max = Math.max(normalValue ?? 0, ...rows.map((r) => r.c.fta ?? 0));
  const best = rows.reduce<number>((bi, r, i) => (r.c.kind === 'lower' && (bi < 0 || (r.c.points ?? 0) > (rows[bi].c.points ?? 0)) ? i : bi), -1);

  return (
    <div className="space-y-3">
      <div className="rounded-md border bg-primary-soft p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Actual customs duty (normal / MFN rate)</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm">{cleanApiText(normalName) || 'Customs duty'}</span>
          <span className="font-mono text-2xl font-semibold text-primary whitespace-pre-wrap">{normal ? cleanApiText(normal) : '—'}</span>
        </div>
        <div className="mt-2"><RateBar value={normalValue} max={max} cls="bg-primary" /></div>
      </div>

      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {preferentialHeading(preferential)}
      </p>
      <ul className="space-y-2">
        {rows.map(({ p, c }, i) => {
          const s = benefitStyle[c.kind];
          const Icon = s.icon;
          const title = cleanApiText(p.short || p.agreement || p.name) || 'FTA';
          const sub = cleanApiText(p.agreement && p.agreement !== p.short ? p.agreement : p.name !== p.short ? p.name : '');
          return (
            <li key={`${title}-${i}`} className={cn('rounded-md border p-3', i === best ? 'border-accent ring-1 ring-accent' : '')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    {title}
                    {i === best && <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"><Trophy className="h-3 w-3" />Best benefit</span>}
                  </p>
                  {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                  {p.notification && <p className="text-xs text-muted-foreground">Notification {cleanApiText(p.notification)}</p>}
                  {p.rulesOfOrigin && <p className="mt-1 text-xs"><span className="text-muted-foreground">Rule of origin:</span> <span className="font-medium">{cleanApiText(p.rulesOfOrigin)}</span></p>}
                </div>
                <div className="text-right">
                  <p className={cn('font-mono text-xl font-semibold whitespace-pre-wrap', s.text)}>{p.rate ? cleanApiText(p.rate) : '—'}</p>
                  {c.kind === 'lower' && normal && <span className="text-xs text-muted-foreground line-through">{cleanApiText(normal)}</span>}
                </div>
              </div>
              <div className="mt-2"><RateBar value={c.fta} max={max} cls={s.bar} /></div>
              <p className={cn('mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium', s.cls)}>
                <Icon className="h-3.5 w-3.5" />{benefitLabel(c.kind, c.points, c.fta)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RateVerification({ hs, dest, destName }: { hs: string; dest: string; destName: string }) {
  const digits = hs.replace(/\D/g, '');
  const [line, setLine] = useState('');
  const { isAuthenticated } = useAuth();

  const lines = useQuery({
    queryKey: ['rate-lines', digits, dest, isAuthenticated],
    queryFn: () => findTariffLines(digits, dest),
    enabled: digits.length >= 6,
    staleTime: 10 * 60_000,
    retry: retryable,
  });

  useEffect(() => {
    const list = lines.data?.lines ?? [];
    setLine(list.find((l) => l.code === digits)?.code ?? list[0]?.code ?? '');
  }, [lines.data, digits]);

  const rates = useQuery({
    queryKey: ['rate-verify-customs', line, dest, isAuthenticated],
    queryFn: () => verifyRates(line, dest),
    enabled: !!line,
    staleTime: 10 * 60_000,
    retry: retryable,
  });

  if (digits.length < 6) {
    return <DataNotice variant="source" title="Enter a 6-digit HS code to see customs duty rates">Pick a product from the suggestions or type its HS code.</DataNotice>;
  }
  if (lines.isLoading) return <Loading text={`Finding ${destName} tariff lines…`} />;
  if (lines.isError) return <ErrorNotice error={lines.error} />;
  if (!lines.data?.lines.length) {
    return <DataNotice variant="unavailable" title="No tariff line found">No {destName} tariff line matches HS {formatHs(digits)}. Check the code and try again.</DataNotice>;
  }

  const r = rates.data;
  return (
    <div className="space-y-4">
      {lines.data.lines.length > 1 && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{destName} tariff line</p>
          <Select value={line} onValueChange={setLine}>
            <SelectTrigger className="h-auto min-h-10 text-left"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              {lines.data.lines.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  <span className="font-mono">{l.code}</span> — {cleanApiText(l.description).slice(0, 90)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {rates.isLoading && <Loading text="Checking customs duty rates…" />}
      {rates.isError && <ErrorNotice error={rates.error} />}

      {r && (
        <>
          <div className="flex items-start gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-accent shrink-0" />
            <p>
              <span className="font-mono font-semibold">{r.hscode}</span>
              {r.description && <span className="text-muted-foreground"> — {cleanApiText(r.description)}</span>}
            </p>
          </div>

          {!r.customs ? (
            <DataNotice variant="unavailable">Data unavailable — verification required. No customs duty line was returned for this tariff line.</DataNotice>
          ) : r.ftaLookup === 'unavailable' ? (
            <>
              <Comparison normal={r.customs.rate} normalName={r.customs.name} preferential={[]} />
              <p className="text-sm font-semibold text-warning">FTA customs duty: data unavailable — verification required</p>
            </>
          ) : r.preferential.length ? (
            <Comparison normal={r.customs.rate} normalName={r.customs.name} preferential={r.preferential} />
          ) : (
            <>
              <Comparison normal={r.customs.rate} normalName={r.customs.name} preferential={[]} />
              <DataNotice variant="advisory">No preferential customs duty is listed for goods of Indian origin on this tariff line ("No preference"), so the normal rate applies.</DataNotice>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Source: {r.source ?? 'intGrow tariff database'} · Checked {new Date(r.checkedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Customs duty only — other duties and taxes are not included</span>
            <div className="flex flex-wrap items-center gap-2">
              <UpdatedAsOn />
              <Button variant="ghost" size="sm" onClick={() => rates.refetch()} disabled={rates.isFetching}>
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${rates.isFetching ? 'animate-spin' : ''}`} />Re-check
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />{text}
    </p>
  );
}
