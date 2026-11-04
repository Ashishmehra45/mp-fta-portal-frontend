import type { Agreement } from '@/data/agreements';

export type EligibilityCode = 'A' | 'B' | 'C';

export interface EligibilityResult {
  code: EligibilityCode;
  label: string;
  reasons: string[];
}

export const eligibilityLabels: Record<EligibilityCode, string> = {
  A: 'Potentially eligible',
  B: 'Further information required',
  C: 'Not eligible or concession unavailable',
};

export interface OriginFacts {
  producedInIndia: 'yes' | 'no' | 'unknown';
  whollyObtained: 'yes' | 'no' | 'unknown';
  /** Share of non-originating (imported) inputs in the ex-works / FOB price, 0–100 */
  importedShare: number | null;
}

/**
 * Preliminary eligibility screen. Never treats an FTA's existence as proof of
 * qualification; a positive result is always "subject to verification".
 */
export function assessEligibility(agreement: Agreement | null, facts: OriginFacts): EligibilityResult {
  const r = (code: EligibilityCode, reasons: string[]): EligibilityResult => ({ code, label: eligibilityLabels[code], reasons });

  if (!agreement) {
    return r('C', ['No Indian trade agreement is in force with this destination. Standard (MFN) duty applies.']);
  }
  if (agreement.status !== 'in_force') {
    return r('C', [`${agreement.shortName} is not in force. Preferential rates cannot be claimed until implementation is officially notified.`]);
  }
  if (facts.producedInIndia === 'no') {
    return r('C', ['Goods not produced or substantially processed in India cannot claim Indian origin under this agreement.']);
  }
  if (facts.producedInIndia === 'unknown') {
    return r('B', ['Confirm where the goods are manufactured or obtained.']);
  }
  if (facts.whollyObtained === 'yes') {
    return r('A', [
      'Goods wholly obtained in India generally meet the origin criterion.',
      'Confirm that a tariff concession exists for your exact HS line and that direct consignment rules are met.',
    ]);
  }
  if (facts.importedShare === null || Number.isNaN(facts.importedShare)) {
    return r('B', ['Provide the value of imported (non-originating) inputs to test the value-content criterion.']);
  }
  const threshold = agreement.origin?.valueContentThreshold ?? null;
  if (threshold === null) {
    return r('B', [
      `${agreement.shortName} uses product-specific rules for many lines. Check the PSR schedule for your HS code.`,
      'Use the Rules of Origin Advisor to record inputs and processes.',
    ]);
  }
  const local = Math.max(0, 100 - facts.importedShare);
  if (local >= threshold) {
    return r('A', [
      `Estimated local value content ${local.toFixed(1)}% meets the general ${threshold}% threshold.`,
      agreement.origin?.tariffShift && agreement.origin.tariffShift !== 'PSR'
        ? `The general rule also requires a change in tariff classification (${agreement.origin.tariffShift}). Verify for each imported input.`
        : 'Verify any additional product-specific requirement.',
    ]);
  }
  return r('B', [
    `Estimated local value content ${local.toFixed(1)}% is below the general ${threshold}% threshold.`,
    'A product-specific rule or cumulation with partner-country inputs may still allow qualification — expert verification recommended.',
  ]);
}

/** Regional / local value content under the build-down method: (FOB − non-originating) / FOB × 100 */
export function valueContent(fobValue: number, nonOriginatingValue: number): number | null {
  if (!fobValue || fobValue <= 0) return null;
  return ((fobValue - nonOriginatingValue) / fobValue) * 100;
}

export type TariffShift = 'CC' | 'CTH' | 'CTSH';
/** HS digits that must change for each tariff-shift rule. */
export const shiftDigits: Record<TariffShift, number> = { CC: 2, CTH: 4, CTSH: 6 };

export interface ParsedOriginRule {
  /** The line only accepts goods wholly obtained / produced in India. */
  whollyObtained: boolean;
  shifts: TariffShift[];
  /** Minimum local / regional value content (RVC, QVC, VA) in %, when the rule states exactly one. */
  minValueContent: number | null;
  /** Maximum non-originating material share (VNM, Max NOM) in %, when the rule states exactly one. */
  maxNonOriginating: number | null;
  /** Criteria are alternatives ("CTH or 40% RVC") rather than all required ("CTSH + 35% RVC"). */
  alternatives: boolean;
  /** Every part of the rule was understood; otherwise the rule text must be read in full. */
  complete: boolean;
}

/**
 * Read the tests that can be checked automatically from a rule-of-origin text in a
 * supplied tariff file. Anything ambiguous (several percentages, "Standard QVC",
 * process rules) is left out so the advisor never invents a threshold.
 */
export function parseOriginRule(text: string | null | undefined): ParsedOriginRule | null {
  if (!text?.trim()) return null;
  const t = text.trim();
  const wholly = /^(WO\b|wholly obtained)/i.test(t) && !/\b(CC|CTH|CTSH|RVC|QVC|VA|VNM|NOM)\b/i.test(t);
  const shifts = (['CTSH', 'CTH', 'CC'] as const).filter((s) => new RegExp(`\\b${s}\\b`).test(t));
  const pcts = [...t.matchAll(/(\d+(?:\.\d+)?)\s*%|\((\d+(?:\.\d+)?)\)/g)].map((m) => Number(m[1] ?? m[2]));
  const single = new Set(pcts).size === 1 ? pcts[0] : null;
  const isMax = /\b(VNM|NOM|max)/i.test(t);
  const isMin = /\b(RVC|QVC|VA|value content)\b/i.test(t);
  return {
    whollyObtained: wholly,
    shifts,
    minValueContent: single !== null && isMin && !isMax ? single : null,
    maxNonOriginating: single !== null && isMax && !isMin ? single : null,
    alternatives: /\bor\b/i.test(t),
    complete: wholly || (
      (single !== null || !(isMin || isMax)) &&
      t.replace(/\b(CC|CTH|CTSH|RVC|QVC|VA|VNM|NOM|Max|EXW|FOB|and|or)\b|\d+(\.\d+)?|[%+()&,\s]/gi, '') === ''
    ),
  };
}
