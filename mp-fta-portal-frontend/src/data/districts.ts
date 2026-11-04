import type { SectorId } from './products';

/**
 * Madhya Pradesh districts (55) grouped by revenue division, laid out on a
 * schematic tile grid (not to scale). Profiles are DEMONSTRATION data compiled
 * from publicly known products (ODOP / GI references) and must be verified with
 * the State Industries Department before use. No export values are shown.
 */

export type Division =
  | 'Bhopal'
  | 'Indore'
  | 'Ujjain'
  | 'Gwalior'
  | 'Chambal'
  | 'Jabalpur'
  | 'Sagar'
  | 'Rewa'
  | 'Shahdol'
  | 'Narmadapuram';

export interface DistrictProfile {
  products: string[];
  sectors: SectorId[];
  clusters: string[];
  /** Illustrative destination markets — not trade statistics */
  markets: string[];
  ftaNotes: string;
  support: string[];
}

export interface District {
  name: string;
  division: Division;
  col: number;
  row: number;
  profile?: DistrictProfile;
}

const SUPPORT = ['District Industries Centre (DIC)', 'District Export Promotion Committee'];

export const districts: District[] = [
  { name: 'Sheopur', division: 'Chambal', col: 3, row: 0, profile: { products: ['Guava', 'Wooden crafts'], sectors: ['agriculture', 'handicrafts'], clusters: [], markets: ['UAE', 'Bangladesh'], ftaNotes: 'Fresh fruit to UAE may be covered under CEPA; check SPS conditions.', support: SUPPORT } },
  { name: 'Morena', division: 'Chambal', col: 4, row: 0, profile: { products: ['Mustard', 'Mustard oil'], sectors: ['agriculture', 'food'], clusters: ['Edible oil processing'], markets: ['UAE', 'Nepal', 'Bangladesh'], ftaNotes: 'SAFTA and the India–Nepal treaty may be relevant for edible oils; verify sensitive lists.', support: SUPPORT } },
  { name: 'Bhind', division: 'Chambal', col: 5, row: 0, profile: { products: ['Mustard'], sectors: ['agriculture'], clusters: [], markets: ['Nepal', 'Bangladesh'], ftaNotes: 'Check SAFTA sensitive lists for oilseeds.', support: SUPPORT } },
  { name: 'Neemuch', division: 'Ujjain', col: 1, row: 1, profile: { products: ['Coriander', 'Medicinal herbs'], sectors: ['agriculture', 'herbal'], clusters: ['Spice and herb mandi'], markets: ['UAE', 'Malaysia', 'UK'], ftaNotes: 'Spices to Malaysia/ASEAN may attract preferential rates; verify the tariff line.', support: SUPPORT } },
  { name: 'Shivpuri', division: 'Gwalior', col: 4, row: 1 },
  { name: 'Gwalior', division: 'Gwalior', col: 5, row: 1, profile: { products: ['Sandstone crafts', 'Engineering goods'], sectors: ['handicrafts', 'engineering'], clusters: ['Malanpur industrial area'], markets: ['USA', 'UAE', 'UK'], ftaNotes: 'Stone articles to UAE under CEPA; USA has no FTA with India.', support: SUPPORT } },
  { name: 'Datia', division: 'Gwalior', col: 6, row: 1 },
  { name: 'Niwari', division: 'Sagar', col: 7, row: 1 },
  { name: 'Mandsaur', division: 'Ujjain', col: 1, row: 2, profile: { products: ['Garlic', 'Coriander'], sectors: ['agriculture'], clusters: ['Garlic mandi'], markets: ['Bangladesh', 'Malaysia', 'Indonesia'], ftaNotes: 'Garlic to ASEAN may be covered under ASEAN–India TIGA; verify exclusion lists.', support: SUPPORT } },
  { name: 'Agar Malwa', division: 'Ujjain', col: 2, row: 2 },
  { name: 'Rajgarh', division: 'Bhopal', col: 3, row: 2 },
  { name: 'Guna', division: 'Gwalior', col: 4, row: 2, profile: { products: ['Coriander', 'Wheat'], sectors: ['agriculture'], clusters: [], markets: ['UAE', 'Malaysia'], ftaNotes: 'Coriander seeds: check ASEAN and UAE schedules.', support: SUPPORT } },
  { name: 'Ashoknagar', division: 'Gwalior', col: 5, row: 2, profile: { products: ['Chanderi sarees (GI)'], sectors: ['textiles', 'handicrafts'], clusters: ['Chanderi handloom cluster'], markets: ['UAE', 'UK', 'USA'], ftaNotes: 'Handloom silk/cotton fabrics to UAE under CEPA; check origin rules for imported yarn.', support: [...SUPPORT, 'Handloom Export Promotion Council'] } },
  { name: 'Tikamgarh', division: 'Sagar', col: 7, row: 2 },
  { name: 'Chhatarpur', division: 'Sagar', col: 8, row: 2, profile: { products: ['Furniture and wooden crafts'], sectors: ['handicrafts'], clusters: [], markets: ['UAE', 'Australia'], ftaNotes: 'Wooden articles to Australia: ECTA plus biosecurity import conditions.', support: SUPPORT } },
  { name: 'Panna', division: 'Sagar', col: 9, row: 2, profile: { products: ['Diamonds (NMDC mine)', 'Amla'], sectors: ['agriculture'], clusters: [], markets: ['UAE', 'Belgium'], ftaNotes: 'Gem trade typically routed via established hubs; verify product coverage.', support: SUPPORT } },
  { name: 'Satna', division: 'Rewa', col: 10, row: 2, profile: { products: ['Cement', 'Limestone products'], sectors: ['engineering'], clusters: ['Cement cluster'], markets: ['Nepal', 'Bangladesh'], ftaNotes: 'Regional markets under SAFTA / India–Nepal treaty.', support: SUPPORT } },
  { name: 'Rewa', division: 'Rewa', col: 11, row: 2, profile: { products: ['Mango (Sunderja, GI)'], sectors: ['agriculture'], clusters: [], markets: ['UAE', 'UK'], ftaNotes: 'Fresh mangoes require SPS clearance; UAE CEPA may offer preferential access.', support: SUPPORT } },
  { name: 'Mauganj', division: 'Rewa', col: 12, row: 2 },
  { name: 'Ratlam', division: 'Ujjain', col: 1, row: 3, profile: { products: ['Ratlami sev (GI)', 'Gold jewellery'], sectors: ['food'], clusters: ['Namkeen units'], markets: ['UAE', 'USA', 'UK', 'Australia'], ftaNotes: 'Processed snacks to UAE and Australia: check food standards and preferential lines.', support: SUPPORT } },
  { name: 'Ujjain', division: 'Ujjain', col: 2, row: 3, profile: { products: ['Batik print (Bherugarh)', 'Soybean processing'], sectors: ['textiles', 'food'], clusters: ['Vikram Udyogpuri'], markets: ['UAE', 'Japan'], ftaNotes: 'Printed textiles to Japan under CEPA; check origin of fabric inputs.', support: SUPPORT } },
  { name: 'Shajapur', division: 'Ujjain', col: 3, row: 3 },
  { name: 'Sehore', division: 'Bhopal', col: 4, row: 3, profile: { products: ['Sharbati wheat', 'Budhni wooden toys'], sectors: ['agriculture', 'handicrafts'], clusters: ['Budhni toy cluster'], markets: ['UAE', 'Australia'], ftaNotes: 'Wheat exports may be subject to export policy restrictions; check DGFT notifications.', support: SUPPORT } },
  { name: 'Vidisha', division: 'Bhopal', col: 5, row: 3, profile: { products: ['Wheat', 'Chickpea'], sectors: ['agriculture'], clusters: [], markets: ['UAE', 'Bangladesh'], ftaNotes: 'Pulses and cereals: verify export policy and partner sensitive lists.', support: SUPPORT } },
  { name: 'Sagar', division: 'Sagar', col: 6, row: 3, profile: { products: ['Chickpea', 'Beedi'], sectors: ['agriculture'], clusters: [], markets: ['UAE'], ftaNotes: 'Check partner schedules for pulses.', support: SUPPORT } },
  { name: 'Damoh', division: 'Sagar', col: 7, row: 3 },
  { name: 'Katni', division: 'Jabalpur', col: 8, row: 3, profile: { products: ['Limestone', 'Dal mills'], sectors: ['food', 'engineering'], clusters: ['Dal mill cluster'], markets: ['UAE', 'Nepal'], ftaNotes: 'Processed pulses: check UAE CEPA schedule and SAFTA lists.', support: SUPPORT } },
  { name: 'Maihar', division: 'Rewa', col: 9, row: 3 },
  { name: 'Sidhi', division: 'Rewa', col: 11, row: 3 },
  { name: 'Singrauli', division: 'Rewa', col: 12, row: 3 },
  { name: 'Jhabua', division: 'Indore', col: 0, row: 4, profile: { products: ['Kadaknath poultry (GI)', 'Tribal dolls and beadwork'], sectors: ['agriculture', 'handicrafts'], clusters: [], markets: ['UAE'], ftaNotes: 'Poultry exports are subject to strict SPS requirements.', support: SUPPORT } },
  { name: 'Dhar', division: 'Indore', col: 1, row: 4, profile: { products: ['Automotive components', 'Pharmaceuticals', 'Bagh print (GI)'], sectors: ['auto', 'pharma', 'textiles'], clusters: ['Pithampur industrial area', 'Pithampur SEZ'], markets: ['UAE', 'Japan', 'Australia', 'USA', 'UK'], ftaNotes: 'Auto parts to Japan/Korea/ASEAN: CEPA and TIGA rules of origin with value-content tests.', support: [...SUPPORT, 'EEPC India', 'Pharmexcil'] } },
  { name: 'Indore', division: 'Indore', col: 2, row: 4, profile: { products: ['Pharmaceuticals', 'Namkeen', 'Leather toys (GI)', 'Garments'], sectors: ['pharma', 'food', 'textiles', 'handicrafts'], clusters: ['Sanwer Road industrial area', 'Garment cluster'], markets: ['UAE', 'Australia', 'UK', 'USA', 'Mauritius'], ftaNotes: 'Pharma to Australia/UAE: preferential tariffs plus product registration with the destination regulator.', support: [...SUPPORT, 'Pharmexcil', 'AEPC'] } },
  { name: 'Dewas', division: 'Ujjain', col: 3, row: 4, profile: { products: ['Engineering goods', 'Pharmaceuticals', 'Soybean processing'], sectors: ['engineering', 'pharma', 'food'], clusters: ['Dewas industrial area'], markets: ['UAE', 'Malaysia', 'Japan'], ftaNotes: 'Engineering goods to ASEAN under TIGA: RVC 35% + CTSH general rule.', support: SUPPORT } },
  { name: 'Bhopal', division: 'Bhopal', col: 4, row: 4, profile: { products: ['Zari-zardozi crafts', 'Electrical equipment', 'Pharma'], sectors: ['handicrafts', 'engineering', 'pharma'], clusters: ['Govindpura industrial area', 'Mandideep (adjacent)'], markets: ['UAE', 'UK', 'Singapore'], ftaNotes: 'Electrical equipment to Singapore under CECA; check controlled-goods safety marking.', support: SUPPORT } },
  { name: 'Raisen', division: 'Bhopal', col: 5, row: 4, profile: { products: ['Basmati-type rice', 'Textiles and engineering (Mandideep)'], sectors: ['agriculture', 'textiles', 'engineering'], clusters: ['Mandideep industrial area'], markets: ['UAE', 'Saudi Arabia', 'UK'], ftaNotes: 'Rice to UAE under CEPA; Saudi Arabia has no operational FTA with India.', support: SUPPORT } },
  { name: 'Narsinghpur', division: 'Jabalpur', col: 6, row: 4, profile: { products: ['Tur dal', 'Sugarcane / jaggery'], sectors: ['agriculture', 'food'], clusters: [], markets: ['UAE', 'Nepal'], ftaNotes: 'Pulses: verify export policy and partner sensitive lists.', support: SUPPORT } },
  { name: 'Jabalpur', division: 'Jabalpur', col: 7, row: 4, profile: { products: ['Green peas', 'Readymade garments', 'Stone crafts (Bhedaghat)'], sectors: ['agriculture', 'textiles', 'handicrafts'], clusters: ['Garment cluster', 'Richhai industrial area'], markets: ['UAE', 'UK'], ftaNotes: 'Garments to UAE under CEPA: check yarn-forward or value-addition requirements.', support: SUPPORT } },
  { name: 'Umaria', division: 'Shahdol', col: 9, row: 4 },
  { name: 'Shahdol', division: 'Shahdol', col: 10, row: 4, profile: { products: ['Turmeric'], sectors: ['agriculture'], clusters: [], markets: ['UAE', 'Malaysia'], ftaNotes: 'Turmeric to Malaysia under CECA / TIGA; verify tariff line.', support: SUPPORT } },
  { name: 'Anuppur', division: 'Shahdol', col: 11, row: 4 },
  { name: 'Alirajpur', division: 'Indore', col: 0, row: 5 },
  { name: 'Barwani', division: 'Indore', col: 1, row: 5, profile: { products: ['Cotton', 'Papaya'], sectors: ['agriculture'], clusters: [], markets: ['Bangladesh'], ftaNotes: 'Raw cotton to Bangladesh under SAFTA; check rules.', support: SUPPORT } },
  { name: 'Khargone', division: 'Indore', col: 2, row: 5, profile: { products: ['Maheshwari sarees (GI)', 'Cotton', 'Chilli'], sectors: ['textiles', 'agriculture'], clusters: ['Maheshwar handloom cluster'], markets: ['UAE', 'UK', 'USA'], ftaNotes: 'Handloom fabric to UAE under CEPA; origin of silk yarn matters.', support: [...SUPPORT, 'Handloom Export Promotion Council'] } },
  { name: 'Khandwa', division: 'Indore', col: 3, row: 5 },
  { name: 'Harda', division: 'Narmadapuram', col: 4, row: 5 },
  { name: 'Narmadapuram', division: 'Narmadapuram', col: 5, row: 5, profile: { products: ['Soybean', 'Tur dal'], sectors: ['agriculture'], clusters: [], markets: ['UAE'], ftaNotes: 'Check export policy for pulses.', support: SUPPORT } },
  { name: 'Chhindwara', division: 'Jabalpur', col: 6, row: 5, profile: { products: ['Oranges', 'Maize'], sectors: ['agriculture'], clusters: [], markets: ['Bangladesh', 'UAE', 'Nepal'], ftaNotes: 'Oranges to Bangladesh under SAFTA; check SPS conditions.', support: SUPPORT } },
  { name: 'Seoni', division: 'Jabalpur', col: 7, row: 5 },
  { name: 'Mandla', division: 'Jabalpur', col: 8, row: 5, profile: { products: ['Kodo-kutki millets'], sectors: ['agriculture'], clusters: [], markets: ['UAE', 'Australia'], ftaNotes: 'Millets to UAE/Australia; check preferential lines and food standards.', support: SUPPORT } },
  { name: 'Dindori', division: 'Jabalpur', col: 9, row: 5, profile: { products: ['Kodo-kutki millets', 'Gond art'], sectors: ['agriculture', 'handicrafts'], clusters: [], markets: ['UAE', 'UK'], ftaNotes: 'Tribal art: check handicraft origin documentation.', support: SUPPORT } },
  { name: 'Burhanpur', division: 'Indore', col: 3, row: 6, profile: { products: ['Bananas', 'Powerloom textiles'], sectors: ['agriculture', 'textiles'], clusters: ['Powerloom cluster'], markets: ['UAE', 'Iran', 'Oman'], ftaNotes: 'Bananas to UAE under CEPA; Oman CEPA status to be verified.', support: SUPPORT } },
  { name: 'Betul', division: 'Narmadapuram', col: 5, row: 6 },
  { name: 'Pandhurna', division: 'Jabalpur', col: 6, row: 6 },
  { name: 'Balaghat', division: 'Jabalpur', col: 8, row: 6, profile: { products: ['Chinnor rice (GI)', 'Manganese'], sectors: ['agriculture'], clusters: [], markets: ['UAE'], ftaNotes: 'Speciality rice to UAE under CEPA; verify tariff line.', support: SUPPORT } },
];

export const divisions: Division[] = ['Bhopal', 'Indore', 'Ujjain', 'Gwalior', 'Chambal', 'Jabalpur', 'Sagar', 'Rewa', 'Shahdol', 'Narmadapuram'];
