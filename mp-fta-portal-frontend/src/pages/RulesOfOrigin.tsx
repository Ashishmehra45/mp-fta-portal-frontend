import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAgreement } from '@/data/agreements';
import { countries } from '@/data/countries';
import { valueContent, parseOriginRule, shiftDigits } from '@/lib/fta';
import { latestSigned } from '@/services/rateCheck';
import { SUPPLIED_COUNTRIES, NO_AGREEMENT_DESTINATIONS, suppliedOriginRules, localAgreementId, searchSuppliedLines } from '@/services/suppliedTariffs';
import { TariffLineSearch, leafDescription } from '@/components/portal/TariffLineSearch';
import { Plus, Trash2, CheckCircle2, AlertTriangle, CircleHelp, Loader2, FileText } from 'lucide-react';
import { cleanApiText, cn } from '@/lib/utils';
import { RooGlossary, RuleTerms } from '@/components/portal/RooGlossary';
import { UpdatedAsOn } from '@/components/portal/UpdatedAsOn';

interface InputRow { id: number; description: string; hs: string; country: string; value: string }

const evidence = [
  'Bill of materials with HS codes of all inputs',
  'Supplier invoices for imported inputs',
  'Supplier declarations for domestic inputs',
  'Cost sheet / ex-works price build-up',
  'Production process description or flow chart',
  'Shipping documents showing direct consignment',
];

const processes = ['Cutting / shaping', 'Assembly', 'Chemical reaction', 'Blending / mixing only', 'Packing / labelling only', 'Spinning / weaving / knitting', 'Heat treatment', 'Machining'];
const minimal = ['Blending / mixing only', 'Packing / labelling only'];
const typeLabel = { FTA: 'Free Trade Agreement', PTA: 'Preferential Trade Agreement', GSP: 'GSP preference scheme', TREATY: 'Trade treaty' } as const;
const GENERIC_CERT = 'Preferential Certificate of Origin via the DGFT e-CoO platform (trade.gov.in / coo.dgft.gov.in)';

/** Importing countries = supplied tariff files that carry agreement rules of origin. */
const importers = SUPPLIED_COUNTRIES.filter((c) => !NO_AGREEMENT_DESTINATIONS.has(c.code))
  .sort((a, b) => latestSigned(b.code).localeCompare(latestSigned(a.code)) || a.name.localeCompare(b.name));

let rowId = 1;

type Status = 'met' | 'not' | 'unknown';
interface Check { label: string; status: Status; note: string }

