import { supabase } from '@/integrations/supabase/client';
import type { DestinationCountry, PreferentialRate, RateCheckResult, TariffLine } from '@/services/rateCheck';

/**
 * Tariff schedules supplied to the portal as files (table fta_tariff_lines).
 * For these destinations the Benefit Finder reads normal (MFN) and agreement
 * customs duty from the supplied schedule instead of the live service.
 */
export const SUPPLIED_COUNTRIES: DestinationCountry[] = [
  { code: 'AR', iso3: 'arg', name: 'Argentina' },
  { code: 'AU', iso3: 'aus', name: 'Australia' },
  { code: 'BT', iso3: 'btn', name: 'Bhutan' },
  { code: 'BR', iso3: 'bra', name: 'Brazil' },
  { code: 'BN', iso3: 'brn', name: 'Brunei' },
  { code: 'KH', iso3: 'khm', name: 'Cambodia' },
  { code: 'CL', iso3: 'chl', name: 'Chile' },
  { code: 'ID', iso3: 'idn', name: 'Indonesia' },
  { code: 'JP', iso3: 'jpn', name: 'Japan' },
  { code: 'KR', iso3: 'kor', name: 'Korea (Republic of)' },
  { code: 'MY', iso3: 'mys', name: 'Malaysia' },
  { code: 'MV', iso3: 'mdv', name: 'Maldives' },
  { code: 'MM', iso3: 'mmr', name: 'Myanmar' },
  { code: 'NZ', iso3: 'nzl', name: 'New Zealand' },
  { code: 'NO', iso3: 'nor', name: 'Norway' },
  { code: 'OM', iso3: 'omn', name: 'Oman' },
  { code: 'PY', iso3: 'pry', name: 'Paraguay' },
  { code: 'PH', iso3: 'phl', name: 'Philippines' },
  { code: 'CH', iso3: 'che', name: 'Switzerland' },
  { code: 'TH', iso3: 'tha', name: 'Thailand' },
  { code: 'GB', iso3: 'gbr', name: 'United Kingdom' },
  { code: 'US', iso3: 'usa', name: 'United States' },
  { code: 'UY', iso3: 'ury', name: 'Uruguay' },
];

/** Supplied destinations with no India trade agreement: only MFN plus any additional duties are shown. */
export const NO_AGREEMENT_DESTINATIONS = new Set(['US']);

export const hasSuppliedSchedule = (dest: string) => SUPPLIED_COUNTRIES.some((c) => c.code === dest.toUpperCase());

/** Plain numbers in the files are ad valorem percentages; anything else is shown exactly as supplied. */
export const displayRate = (raw: string | null) => (raw === null ? null : /^\d+(\.\d+)?$/.test(raw) ? `${raw}%` : raw);

export async function suppliedLines(hs: string, dest: string): Promise<{ imp: string; lines: TariffLine[] }> {
  const { data, error } = await supabase
    .from('fta_tariff_lines')
    .select('tariff_line, description')
    .eq('country_code', dest.toUpperCase())
    .eq('six_digit', hs.slice(0, 6))
    .order('tariff_line')
    .limit(400);
  if (error) throw error;
  // A line appears once per agreement (e.g. Maldives: SAFTA and SAPTA); list each line once.
  const seen = new Set<string>();
  const all = (data ?? []).filter((r) => !seen.has(r.tariff_line) && seen.add(r.tariff_line)).map((r) => ({ code: r.tariff_line, description: r.description ?? '' }));
  const narrowed = all.filter((l) => l.code.startsWith(hs));
  return { imp: dest.toUpperCase(), lines: narrowed.length ? narrowed : all };
}

export async function suppliedRates(line: string, dest: string): Promise<RateCheckResult> {
  const { data, error } = await supabase
    .from('fta_tariff_lines')
    .select('*')
    .eq('country_code', dest.toUpperCase())
    .eq('tariff_line', line)
    .order('agreement_type')
    .limit(10);
  if (error) throw error;
  const first = data?.[0];
  if (!first) throw new Error('Tariff line not found');
  const date = first.source_date ? ` (dated ${new Date(first.source_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })})` : '';
  const names = [...new Set(data.map((r) => r.agreement_name))].join(' and ');
  return {
    imp: first.country_code,
    hscode: first.tariff_line,
    description: first.description ?? '',
    customs: { name: 'Customs duty (MFN)', short: 'MFN', rate: displayRate(first.mfn_rate), notification: null },
    preferential: data.filter((r) => r.fta_rate !== null && r.agreement_type !== 'ADDITIONAL').map((r) => ({
      agreement: r.agreement_name,
      name: r.agreement_name,
      short: r.agreement_code,
      rate: displayRate(r.fta_rate),
      notification: null,
      footnote: r.footnote,
      rulesOfOrigin: r.rules_of_origin,
      agreementType: r.agreement_type as 'FTA' | 'PTA' | 'GSP' | 'TREATY',
    })),
    ftaLookup: 'ok',
    checkedAt: new Date().toISOString(),
    source: `${names} tariff schedule${data.length > 1 ? 's' : ''} supplied to the portal${date}`,
  };
}

