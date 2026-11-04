/**
 * Customs-duty comparison for the FTA Benefit Finder.
 * Rates are always DISPLAYED as the raw intGrow string. A number is read only
 * when the whole string is a plain percentage (e.g. "5", "12.5%", "Free"), and
 * only to decide the comparison colour / percentage-point gap. Anything more
 * complex (specific or compound rates) is reported as "unknown".
 */
export type BenefitKind = 'lower' | 'same' | 'higher' | 'unknown';

const SIMPLE = /^\s*(\d+(?:\.\d+)?)\s*%?\s*$/;

export function simplePercent(rate: string | null | undefined): number | null {
  if (!rate) return null;
  const s = rate.replace(/\?/g, '').trim();
  if (/^(free|nil|exempt)$/i.test(s)) return 0;
  const m = s.match(SIMPLE);
  return m ? Number(m[1]) : null;
}

export function compareCustoms(normal: string | null | undefined, fta: string | null | undefined) {
  const a = simplePercent(normal);
  const b = simplePercent(fta);
  if (a === null || b === null) return { kind: 'unknown' as BenefitKind, points: null, normal: a, fta: b };
  const points = Math.round((a - b) * 100) / 100;
  const kind: BenefitKind = points > 0 ? 'lower' : points < 0 ? 'higher' : 'same';
  return { kind, points: Math.abs(points), normal: a, fta: b };
}

/** Whole numbers as integers, fractions to 2 decimals. */
export const fmtPoints = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

export interface LineRates {
  mfn: string | null;
  preferential: { short: string; rate: string | null }[];
}

/** Headline figures across tariff lines: lines with a lower agreement rate, duty-free lines, and the biggest gap. */
export function summariseSavings(lines: LineRates[]) {
  let withSaving = 0;
  let dutyFree = 0;
  let maxPoints = 0;
  let bestAgreement: string | null = null;
  for (const l of lines) {
    let saved = false;
    let free = false;
    for (const p of l.preferential) {
      const c = compareCustoms(l.mfn, p.rate);
      if (c.kind !== 'lower') continue;
      saved = true;
      if (c.fta === 0) free = true;
      if ((c.points ?? 0) > maxPoints) { maxPoints = c.points ?? 0; bestAgreement = p.short; }
    }
    if (saved) withSaving++;
    if (free) dutyFree++;
  }
  return { total: lines.length, withSaving, dutyFree, maxPoints, bestAgreement };
}
