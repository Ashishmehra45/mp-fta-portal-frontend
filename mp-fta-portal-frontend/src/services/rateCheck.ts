import {
  calculateDuty,
  getCountries,
  saveDutyCalculation,
  searchHsCodes,
  type DutyCalculationRequest,
  type DutyItem,
} from '@/services/intgrowApi';
import { SUPPLIED_COUNTRIES, hasSuppliedSchedule, suppliedLines, suppliedRates } from '@/services/suppliedTariffs';
import { agreements } from '@/data/agreements';

/** Read-only customs-duty rate check for public tools. Rates are raw intGrow strings; no amounts, no other duties or taxes. */
export interface RateLine {
  name: string;
  short: string;
  rate: string | null;
  notification: string | null;
}

export interface PreferentialRate extends RateLine {
  agreement: string;
  footnote: string | null;
  rulesOfOrigin?: string | null;
  agreementType?: 'FTA' | 'PTA' | 'GSP' | 'TREATY';
}

export interface RateCheckResult {
  imp: string;
  hscode: string;
  description: string;
  /** Normal (MFN) customs duty line from the duty calculation. */
  customs: RateLine | null;
  /** Customs duty under each FTA from the duty-saving lookup. */
  preferential: PreferentialRate[];
  ftaLookup: 'ok' | 'unavailable';
  checkedAt: string;
  /** Where the rates came from (defaults to the live tariff database). */
  source?: string;
}

export interface TariffLine {
  code: string;
  description: string;
}

export type RateCheckErrorCode =
  | 'key_invalid'
  | 'key_missing'
  | 'needs_details'
  | 'country_unsupported'
  | 'upstream_error'
  | 'bad_request';

export class RateCheckError extends Error {
  constructor(public code: RateCheckErrorCode, message: string) {
    super(message);
  }
}

const userToken = () => localStorage.getItem('intgrow_auth_token') || localStorage.getItem('token') || '';
export const hasCalculatorSession = () => !!userToken();

