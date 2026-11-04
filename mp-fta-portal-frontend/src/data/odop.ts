import type { SectorId } from './products';

/**
 * One District One Product (ODOP) — Madhya Pradesh.
 * OFFICIAL reference data taken from the Government of Madhya Pradesh / MPIDC
 * Export Promotion & ODOP page: https://mptradeportal.org/districtProfileOdop
 * (fetched Oct 2026). Product pictures are copies of that page's images.
 * Do not hand-add products; re-check that page when updating.
 * Districts not listed there (e.g. Harda, Neemuch, Niwari) have no ODOP entry here.
 */

export const ODOP_SOURCE_URL = 'https://mptradeportal.org/districtProfileOdop';
export const ODOP_SELLERS_PDF = 'https://mptradeportal.org/assets/mpodopseller-BqRnhms8.pdf';

export interface OdopEntry {
  /** District name as used in src/data/districts.ts */
  district: string;
  product: string;
  sectors: SectorId[];
  /** Image key (file name stem) of the product picture */
  image: string;
  /** District page on mptradeportal.org */
  url: string;
}

const pics = import.meta.glob('../assets/odop/*.asset.json', { eager: true, import: 'default' }) as Record<string, { url: string }>;

export const odopImage = (key: string): string | undefined => pics[`../assets/odop/odop-${key}.webp.asset.json`]?.url;

const e = (district: string, product: string, sectors: SectorId[], image: string, slug: string): OdopEntry => ({
  district, product, sectors, image, url: `https://mptradeportal.org/${slug}`,
});

