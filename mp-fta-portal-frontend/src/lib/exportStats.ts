import { indiaTotalUsdMn2526, mpMonthly, mpProducts, stateExports, type MpProductExport } from '@/data/mpExports';

const MP = 'Madhya Pradesh';

const two = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const whole = (n: number) => (Number.isInteger(n) ? n.toLocaleString('en-IN') : two(n));

export const fmtUsdMn = (n: number) => `US$ ${whole(Math.round(n * 100) / 100)} Mn`;
export const fmtUsdBn = (mn: number) => `US$ ${two(mn / 1000)} bn`;
export const fmtInrCr = (n: number) => `₹${whole(Math.round(n * 100) / 100)} crore`;
export const fmtPct = (n: number) => `${two(n)}%`;

/** Short, readable labels for the long official sector names. */
const sectorShort: Record<string, string> = {
  'Cotton Yarn/Fabs./Madeups, Handloom Products etc.': 'Cotton textiles & handloom',
  'Cereal Preparations and Miscellaneous Processed Item': 'Processed food',
  'Man-Made Yarn/Fabs./Madeups etc.': 'Man-made textiles',
  'Mica, Coal and other Ores, Minerals including Process': 'Minerals & ores',
  'Meat, Dairy and Poultry Products': 'Dairy & poultry',
  'Organic and Inorganic Chemicals': 'Chemicals',
  'Drugs and Pharmaceuticals': 'Pharmaceuticals',
  'Handicrafts excl. Hand made Carpet': 'Handicrafts',
  'Plastic and Linoleum': 'Plastics',
  'RMG of All Textiles': 'Garments',
  'Others': 'Other products',
};
export const shortSector = (s: string) => sectorShort[s] ?? s;

export const mpTotalUsdMn = mpProducts.reduce((s, p) => s + p.usdMn, 0);
export const mpTotalInrCr = mpProducts.reduce((s, p) => s + p.inrCr, 0);
export const mpShareOfIndia = (mpTotalUsdMn / indiaTotalUsdMn2526) * 100;

export const productShare = (p: MpProductExport) => (p.indiaUsdMn > 0 ? (p.usdMn / p.indiaUsdMn) * 100 : 0);

/** Products where MP supplies the largest share of India's exports (ignoring very small lines). */
export function nationalLeaders(minUsdMn = 25) {
  return mpProducts
    .filter((p) => p.usdMn >= minUsdMn && p.indiaUsdMn > 0)
    .map((p) => ({ ...p, share: productShare(p) }))
    .sort((a, b) => b.share - a.share);
}

export function sectorTotals(top = 8) {
  const map = new Map<string, number>();
  mpProducts.forEach((p) => map.set(p.sector, (map.get(p.sector) ?? 0) + p.usdMn));
  const all = [...map.entries()].map(([sector, usdMn]) => ({ sector, label: shortSector(sector), usdMn })).sort((a, b) => b.usdMn - a.usdMn);
  const head = all.slice(0, top);
  const rest = all.slice(top).reduce((s, x) => s + x.usdMn, 0);
  const rows = rest > 0 ? [...head, { sector: 'Other sectors', label: 'All other sectors', usdMn: rest }] : head;
  return rows.map((r) => ({ ...r, share: (r.usdMn / mpTotalUsdMn) * 100 }));
}

export function stateRank(key: 'usdMn2025' | 'usdMn2026Ytd', state = MP) {
  const sorted = [...stateExports].sort((a, b) => b[key] - a[key]);
  return { rank: sorted.findIndex((s) => s.state === state) + 1, of: sorted.length };
}

export const mpState = stateExports.find((s) => s.state === MP)!;

export const monthlyAverage = mpMonthly.reduce((s, m) => s + m.usdMn, 0) / mpMonthly.length;
export const peakMonth = mpMonthly.reduce((a, b) => (b.usdMn > a.usdMn ? b : a));