const RulesOfOrigin = () => {
  const [params] = useSearchParams();
  const [country, setCountry] = useState(() => {
    const d = params.get('dest')?.toUpperCase();
    if (d && importers.some((c) => c.code === d)) return d;
    const fromAgreement = getAgreement(params.get('agreement') ?? '')?.partnerCodes.find((p) => importers.some((c) => c.code === p));
    return fromAgreement ?? importers[0].code;
  });
  const countryName = importers.find((c) => c.code === country)?.name ?? country;
  const initialHs = (params.get('hs') ?? '').replace(/\D/g, '');
  const [search, setSearch] = useState(initialHs);
  const [line, setLine] = useState('');
  const [agCode, setAgCode] = useState('');
  const [wholly, setWholly] = useState<'yes' | 'no'>('no');
  const [fob, setFob] = useState('');
  const [localCost, setLocalCost] = useState('');
  const [rows, setRows] = useState<InputRow[]>([{ id: rowId++, description: '', hs: '', country: 'CN', value: '' }]);
  const [procs, setProcs] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [shown, setShown] = useState(false);
  const [showInputs, setShowInputs] = useState(false);

  // A linked HS code with a single matching line in the file is selected straight away.
  useEffect(() => {
    if (initialHs.length < 4) return;
    searchSuppliedLines(initialHs, country).then((hits) => {
      if (hits.length === 1) { setLine(hits[0].code); setSearch(leafDescription(hits[0].description)); }
      else if (hits.length > 1) setTimeout(() => document.getElementById('roo-hs')?.focus(), 50);
    }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeCountry = (c: string) => { setCountry(c); setLine(''); setAgCode(''); setSearch(''); };

  const rules = useQuery({
    queryKey: ['origin-rules', country, line],
    queryFn: () => suppliedOriginRules(line, country),
    enabled: !!line,
    staleTime: 10 * 60_000,
    retry: 1,
  });
  const options = rules.data?.agreements ?? [];

  useEffect(() => {
    if (!options.length || options.some((o) => o.code === agCode)) return;
    const best = options.find((o) => o.rule && o.type === 'FTA') ?? options.find((o) => o.rule) ?? options[0];
    setAgCode(best.code);
  }, [options, agCode]);

  const row = options.find((o) => o.code === agCode) ?? null;
  const local = row ? getAgreement(localAgreementId(country, row.code) ?? '') ?? null : null;
  const parsed = parseOriginRule(row?.rule);
  /** Spell out the WO abbreviation from the tariff files. */
  const showRule = (r: string) => r.replace(/\bWO\b/g, 'Wholly Obtained');
  const partnerCodes = local?.partnerCodes ?? [country];
  const cumulation = local?.origin?.cumulation ?? false;
  const productDigits = line.replace(/\D/g, '');

  const calc = useMemo(() => {
    const fobN = Number(fob) || 0;
    let nonOrig = 0;
    let cumulated = 0;
    const nonOrigInputs: InputRow[] = [];
    rows.forEach((r) => {
      const v = Number(r.value) || 0;
      if (r.country === 'IN') return;
      if (partnerCodes.includes(r.country) && cumulation) { cumulated += v; return; }
      nonOrig += v;
      if (v > 0 || r.hs || r.description) nonOrigInputs.push(r);
    });
    return { fobN, nonOrig, cumulated, vc: valueContent(fobN, nonOrig), nonOrigInputs };
  }, [fob, rows, partnerCodes, cumulation]);

  const missingEvidence = evidence.filter((e) => !docs.includes(e));
  const onlyMinimal = procs.length > 0 && procs.every((p) => minimal.includes(p));

  // Tests read from the rule in the tariff file.
  const checks: Check[] = [];
  if (parsed && !parsed.whollyObtained) {
    for (const s of parsed.shifts) {
      const n = shiftDigits[s];
      const withHs = calc.nonOrigInputs.filter((r) => r.hs.length >= n);
      const clash = withHs.filter((r) => r.hs.slice(0, n) === productDigits.slice(0, n));
      if (clash.length) checks.push({ label: s, status: 'not', note: `${s} not met for: ${clash.map((r) => r.description || `input HS ${r.hs}`).join(', ')} (same ${n}-digit HS as the product).` });
      else if (!calc.nonOrigInputs.length || withHs.length < calc.nonOrigInputs.length) checks.push({ label: s, status: 'unknown', note: `Enter at least ${n}-digit HS codes for every imported input to test ${s}.` });
      else checks.push({ label: s, status: 'met', note: `${s}: every imported input changes HS at the ${n}-digit level.` });
    }
    if (parsed.minValueContent !== null) {
      const t = parsed.minValueContent;
      checks.push(calc.vc === null
        ? { label: `${t}% value content`, status: 'unknown', note: `Enter the FOB / ex-works price and input values to test the ${t}% value-content rule.` }
        : { label: `${t}% value content`, status: calc.vc >= t ? 'met' : 'not', note: `Estimated value content ${calc.vc.toFixed(1)}% vs ${t}% required — ${calc.vc >= t ? 'meets' : 'does not meet'} the rule.` });
    }
    if (parsed.maxNonOriginating !== null) {
      const t = parsed.maxNonOriginating;
      const share = calc.fobN ? (calc.nonOrig / calc.fobN) * 100 : null;
      checks.push(share === null
        ? { label: `max ${t}% non-originating`, status: 'unknown', note: `Enter the FOB / ex-works price and input values to test the ${t}% non-originating limit.` }
        : { label: `max ${t}% non-originating`, status: share <= t ? 'met' : 'not', note: `Non-originating inputs ${share.toFixed(1)}% vs ${t}% allowed — ${share <= t ? 'within' : 'above'} the limit.` });
    }
  }

  let verdict: { tone: 'ok' | 'warn' | 'info'; title: string; points: string[] };
  if (!line) {
    verdict = { tone: 'info', title: 'Select your product', points: [`Choose the importing country and pick your product from the ${countryName} tariff file to see its rule of origin.`] };
  } else if (!row) {
    verdict = { tone: 'info', title: 'Loading the rule of origin…', points: ['Reading the tariff file.'] };
  } else if (!row.rule) {
    verdict = { tone: 'info', title: 'Check the agreement annex', points: [`See the rules of origin annex of ${row.name} for this product.`] };
  } else if (wholly === 'yes') {
    verdict = { tone: 'ok', title: 'Wholly obtained goods generally qualify', points: ['Goods wholly obtained or produced in India generally meet the origin rule. Keep evidence of where goods were grown, harvested or extracted.'] };
  } else if (parsed?.whollyObtained) {
    verdict = { tone: 'warn', title: 'This line needs wholly obtained goods', points: [`The rule for this line is "${row.rule}". Goods made with imported inputs do not qualify.`] };
  } else {
    const pts = checks.map((c) => c.note);
    const met = parsed!.alternatives ? checks.some((c) => c.status === 'met') : checks.length > 0 && checks.every((c) => c.status === 'met');
    const failed = parsed!.alternatives ? checks.length > 0 && checks.every((c) => c.status === 'not') : checks.some((c) => c.status === 'not');
    if (parsed!.alternatives && checks.length) pts.unshift('The rule offers alternatives — meeting any one is enough.');
    if (!parsed!.complete) pts.push(`Part of this rule cannot be tested automatically. Read the full rule: "${row.rule}".`);
    if (calc.cumulated > 0) pts.push(`Partner-country inputs worth ${calc.cumulated.toLocaleString('en-IN')} were treated as originating under cumulation — supplier origin proof is required.`);
    if (onlyMinimal) pts.push('Selected processes appear to be minimal operations, which usually do not confer origin.');
    if (!checks.length) {
      verdict = { tone: 'info', title: 'Check the rule for this line', points: pts.length ? pts : [`Read the rule: "${row.rule}".`] };
    } else if (met && !onlyMinimal && parsed!.complete) {
      verdict = { tone: 'ok', title: 'Preliminary assessment: origin rule may be met', points: pts };
    } else if (failed || onlyMinimal) {
      verdict = { tone: 'warn', title: 'Preliminary assessment: rule not clearly met', points: pts };
    } else {
      verdict = { tone: 'info', title: met ? 'Partly tested — read the full rule' : 'Further information required', points: pts };
    }
  }

  const toneCls = { ok: 'border-accent/40 bg-accent-soft', warn: 'border-warning/40 bg-warning-soft', info: 'border-primary/25 bg-primary-soft' }[verdict.tone];
  const ToneIcon = { ok: CheckCircle2, warn: AlertTriangle, info: CircleHelp }[verdict.tone];
  const statusCls: Record<Status, string> = { met: 'text-accent', not: 'text-destructive', unknown: 'text-muted-foreground' };

  const update = (id: number, patch: Partial<InputRow>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <PortalLayout>
      <PageHeader eyebrow="Free Trade Agreements · Origin" title="Rules of Origin Advisor" description="Choose the importing country, pick your product from its tariff file and see the rule of origin it must meet under each Free Trade Agreement (FTA) — then test your inputs and costs against it." />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">1. Importing country and product</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Importing country</Label>
                <Select value={country} onValueChange={changeCountry}>
                  <SelectTrigger aria-label="Importing country"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-72">{importers.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roo-hs">Finished product or HS code</Label>
                <TariffLineSearch
                  id="roo-hs"
                  dest={country}
                  destName={countryName}
                  query={search}
                  onQueryChange={(q) => { setSearch(q); }}
                  onPick={(h) => { setLine(h.code); setSearch(leafDescription(h.description)); }}
                  placeholder="e.g. Garlic or 0703"
                />
              </div>
              {line && (
                <div className="sm:col-span-2 rounded-md border bg-muted/40 p-3 text-sm">
                  <span className="font-mono font-semibold">{line}</span>
                  {rules.data && <span className="text-muted-foreground"> — {cleanApiText(rules.data.description)}</span>}
                </div>
              )}
              {options.length > 0 && (
                <div className="sm:col-span-2 space-y-2">
                  <Label>Trade agreement (from the {countryName} tariff file)</Label>
                  <Select value={agCode} onValueChange={setAgCode}>
                    <SelectTrigger aria-label="Trade agreement"><SelectValue /></SelectTrigger>
                    <SelectContent>{options.map((o) => <SelectItem key={o.code} value={o.code}>{o.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div className="sm:col-span-2 space-y-2">
                <Label>Is the product wholly obtained in India?</Label>
                <div className="flex flex-wrap gap-2">
                  {(['yes', 'no'] as const).map((v) => (
                    <Button key={v} type="button" variant={wholly === v ? 'default' : 'outline'} size="sm" className="h-auto min-h-9 whitespace-normal py-2 text-left" onClick={() => setWholly(v)}>{v === 'yes' ? 'Yes — grown, mined or harvested' : 'No — uses inputs / processing'}</Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {wholly === 'no' && line && (
            <Button type="button" variant="outline" className="w-full" onClick={() => setShowInputs((v) => !v)}>
              {showInputs ? 'Hide costs and inputs' : 'Add costs and inputs (optional) to test the rule'}
            </Button>
          )}

          {wholly === 'no' && showInputs && (
            <>
              <Card>
                <CardHeader><CardTitle className="text-lg">2. Costs and inputs</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="fob">FOB / ex-works price of finished product</Label><Input id="fob" type="number" min={0} value={fob} onChange={(e) => setFob(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="lc">Local production costs (labour, overheads, profit)</Label><Input id="lc" type="number" min={0} value={localCost} onChange={(e) => setLocalCost(e.target.value)} /></div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs text-muted-foreground"><tr><th className="py-2 pr-2">Input</th><th className="py-2 pr-2">HS</th><th className="py-2 pr-2">Origin country</th><th className="py-2 pr-2">Value</th><th /></tr></thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.id}>
                            <td className="py-1 pr-2"><Input aria-label="Input description" value={r.description} onChange={(e) => update(r.id, { description: e.target.value })} placeholder="e.g. Steel sheet" /></td>
                            <td className="py-1 pr-2 w-28"><Input aria-label="Input HS code" className="font-mono" value={r.hs} onChange={(e) => update(r.id, { hs: e.target.value.replace(/\D/g, '').slice(0, 8) })} /></td>
                            <td className="py-1 pr-2 w-44">
                              <Select value={r.country} onValueChange={(v) => update(r.id, { country: v })}>
                                <SelectTrigger aria-label="Input origin"><SelectValue /></SelectTrigger>
                                <SelectContent className="max-h-64"><SelectItem value="IN">India (domestic)</SelectItem>{countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                              </Select>
                            </td>
                            <td className="py-1 pr-2 w-28"><Input aria-label="Input value" type="number" min={0} value={r.value} onChange={(e) => update(r.id, { value: e.target.value })} /></td>
                            <td className="py-1"><Button variant="ghost" size="icon" aria-label="Remove input" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} disabled={rows.length === 1}><Trash2 className="h-4 w-4" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setRows((rs) => [...rs, { id: rowId++, description: '', hs: '', country: 'CN', value: '' }])}><Plus className="mr-1 h-4 w-4" />Add input</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">3. Manufacturing processes</CardTitle></CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2">
                  {processes.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={procs.includes(p)} onCheckedChange={(c) => setProcs((s) => (c ? [...s, p] : s.filter((x) => x !== p)))} />{p}
                    </label>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          <Button type="button" size="lg" className="w-full" disabled={!line} onClick={() => setShown(true)}>Show result</Button>
          {!line && <p className="text-center text-xs text-muted-foreground">Pick your product first.</p>}
        </div>

        {!shown ? (
          <Card className="lg:col-span-5 h-fit border-dashed"><CardContent className="py-16 text-center text-muted-foreground">Choose the importing country and your product, then select <span className="font-medium text-foreground">Show result</span>.</CardContent></Card>
        ) : (
        <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 h-fit">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">Rule of origin for this product</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!line ? (
                <p className="text-muted-foreground">Pick your product from the {countryName} tariff file to see its rule of origin.</p>
              ) : rules.isLoading ? (
                <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Reading the tariff file…</p>
              ) : rules.isError ? (
                <p className="text-warning">The rule of origin could not be loaded. Please try again.</p>
              ) : row && (
                <>
                  <div className="rounded-md border border-primary/30 bg-primary-soft p-3">
                    <p className="text-xs text-muted-foreground">{row.name} · {typeLabel[row.type] ?? row.type}</p>
                    {row.rule && <p className="mt-1 text-base font-semibold">{showRule(row.rule)}</p>}
                    {row.footnote && <p className="mt-1 text-xs text-muted-foreground">{cleanApiText(row.footnote)}</p>}
                    <p className="mt-2 text-xs">Normal (MFN) rate <span className="font-mono">{rules.data?.mfn ?? '—'}</span> · Agreement rate <span className="font-mono">{!row.rate || /no preference/i.test(row.rate) ? 'No tariff concession' : row.rate}</span></p>
                    <UpdatedAsOn className="mt-2" />
                  </div>
                  <RuleTerms rule={row.rule} />
                  {checks.length > 0 && wholly === 'no' && (
                    <ul className="grid grid-cols-2 gap-2">
                      {checks.map((c) => (
                        <li key={c.label} className="rounded border p-2">
                          <span className="block text-xs text-muted-foreground">{c.label}</span>
                          <span className={cn('font-medium', statusCls[c.status])}>{c.status === 'met' ? 'Met' : c.status === 'not' ? 'Not met' : 'Needs data'}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {options.length > 1 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Other agreements for this line</p>
                      <ul className="space-y-1">
                        {options.filter((o) => o.code !== row.code).map((o) => (
                          <li key={o.code} className="flex justify-between gap-3 rounded border px-2 py-1.5 text-xs">
                            <span>{o.name}</span>{o.rule && <span className="shrink-0 font-medium">{showRule(o.rule)}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Certificate: {local?.origin?.certificate ?? GENERIC_CERT}</p>
                  <p className="flex items-start gap-1 text-xs text-muted-foreground"><FileText className="mt-0.5 h-3 w-3 shrink-0" />Source: {rules.data?.source}</p>
                </>
              )}
            </CardContent>
          </Card>

          <div className={cn('rounded-lg border p-5', toneCls)}>
            <div className="flex items-start gap-3">
              <ToneIcon className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{verdict.title}</p>
                <ul className="mt-2 list-disc pl-4 text-sm space-y-1">{verdict.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
            {wholly === 'no' && calc.fobN > 0 && (
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><dt className="text-muted-foreground">FOB value</dt><dd className="font-mono">{calc.fobN.toLocaleString('en-IN')}</dd></div>
                <div><dt className="text-muted-foreground">Non-originating</dt><dd className="font-mono">{calc.nonOrig.toLocaleString('en-IN')}</dd></div>
                <div><dt className="text-muted-foreground">Value content</dt><dd className="font-mono">{calc.vc?.toFixed(1)}%</dd></div>
              </dl>
            )}
          </div>

          <DataNotice variant="advisory">
            This is a preliminary, non-binding assessment. The portal does not issue certificates of origin or legally binding origin determinations. <Link to="/knowledge-support#assist" className="text-primary underline">Request expert help</Link>.
          </DataNotice>
        </aside>
        )}
      </div>
      <div className="container pb-10"><RooGlossary /></div>
    </PortalLayout>
  );
};

export default RulesOfOrigin;