// ── Signed-out visitors: server function with the portal key ────────────────
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fta-rate-check`;

async function post<T>(body: Record<string, string>): Promise<T> {
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new RateCheckError((data?.code as RateCheckErrorCode) || 'upstream_error', data?.error || 'Live tariff service unavailable');
  return data as T;
}

// ── Signed-in users: exactly the same intGrow calls and login as the calculator ─
const isKeyError = (e: unknown) => /api key/i.test(String((e as Error)?.message ?? ''));
const wrap = (e: unknown, fallback: RateCheckErrorCode = 'upstream_error') =>
  e instanceof RateCheckError ? e : new RateCheckError(isKeyError(e) ? 'key_invalid' : fallback, String((e as Error)?.message || 'Live tariff service unavailable'));

let iso3Map: Record<string, string> | null = null;
async function toIso3(dest: string) {
  if (dest.length === 3) return dest.toLowerCase();
  if (!iso3Map) {
    const list = await getCountries();
    iso3Map = Object.fromEntries((list ?? []).filter((c) => c.flag && c.value).map((c) => [c.flag.toUpperCase(), c.value.toLowerCase()]));
  }
  const iso3 = iso3Map[dest.toUpperCase()];
  if (!iso3) throw new RateCheckError('country_unsupported', 'Destination not covered');
  return iso3;
}

const rateOf = (raw: unknown) =>
  raw === null || raw === undefined || raw === '' ? null : typeof raw === 'number' ? `${raw}%` : String(raw);

const mapDuty = (d: DutyItem): RateLine => ({
  name: d?.duty_display_name || d?.duty_short_name || d?.duty_name || '',
  short: d?.duty_short_name || '',
  rate: rateOf(d?.local_display_rate || d?.display_duty_rate),
  notification: d?.master_notification_number || null,
});

/** The customs-duty line is the one an FTA replaces; other duties and taxes are ignored. */
export function pickCustomsLine(duties: DutyItem[], ftaLocal: DutyItem[] = []): DutyItem | null {
  if (!duties.length) return null;
  const byTax = duties.find((d) => /custom/i.test(String(d?.tax_type ?? '')));
  if (byTax) return byTax;
  const byName = duties.find((d) => /custom|tariff|mfn|general|import duty/i.test(`${d?.duty_name ?? ''} ${d?.duty_display_name ?? ''}`));
  if (byName) return byName;
  const kept = new Set(ftaLocal.map((d) => d?.duty_name));
  const replaced = kept.size ? duties.find((d) => !kept.has(d?.duty_name)) : undefined;
  return replaced ?? duties[0];
}

async function directLines(hs: string, dest: string) {
  try {
    const imp = await toIso3(dest);
    const list = await searchHsCodes(hs.slice(0, 6), imp);
    const all = (list ?? []).map((x) => ({ code: String(x.hs_code), description: String(x.product ?? '') }));
    const narrowed = all.filter((l) => l.code.startsWith(hs));
    return { imp, lines: (narrowed.length ? narrowed : all).slice(0, 50) };
  } catch (e) {
    throw wrap(e);
  }
}

async function directRates(hscode: string, dest: string): Promise<RateCheckResult> {
  let imp: string;
  try { imp = await toIso3(dest); } catch (e) { throw wrap(e); }
  // Nominal value only so intGrow can resolve the line; amounts are discarded.
  const request: DutyCalculationRequest = {
    hscode, imp, exp: 'ind', org: 'ind', currency: 'usd', value_of_product: 1000,
    mode: 'sea', incoterm: 'CIF', international_freight: 0, insurance_charges: 0, user_inputs: [],
  };
  const [calc, fta] = await Promise.allSettled([calculateDuty({ ...request }), saveDutyCalculation({ ...request })]);
  if (calc.status === 'rejected') throw wrap(calc.reason, 'needs_details');
  const c = calc.value;
  if (!c?.duty_calculations) throw new RateCheckError('needs_details', c?.error || 'Extra product details required');
  const ftaList = fta.status === 'fulfilled' && Array.isArray(fta.value?.fta) ? fta.value.fta : [];
  const customs = pickCustomsLine(c.duty_calculations.local_duties?.duties ?? [], ftaList[0]?.local_duties?.duties ?? []);
  return {
    imp,
    hscode,
    description: c.shipment_summary?.hsn_description ?? '',
    customs: customs ? mapDuty(customs) : null,
    preferential: ftaList.map((f) => ({
      agreement: f?.fta_duty_name || '',
      name: f?.fta_duty_display_name || f?.fta_duty_short_name || '',
      short: f?.fta_duty_short_name || '',
      rate: rateOf(f?.fta_display_duty_rate),
      notification: f?.master_notification_number || null,
      footnote: f?.master_footnote || null,
    })),
    ftaLookup: fta.status === 'fulfilled' ? 'ok' : 'unavailable',
    checkedAt: new Date().toISOString(),
  };
}

export const findTariffLines = (hs: string, dest: string) =>
  hasSuppliedSchedule(dest) ? suppliedLines(hs, dest)
    : hasCalculatorSession() ? directLines(hs, dest) : post<{ imp: string; lines: TariffLine[] }>({ action: 'lines', hs, dest });

export const verifyRates = (hscode: string, dest: string) =>
  hasSuppliedSchedule(dest) ? suppliedRates(hscode, dest)
    : hasCalculatorSession() ? directRates(hscode, dest) : post<RateCheckResult>({ action: 'rates', hscode, dest });

// ── Destination markets: supplied tariff schedules only ───
export interface DestinationCountry {
  /** ISO 3166-1 alpha-2, upper case (matches portal agreement data). */
  code: string;
  iso3: string;
  name: string;
}

/** Latest signing date of any signed / in-force India agreement covering the country ('' if none). */
export const latestSigned = (iso2: string) =>
  agreements
    .filter((a) => a.status !== 'negotiation' && a.signed && a.partnerCodes.includes(iso2))
    .reduce((max, a) => (a.signed! > max ? a.signed! : max), '');

/** Destination markets = only countries with a supplied tariff file, most recently signed agreement first. */
export const getDestinationCountries = async (): Promise<DestinationCountry[]> =>
  [...SUPPLIED_COUNTRIES].sort((a, b) => latestSigned(b.code).localeCompare(latestSigned(a.code)) || a.name.localeCompare(b.name));