export interface ScheduleLine {
  code: string;
  description: string;
  mfn: string | null;
  preferential: PreferentialRate[];
  /** Extra duties charged on top of MFN where India has no FTA (e.g. US Section 301 / 232). Never a preference. */
  additional: { short: string; name: string; rate: string; footnote: string | null }[];
}

export interface ScheduleResult {
  lines: ScheduleLine[];
  source: string;
  checkedAt: string;
}

/** Every tariff line under an HS code (4–10 digits) with its MFN rate and all agreement rates, in one read. */
export async function suppliedSchedule(hs: string, dest: string): Promise<ScheduleResult> {
  const digits = hs.replace(/\D/g, '');
  let q = supabase
    .from('fta_tariff_lines')
    .select('tariff_line, description, mfn_rate, fta_rate, rules_of_origin, agreement_code, agreement_name, agreement_type, source_date, footnote')
    .eq('country_code', dest.toUpperCase());
  q = digits.length >= 6 ? q.eq('six_digit', digits.slice(0, 6)) : q.like('six_digit', `${digits}%`);
  const { data, error } = await q.order('tariff_line').order('agreement_type').limit(1000);
  if (error) throw error;
  const byLine = new Map<string, ScheduleLine>();
  for (const r of data ?? []) {
    let l = byLine.get(r.tariff_line);
    if (!l) {
      l = { code: r.tariff_line, description: r.description ?? '', mfn: displayRate(r.mfn_rate), preferential: [], additional: [] };
      byLine.set(r.tariff_line, l);
    }
    if (r.agreement_type === 'ADDITIONAL') {
      if (r.fta_rate !== null) l.additional.push({ short: r.agreement_code, name: r.agreement_name, rate: displayRate(r.fta_rate)!, footnote: r.footnote });
    } else if (r.fta_rate !== null) {
      l.preferential.push({
        agreement: r.agreement_name,
        name: r.agreement_name,
        short: r.agreement_code,
        rate: displayRate(r.fta_rate),
        notification: null,
        footnote: r.footnote,
        rulesOfOrigin: r.rules_of_origin,
        agreementType: r.agreement_type as 'FTA' | 'PTA' | 'GSP' | 'TREATY',
      });
    }
  }
  let lines = [...byLine.values()];
  // A longer HS code narrows to the matching national lines when any exist.
  if (digits.length > 6) {
    const narrowed = lines.filter((l) => l.code.startsWith(digits));
    if (narrowed.length) lines = narrowed;
  }
  const first = data?.[0];
  const names = [...new Set((data ?? []).map((r) => r.agreement_name))].join(' and ');
  const date = first?.source_date ? ` (dated ${new Date(first.source_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })})` : '';
  return { lines, source: `${names} tariff schedule${names.includes(' and ') ? 's' : ''} supplied to the portal${date}`, checkedAt: new Date().toISOString() };
}

export interface TariffLineHit { code: string; description: string }

/**
 * Search a destination's supplied tariff file by HS code (prefix) or by words in
 * the line description. Every HS code the public tools offer comes from here.
 */
