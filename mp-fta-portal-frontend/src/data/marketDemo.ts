import { inForceForCountry } from './agreements';
import type { SectorId } from './products';

/**
 * DEMONSTRATION factor scores (0–100) for the Market Opportunity Engine.
 * Generated deterministically for illustration only — not trade statistics.
 * Only the "FTA preference" flag is derived from the agreement directory.
 */
export const demoMarkets = ['AE', 'AU', 'JP', 'KR', 'SG', 'MY', 'VN', 'GB', 'CH', 'MU', 'US', 'DE', 'SA', 'BD'] as const;

export type Factor = 'demand' | 'tariff' | 'competition' | 'compliance' | 'logistics';

export const factorLabels: Record<Factor, { label: string; help: string }> = {
  demand: { label: 'Import demand', help: 'Size and recent growth of the market’s imports of this product' },
  tariff: { label: 'Tariff advantage', help: 'Preference margin available to Indian exporters under an FTA' },
  competition: { label: 'Competitive openness', help: 'Higher = less concentrated supplier base' },
  compliance: { label: 'Compliance ease', help: 'Higher = fewer or simpler regulatory barriers' },
  logistics: { label: 'Logistics & entry', help: 'Transit time, connectivity and market-entry ease' },
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

export function demoScores(sector: SectorId, market: string): Record<Factor, number> & { fta: boolean } {
  const fta = inForceForCountry(market).length > 0;
  const f = (k: string, base: number, span: number) => base + (hash(`${sector}-${market}-${k}`) % span);
  return {
    fta,
    demand: f('d', 35, 60),
    tariff: fta ? f('t', 60, 35) : f('t', 10, 30),
    competition: f('c', 25, 60),
    compliance: f('r', 30, 60),
    logistics: ['AE', 'SA', 'BD', 'SG', 'MU', 'MY'].includes(market) ? f('l', 65, 30) : f('l', 35, 45),
  };
}
