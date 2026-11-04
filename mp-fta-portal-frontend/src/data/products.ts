/**
 * Reference product catalogue for search. HS codes are standard 6-digit
 * Harmonized System sub-headings; national 8-digit lines must be confirmed
 * against ITC-HS before filing.
 */
export type SectorId =
  | 'agriculture'
  | 'food'
  | 'textiles'
  | 'pharma'
  | 'chemicals'
  | 'engineering'
  | 'auto'
  | 'herbal'
  | 'handicrafts';

export const sectors: { id: SectorId; name: string; chapters: string }[] = [
  { id: 'agriculture', name: 'Agriculture', chapters: 'HS 07, 08, 10, 12' },
  { id: 'food', name: 'Food processing', chapters: 'HS 19–23' },
  { id: 'textiles', name: 'Textiles and garments', chapters: 'HS 50–63' },
  { id: 'pharma', name: 'Pharmaceuticals', chapters: 'HS 30' },
  { id: 'chemicals', name: 'Chemicals', chapters: 'HS 28–38' },
  { id: 'engineering', name: 'Engineering goods', chapters: 'HS 84–85' },
  { id: 'auto', name: 'Automotive components', chapters: 'HS 87' },
  { id: 'herbal', name: 'Herbal products', chapters: 'HS 12, 13, 33' },
  { id: 'handicrafts', name: 'Handicrafts', chapters: 'HS 44, 68, 97' },
];

export interface Product {
  hs: string;
  name: string;
  sector: SectorId;
}

export const products: Product[] = [
  { hs: '120190', name: 'Soya beans', sector: 'agriculture' },
  { hs: '230400', name: 'Soybean oil-cake (soymeal)', sector: 'food' },
  { hs: '150790', name: 'Soybean oil, refined', sector: 'food' },
  { hs: '100199', name: 'Wheat', sector: 'agriculture' },
  { hs: '100630', name: 'Rice, semi-milled or wholly milled', sector: 'agriculture' },
  { hs: '100829', name: 'Millets', sector: 'agriculture' },
  { hs: '071320', name: 'Chickpeas, dried', sector: 'agriculture' },
  { hs: '071360', name: 'Pigeon peas (tur), dried', sector: 'agriculture' },
  { hs: '070320', name: 'Garlic, fresh or chilled', sector: 'agriculture' },
  { hs: '070310', name: 'Onions, fresh or chilled', sector: 'agriculture' },
  { hs: '070190', name: 'Potatoes, fresh', sector: 'agriculture' },
  { hs: '080510', name: 'Oranges', sector: 'agriculture' },
  { hs: '080390', name: 'Bananas', sector: 'agriculture' },
  { hs: '080450', name: 'Mangoes', sector: 'agriculture' },
  { hs: '091030', name: 'Turmeric', sector: 'agriculture' },
  { hs: '091011', name: 'Ginger, neither crushed nor ground', sector: 'agriculture' },
  { hs: '090921', name: 'Coriander seeds, neither crushed nor ground', sector: 'agriculture' },
  { hs: '120750', name: 'Mustard seeds', sector: 'agriculture' },
  { hs: '210690', name: 'Food preparations n.e.s. (incl. namkeen)', sector: 'food' },
  { hs: '190590', name: 'Bakery products and snacks', sector: 'food' },
  { hs: '520512', name: 'Cotton yarn, single, uncombed', sector: 'textiles' },
  { hs: '520812', name: 'Woven cotton fabrics, unbleached', sector: 'textiles' },
  { hs: '500720', name: 'Woven silk fabrics (incl. saree fabric)', sector: 'textiles' },
  { hs: '610910', name: 'T-shirts and vests, cotton, knitted', sector: 'textiles' },
  { hs: '620520', name: "Men's shirts, cotton", sector: 'textiles' },
  { hs: '630790', name: 'Made-up textile articles', sector: 'textiles' },
  { hs: '300490', name: 'Medicaments, packaged for retail sale', sector: 'pharma' },
  { hs: '300420', name: 'Medicaments containing antibiotics', sector: 'pharma' },
  { hs: '294200', name: 'Organic compounds (bulk drug intermediates)', sector: 'chemicals' },
  { hs: '380891', name: 'Insecticides', sector: 'chemicals' },
  { hs: '320417', name: 'Synthetic organic pigments', sector: 'chemicals' },
  { hs: '870899', name: 'Parts and accessories of motor vehicles', sector: 'auto' },
  { hs: '870840', name: 'Gear boxes and parts', sector: 'auto' },
  { hs: '841370', name: 'Centrifugal pumps', sector: 'engineering' },
  { hs: '850152', name: 'AC motors, multi-phase', sector: 'engineering' },
  { hs: '843290', name: 'Parts of agricultural machinery', sector: 'engineering' },
  { hs: '121190', name: 'Medicinal and aromatic plants', sector: 'herbal' },
  { hs: '130190', name: 'Natural gums and resins (incl. lac)', sector: 'herbal' },
  { hs: '330129', name: 'Essential oils', sector: 'herbal' },
  { hs: '442090', name: 'Wooden handicraft articles', sector: 'handicrafts' },
  { hs: '680291', name: 'Worked stone articles (marble, sandstone)', sector: 'handicrafts' },
  { hs: '950300', name: 'Toys (incl. handcrafted toys)', sector: 'handicrafts' },
  { hs: '970190', name: 'Paintings and collages (tribal art)', sector: 'handicrafts' },
];

export const searchProducts = (q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const digits = query.replace(/\D/g, '');
  return products.filter((p) => {
    if (digits.length >= 2 && /^\d+$/.test(query.replace(/[\s.]/g, ''))) {
      return p.hs.startsWith(digits.slice(0, 6)) || digits.startsWith(p.hs.slice(0, Math.min(digits.length, 6)));
    }
    return p.name.toLowerCase().includes(query) || sectorName(p.sector).toLowerCase().includes(query);
  });
};

export const sectorName = (id: SectorId) => sectors.find((s) => s.id === id)?.name ?? id;

export const formatHs = (hs: string) => (hs.length >= 6 ? `${hs.slice(0, 4)}.${hs.slice(4, 6)}${hs.slice(6)}` : hs);