async function querySuppliedLines(q: string, dest: string): Promise<TariffLineHit[]> {
  let req = supabase.from('fta_tariff_lines').select('tariff_line, description').eq('country_code', dest.toUpperCase());
  if (/^\d[\d.\s-]*$/.test(q)) {
    const digits = q.replace(/\D/g, '');
    if (digits.length < 2) return [];
    req = req.like('tariff_line', `${digits}%`);
  } else {
    const words = q.replace(/[%_,()*\\]/g, ' ').split(/\s+/).filter((w) => w.length >= 2);
    if (!words.length) return [];
    for (const w of words) req = req.ilike('description', `%${w}%`);
  }
  const numeric = /^\d/.test(q);
  // Code searches list every line under the typed digits; word searches stay short.
  const { data, error } = await req.order('tariff_line').limit(numeric ? 1000 : 300);
  if (error) throw error;
  const seen = new Set<string>();
  const hits = (data ?? [])
    .filter((r) => !seen.has(r.tariff_line) && seen.add(r.tariff_line))
    .map((r) => ({ code: r.tariff_line, description: r.description ?? '' }));
  // Word searches: lines whose own (last) description part matches come before lines that only match the heading.
  if (!/^\d/.test(q)) {
    const words = q.toLowerCase().split(/\s+/).filter((w) => w.length >= 2);
    const own = (h: TariffLineHit) => { const parts = h.description.toLowerCase().split(/:\s+/); return words.every((w) => parts.slice(1).join(' ').includes(w)) ? 0 : 1; };
    hits.sort((a, b) => own(a) - own(b));
  }
  return numeric ? hits : hits.slice(0, 40);
}

export async function searchSuppliedLines(query: string, dest: string): Promise<TariffLineHit[]> {
  const q = query.trim();
  const hits = await querySuppliedLines(q, dest);
  if (hits.length || /^\d/.test(q)) return hits;
  // Several words with no line containing all of them: try the most specific single words.
  const words = [...new Set(q.split(/\s+/).filter((w) => w.length >= 3))].sort((a, b) => b.length - a.length);
  if (words.length < 2) return hits;
  for (const w of words.slice(0, 3)) {
    const one = await querySuppliedLines(w, dest);
    if (one.length) return one;
  }
  return [];
}

export interface OriginRuleRow {
  code: string;
  name: string;
  type: 'FTA' | 'PTA' | 'GSP' | 'TREATY';
  rate: string | null;
  rule: string | null;
  footnote: string | null;
}

export interface LineOriginRules {
  line: string;
  description: string;
  mfn: string | null;
  agreements: OriginRuleRow[];
  source: string;
}

/** Rules of origin (and agreement rates) for one tariff line, exactly as given in the supplied file. */
export async function suppliedOriginRules(line: string, dest: string): Promise<LineOriginRules> {
  const { data, error } = await supabase
    .from('fta_tariff_lines')
    .select('tariff_line, description, mfn_rate, fta_rate, rules_of_origin, footnote, agreement_code, agreement_name, agreement_type, source_date')
    .eq('country_code', dest.toUpperCase())
    .eq('tariff_line', line)
    .neq('agreement_type', 'ADDITIONAL')
    .order('agreement_type')
    .limit(10);
  if (error) throw error;
  const first = data?.[0];
  if (!first) throw new Error('Tariff line not found');
  const date = first.source_date ? ` (dated ${new Date(first.source_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })})` : '';
  return {
    line: first.tariff_line,
    description: first.description ?? '',
    mfn: displayRate(first.mfn_rate),
    agreements: data.map((r) => ({
      code: r.agreement_code,
      name: r.agreement_name,
      type: r.agreement_type as OriginRuleRow['type'],
      rate: displayRate(r.fta_rate),
      rule: r.rules_of_origin?.trim() || null,
      footnote: r.footnote,
    })),
    source: `${[...new Set(data.map((r) => r.agreement_name))].join(' and ')} tariff file supplied to the portal${date}`,
  };
}

/** Supplied-file agreement code → the portal's agreement record (for certificate, cumulation and the agreement page). */
const LOCAL_AGREEMENT: Record<string, string> = {
  AIFTA: 'asean-india-tig', TEPA: 'india-efta-tepa', SAFTA: 'safta', MPTA: 'india-mercosur-pta', CETA: 'india-uk-ceta',
  ECTA: 'india-australia-ecta', INZFTA: 'india-nz-fta', INBT: 'india-bhutan-agreement',
  'MY:CECA': 'india-malaysia-ceca', 'CL:PTA': 'india-chile-pta', 'OM:CEPA': 'india-oman-cepa', 'JP:CEPA': 'india-japan-cepa',
  'KR:CEPA': 'india-korea-cepa', APTA: 'apta',
};
export const localAgreementId = (country: string, code: string): string | null =>
  LOCAL_AGREEMENT[`${country.toUpperCase()}:${code}`] ?? LOCAL_AGREEMENT[code] ?? null;