export const odop: OdopEntry[] = [
  e('Agar Malwa', 'Orange', ['agriculture'], 'agarmalwa', 'agarmalwa'),
  e('Alirajpur', 'Mahua', ['agriculture', 'herbal'], 'alirajpur', 'alirajpur'),
  e('Anuppur', 'Kodo Kutki', ['agriculture'], 'anuppur', 'anuppur'),
  e('Ashoknagar', 'Chanderi Handloom', ['textiles', 'handicrafts'], 'ashoknagar', 'ashoknagar'),
  e('Balaghat', 'Chinnor Rice', ['agriculture'], 'balaghat', 'balaghat'),
  e('Barwani', 'Ginger', ['agriculture'], 'barwani', 'barwani'),
  e('Betul', 'Teak', ['handicrafts'], 'betul', 'betul'),
  e('Bhind', 'Mustard', ['agriculture'], 'bhind', 'bhind'),
  e('Bhopal', 'Zari Zardozi & Jute Products', ['handicrafts', 'textiles'], 'bhopal', 'bhopal'),
  e('Burhanpur', 'Banana', ['agriculture'], 'burhanpur', 'burhanpur'),
  e('Chhatarpur', 'Wooden Furniture', ['handicrafts'], 'chhatarpur', 'chhatarpur'),
  e('Chhindwara', 'Orange', ['agriculture'], 'chhindwara', 'chhindwara'),
  e('Damoh', 'Gram', ['agriculture'], 'damoh', 'damoh'),
  e('Datia', 'Jaggery', ['food'], 'datia', 'datia'),
  e('Dewas', 'Bamboo', ['handicrafts'], 'dewas', 'dewas'),
  e('Dhar', 'Bagh Print', ['textiles', 'handicrafts'], 'dhar', 'dhar'),
  e('Dindori', 'Kodo Kutki', ['agriculture'], 'dindori', 'dindori'),
  e('Guna', 'Coriander', ['agriculture'], 'guna', 'guna'),
  e('Gwalior', 'Sandstone Tiles', ['handicrafts'], 'gwalior', 'gwalior'),
  e('Narmadapuram', 'Tourism', [], 'narmadapuram', 'narmadapuram'),
  e('Indore', 'Potato', ['agriculture'], 'indore', 'indore'),
  e('Jabalpur', 'Pea', ['agriculture'], 'jabalpur', 'jabalpur'),
  e('Jhabua', 'Kadaknath Chicken', ['agriculture'], 'jhabua', 'jhabua'),
  e('Katni', 'Katni Stone', ['handicrafts'], 'katni', 'katni'),
  e('Khandwa', 'Onion', ['agriculture'], 'khandwa', 'khandwa'),
  e('Khargone', 'Chilli', ['agriculture'], 'khargone', 'khargone'),
  e('Maihar', 'Tomato', ['agriculture'], 'satna', 'maihar'),
  e('Mauganj', 'Tomato', ['agriculture'], 'satna', 'Mauganj'),
  e('Mandla', 'Kodo Kutki', ['agriculture'], 'mandla', 'mandla'),
  e('Mandsaur', 'Garlic', ['agriculture'], 'mandsaur', 'mandsaur'),
  e('Morena', 'Mustard', ['agriculture'], 'morena', 'morena'),
  e('Narsinghpur', 'Toor Dal', ['agriculture', 'food'], 'narsinghpur', 'narsinghpur'),
  e('Seoni', 'Custard Apple', ['agriculture'], 'seoni', 'seoni'),
  e('Panna', 'Gooseberry (Amla)', ['agriculture'], 'panna', 'panna'),
  e('Pandhurna', 'Orange', ['agriculture'], 'chhindwara', 'pandhura'),
  e('Raisen', 'Basmati Rice', ['agriculture'], 'raisen', 'raisen'),
  e('Rajgarh', 'Orange', ['agriculture'], 'rajgarh', 'rajgarh'),
  e('Ratlam', 'Ratlami Sev', ['food'], 'ratlam', 'ratlam'),
  e('Rewa', 'Bamboo', ['handicrafts'], 'rewa', 'rewa'),
  e('Sagar', 'Farm Equipment', ['engineering'], 'sagar', 'sagar'),
  e('Satna', 'Tomato', ['agriculture'], 'satna', 'satna'),
  e('Sehore', 'Wooden Handicrafts', ['handicrafts'], 'sehore', 'sehore'),
  e('Shahdol', 'Turmeric', ['agriculture'], 'shahdol', 'shahdol'),
  e('Shajapur', 'Onion', ['agriculture'], 'shajapur', 'shajapur'),
  e('Sheopur', 'Guava', ['agriculture'], 'sheopur', 'sheopur'),
  e('Shivpuri', 'Cloth Jacket', ['textiles'], 'shivpuri', 'shivpuri'),
  e('Sidhi', 'Carpet', ['textiles', 'handicrafts'], 'sidhi', 'sidhi'),
  e('Singrauli', 'Kodo Kutki', ['agriculture'], 'singrauli', 'singrauli'),
  e('Tikamgarh', 'Ginger', ['agriculture'], 'tikamgarh', 'tikamgarh'),
  e('Ujjain', 'Batik Print', ['textiles', 'handicrafts'], 'ujjain', 'ujjain'),
  e('Umaria', 'Mahua', ['agriculture', 'herbal'], 'umaria', 'umaria'),
  e('Vidisha', 'Farm Equipment', ['engineering'], 'vidisha', 'vidisha'),
];

export const odopFor = (district: string) => odop.find((o) => o.district === district);

/** Headline programme facts as published on the official ODOP page. */
export const odopFacts = {
  stats: [
    { value: '52+', label: 'District products' },
    { value: '5000+', label: 'MSMEs & startups' },
    { value: '30+', label: 'Global markets' },
    { value: '₹2000+ Cr', label: 'Export value' },
  ],
  award: 'Silver Medal, National ODOP Awards 2024',
  outreach: ['Singapore', 'New York', 'Milan', 'Vancouver', 'Japan', 'Bahrain', 'Kuwait'],
  retail: ['Mustafa Centre (Singapore)', 'Centrepoint Mall (Singapore)'],
  cell: { name: 'Export-ODOP Cell, MPIDC', phone: '+91-755-257-7145', email: 'Export.investment@mpidc.co.in' },
};

/** Sectors for a district: its demo profile sectors plus its official ODOP product sectors. */
export const districtSectors = (d: { name: string; profile?: { sectors: SectorId[] } }): SectorId[] =>
  Array.from(new Set([...(d.profile?.sectors ?? []), ...(odopFor(d.name)?.sectors ?? [])]));
