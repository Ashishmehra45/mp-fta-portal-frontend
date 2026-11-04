/**
 * India's trade agreements — reference metadata only.
 * Dates and statuses reflect public announcements and must be re-verified against
 * the Department of Commerce before operational use. Tariff schedules and
 * product-specific rules are NOT loaded in this prototype.
 */

export type AgreementStatus = 'in_force' | 'signed' | 'negotiation';

export interface OriginRuleSummary {
  /** General criterion as commonly summarised; product-specific rules may differ */
  general: string;
  /** Minimum regional/domestic value content (%) under the general rule, if a single figure applies */
  valueContentThreshold: number | null;
  /** Tariff-shift requirement under the general rule */
  tariffShift: 'CTH' | 'CTSH' | 'PSR' | null;
  cumulation: boolean;
  certificate: string;
}

export interface Agreement {
  id: string;
  name: string;
  shortName: string;
  type: 'FTA' | 'CEPA' | 'CECA' | 'ECTA' | 'TEPA' | 'CETA' | 'PTA' | 'Regional' | 'Treaty';
  partners: string[];
  /** ISO 3166-1 alpha-2 codes of partner countries */
  partnerCodes: string[];
  status: AgreementStatus;
  signed?: string;
  inForce?: string;
  statusNote?: string;
  summary: string;
  origin?: OriginRuleSummary;
  officialSource: { label: string; url: string };
  lastVerified: string | null;
}

const COMMERCE = { label: 'Department of Commerce — Trade Agreements', url: 'https://www.commerce.gov.in/' };
const COO = 'Preferential Certificate of Origin via the DGFT e-CoO platform (trade.gov.in / coo.dgft.gov.in)';

const catalogue: Agreement[] = [
  {
    id: 'india-uae-cepa',
    name: 'India–UAE Comprehensive Economic Partnership Agreement',
    shortName: 'India–UAE CEPA',
    type: 'CEPA',
    partners: ['United Arab Emirates'],
    partnerCodes: ['AE'],
    status: 'in_force',
    signed: '2022-02-18',
    inForce: '2022-05-01',
    summary: 'Comprehensive agreement covering trade in goods, services, digital trade and government procurement provisions.',
    origin: {
      general: 'Value addition of at least 40% with a change in tariff classification at sub-heading level, unless a product-specific rule applies.',
      valueContentThreshold: 40,
      tariffShift: 'CTSH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-australia-ecta',
    name: 'India–Australia Economic Cooperation and Trade Agreement',
    shortName: 'India–Australia ECTA',
    type: 'ECTA',
    partners: ['Australia'],
    partnerCodes: ['AU'],
    status: 'in_force',
    signed: '2022-04-02',
    inForce: '2022-12-29',
    summary: 'Interim agreement eliminating or reducing tariffs on a large share of tariff lines; a comprehensive CECA is under negotiation.',
    origin: {
      general: 'Product-specific rules apply (tariff shift and/or qualifying value content). Check the PSR schedule for your HS line.',
      valueContentThreshold: null,
      tariffShift: 'PSR',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-efta-tepa',
    name: 'India–EFTA Trade and Economic Partnership Agreement',
    shortName: 'India–EFTA TEPA',
    type: 'TEPA',
    partners: ['Switzerland', 'Norway', 'Iceland', 'Liechtenstein'],
    partnerCodes: ['CH', 'NO', 'IS', 'LI'],
    status: 'in_force',
    signed: '2024-03-10',
    inForce: '2025-10-01',
    statusNote: 'Entry into force as publicly announced; verify the implementation notification.',
    summary: 'Covers goods, services and investment commitments with the four EFTA states.',
    origin: {
      general: 'Product-specific rules apply. Check the PSR annex for your HS line.',
      valueContentThreshold: null,
      tariffShift: 'PSR',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-uk-ceta',
    name: 'India–United Kingdom Comprehensive Economic and Trade Agreement',
    shortName: 'India–UK CETA',
    type: 'CETA',
    partners: ['United Kingdom'],
    partnerCodes: ['GB'],
    status: 'in_force',
    signed: '2025-07-24',
    inForce: '2026-07-15',
    summary: 'Comprehensive agreement covering goods, services, investment-related and other provisions. Zero-duty access for nearly 99% of India’s exports to the UK.',
    origin: {
      general: 'Product-specific rules apply (Annex 3A). Check the PSR schedule for your HS line.',
      valueContentThreshold: null,
      tariffShift: 'PSR',
      cumulation: true,
      certificate: 'Certificate of Origin via the DGFT eCoO 2.0 platform (self-certification) or origin declaration',
    },
    officialSource: { label: 'PIB — India–UK CETA enters into force (15 Jul 2026)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2285085&lang=1&reg=3' },
    lastVerified: '2026-10-23',
  },
  {
    id: 'india-mauritius-cecpa',
    name: 'India–Mauritius Comprehensive Economic Cooperation and Partnership Agreement',
    shortName: 'India–Mauritius CECPA',
    type: 'CEPA',
    partners: ['Mauritius'],
    partnerCodes: ['MU'],
    status: 'in_force',
    signed: '2021-02-22',
    inForce: '2021-04-01',
    summary: "India's first trade agreement with an African country, covering trade in goods and services.",
    origin: {
      general: 'Product-specific rules apply. Check the agreement annex for your HS line.',
      valueContentThreshold: null,
      tariffShift: 'PSR',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-japan-cepa',
    name: 'India–Japan Comprehensive Economic Partnership Agreement',
    shortName: 'India–Japan CEPA',
    type: 'CEPA',
    partners: ['Japan'],
    partnerCodes: ['JP'],
    status: 'in_force',
    signed: '2011-02-16',
    inForce: '2011-08-01',
    summary: 'Covers trade in goods, services, investment and cooperation provisions.',
    origin: {
      general: 'Qualifying value content of at least 35% and change in tariff sub-heading (general rule); product-specific rules may apply.',
      valueContentThreshold: 35,
      tariffShift: 'CTSH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-korea-cepa',
    name: 'India–Republic of Korea Comprehensive Economic Partnership Agreement',
    shortName: 'India–Korea CEPA',
    type: 'CEPA',
    partners: ['Republic of Korea'],
    partnerCodes: ['KR'],
    status: 'in_force',
    signed: '2009-08-07',
    inForce: '2010-01-01',
    statusNote: 'Agreement upgrade negotiations have been reported; verify any amendments.',
    summary: 'Covers trade in goods, services and investment.',
    origin: {
      general: 'Regional value content of at least 35% and change in tariff sub-heading (general rule); product-specific rules may apply.',
      valueContentThreshold: 35,
      tariffShift: 'CTSH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-singapore-ceca',
    name: 'India–Singapore Comprehensive Economic Cooperation Agreement',
    shortName: 'India–Singapore CECA',
    type: 'CECA',
    partners: ['Singapore'],
    partnerCodes: ['SG'],
    status: 'in_force',
    signed: '2005-06-29',
    inForce: '2005-08-01',
    summary: "India's first comprehensive economic cooperation agreement.",
    origin: {
      general: 'Local/regional value content of at least 40% and change in tariff sub-heading (general rule); product-specific rules may apply.',
      valueContentThreshold: 40,
      tariffShift: 'CTSH',
      cumulation: false,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-malaysia-ceca',
    name: 'India–Malaysia Comprehensive Economic Cooperation Agreement',
    shortName: 'India–Malaysia CECA',
    type: 'CECA',
    partners: ['Malaysia'],
    partnerCodes: ['MY'],
    status: 'in_force',
    signed: '2011-02-18',
    inForce: '2011-07-01',
    summary: 'Builds on ASEAN–India commitments with additional bilateral concessions.',
    origin: {
      general: 'Qualifying value content of at least 35% and change in tariff sub-heading (general rule).',
      valueContentThreshold: 35,
      tariffShift: 'CTSH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'asean-india-tig',
    name: 'ASEAN–India Trade in Goods Agreement',
    shortName: 'ASEAN–India TIGA',
    type: 'Regional',
    partners: ['Brunei', 'Cambodia', 'Indonesia', 'Lao PDR', 'Malaysia', 'Myanmar', 'Philippines', 'Singapore', 'Thailand', 'Viet Nam'],
    partnerCodes: ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN'],
    status: 'in_force',
    signed: '2009-08-13',
    inForce: '2010-01-01',
    statusNote: 'Entry into force dates differ by member state. The agreement is under review.',
    summary: 'Regional agreement on trade in goods between India and the ten ASEAN member states.',
    origin: {
      general: 'Regional value content of at least 35% and change in tariff sub-heading (general rule).',
      valueContentThreshold: 35,
      tariffShift: 'CTSH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'safta',
    name: 'Agreement on South Asian Free Trade Area',
    shortName: 'SAFTA',
    type: 'Regional',
    partners: ['Afghanistan', 'Bangladesh', 'Bhutan', 'Maldives', 'Nepal', 'Pakistan', 'Sri Lanka'],
    partnerCodes: ['AF', 'BD', 'BT', 'MV', 'NP', 'PK', 'LK'],
    status: 'in_force',
    signed: '2004-01-06',
    inForce: '2006-01-01',
    statusNote: 'Trade with some members is affected by separate measures; verify before use.',
    summary: 'Regional free trade arrangement among SAARC member states.',
    origin: {
      general: 'Change in tariff heading with domestic value content of at least 40% for non-LDC members such as India (general rule).',
      valueContentThreshold: 40,
      tariffShift: 'CTH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-sri-lanka-fta',
    name: 'India–Sri Lanka Free Trade Agreement',
    shortName: 'ISFTA',
    type: 'FTA',
    partners: ['Sri Lanka'],
    partnerCodes: ['LK'],
    status: 'in_force',
    signed: '1998-12-28',
    inForce: '2000-03-01',
    summary: 'Bilateral free trade agreement on goods.',
    origin: {
      general: 'Domestic value addition of at least 35% with a change in tariff heading (general rule).',
      valueContentThreshold: 35,
      tariffShift: 'CTH',
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'apta',
    name: 'Asia-Pacific Trade Agreement',
    shortName: 'APTA',
    type: 'PTA',
    partners: ['Bangladesh', 'China', 'Republic of Korea', 'Lao PDR', 'Mongolia', 'Sri Lanka'],
    partnerCodes: ['BD', 'CN', 'KR', 'LA', 'MN', 'LK'],
    status: 'in_force',
    signed: '1975-07-31',
    inForce: '1976-06-17',
    summary: 'Preferential trade agreement (formerly the Bangkok Agreement) with margin-of-preference concessions.',
    origin: {
      general: 'Refer to the APTA rules of origin for the applicable value content and processing criteria.',
      valueContentThreshold: null,
      tariffShift: null,
      cumulation: true,
      certificate: COO,
    },
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-chile-pta',
    name: 'India–Chile Preferential Trade Agreement',
    shortName: 'India–Chile PTA',
    type: 'PTA',
    partners: ['Chile'],
    partnerCodes: ['CL'],
    status: 'in_force',
    signed: '2006-03-08',
    inForce: '2007-08-17',
    statusNote: 'Expanded PTA in force from 2017; a CEPA is under negotiation.',
    summary: 'Preferential tariff concessions on a defined list of products.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-mercosur-pta',
    name: 'India–MERCOSUR Preferential Trade Agreement',
    shortName: 'India–MERCOSUR PTA',
    type: 'PTA',
    partners: ['Argentina', 'Brazil', 'Paraguay', 'Uruguay'],
    partnerCodes: ['AR', 'BR', 'PY', 'UY'],
    status: 'in_force',
    signed: '2004-01-25',
    inForce: '2009-06-01',
    summary: 'Preferential concessions on a limited list of tariff lines.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-nepal-treaty',
    name: 'India–Nepal Treaty of Trade',
    shortName: 'India–Nepal Treaty of Trade',
    type: 'Treaty',
    partners: ['Nepal'],
    partnerCodes: ['NP'],
    status: 'in_force',
    summary: 'Bilateral trade treaty (not an FTA or PTA) giving preferential access, periodically renewed.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-bhutan-agreement',
    name: 'India–Bhutan Treaty on Trade, Commerce and Transit',
    shortName: 'India–Bhutan Trade Treaty',
    type: 'Treaty',
    partners: ['Bhutan'],
    partnerCodes: ['BT'],
    status: 'in_force',
    summary: 'Bilateral trade treaty (not an FTA or PTA) providing a free trade regime between India and Bhutan, periodically renewed.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-oman-cepa',
    name: 'India–Oman Comprehensive Economic Partnership Agreement',
    shortName: 'India–Oman CEPA',
    type: 'CEPA',
    partners: ['Oman'],
    partnerCodes: ['OM'],
    status: 'in_force',
    signed: '2025-12-18',
    inForce: '2026-06-01',
    summary: 'Comprehensive agreement with zero-duty access for 99.38% of India’s exports to Oman, including all textile, apparel and handicraft lines.',
    origin: {
      general: 'Product-specific rules apply. Check the agreement’s rules of origin annex for your HS line.',
      valueContentThreshold: null,
      tariffShift: 'PSR',
      cumulation: true,
      certificate: 'Digital Certificate of Origin via the DGFT eCoO platform, exchanged electronically with Oman',
    },
    officialSource: { label: 'PIB — India–Oman CEPA in force (1 Jun 2026)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?lang=1&PRID=2268595&reg=3' },
    lastVerified: '2026-10-23',
  },
  {
    id: 'india-eu-fta',
    name: 'India–European Union Free Trade Agreement',
    shortName: 'India–EU FTA',
    type: 'FTA',
    partners: ['European Union (27 member states)'],
    partnerCodes: ['EU', 'DE', 'FR', 'NL', 'IT', 'ES', 'BE', 'PL', 'SE', 'IE', 'AT', 'DK', 'PT', 'FI', 'CZ', 'RO', 'GR', 'HU'],
    status: 'negotiation',
    statusNote: 'Not operational. Verify the current stage of negotiations or conclusion on official channels.',
    summary: 'Negotiations on a comprehensive trade agreement.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-nz-fta',
    name: 'India–New Zealand Free Trade Agreement',
    shortName: 'India–New Zealand FTA',
    type: 'FTA',
    partners: ['New Zealand'],
    partnerCodes: ['NZ'],
    status: 'in_force',
    signed: '2026-04-27',
    inForce: '2026-10-20',
    summary: 'Comprehensive free trade agreement giving zero duty on 100% of India’s exports to New Zealand from day one, with services and mobility commitments.',
    origin: {
      general: 'Product-specific rules apply. Check the agreement’s rules of origin annex for your HS line.',
      valueContentThreshold: null,
      tariffShift: 'PSR',
      cumulation: true,
      certificate: COO,
    },
    officialSource: { label: 'Department of Commerce — India–New Zealand FTA (in force 20 Oct 2026)', url: 'https://www.commerce.gov.in/files/d-m-y/14-India-New%20Zealand%20FTA.pdf' },
    lastVerified: '2026-10-23',
  },
  {
    id: 'india-gcc-fta',
    name: 'India–Gulf Cooperation Council Free Trade Agreement',
    shortName: 'India–GCC FTA',
    type: 'FTA',
    partners: ['Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'United Arab Emirates'],
    partnerCodes: ['SA', 'KW', 'QA', 'BH'],
    status: 'negotiation',
    statusNote: 'Not operational.',
    summary: 'Negotiations on a regional free trade agreement with the GCC.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-peru-fta',
    name: 'India–Peru Trade Agreement',
    shortName: 'India–Peru',
    type: 'FTA',
    partners: ['Peru'],
    partnerCodes: ['PE'],
    status: 'negotiation',
    statusNote: 'Not operational.',
    summary: 'Negotiations on a bilateral trade agreement.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
  {
    id: 'india-us-bta',
    name: 'India–United States Bilateral Trade Agreement',
    shortName: 'India–US BTA',
    type: 'FTA',
    partners: ['United States'],
    partnerCodes: ['US'],
    status: 'negotiation',
    statusNote: 'Not operational. Verify current status on official channels.',
    summary: 'Negotiations on a bilateral trade agreement.',
    officialSource: COMMERCE,
    lastVerified: null,
  },
];

const statusOrder: Record<AgreementStatus, number> = { in_force: 0, signed: 1, negotiation: 2 };

/** In-force agreements first, newest entry into force first; then signed, then under negotiation. */
export const agreements: Agreement[] = [...catalogue].sort(
  (a, b) => statusOrder[a.status] - statusOrder[b.status] || (b.inForce ?? b.signed ?? '').localeCompare(a.inForce ?? a.signed ?? ''),
);

export type AgreementCategory = 'fta' | 'pta' | 'treaty';

/** FTAs (incl. CEPA/CECA/ECTA/TEPA/CETA and regional FTAs), preferential trade agreements, and bilateral trade treaties. */
export const agreementCategory = (a: Agreement): AgreementCategory =>
  a.type === 'Treaty' ? 'treaty' : a.type === 'PTA' ? 'pta' : 'fta';

export const categoryLabel: Record<AgreementCategory, string> = {
  fta: 'Free Trade Agreements',
  pta: 'Preferential Trade Agreements',
  treaty: 'Trade treaties',
};

export const categorySingular: Record<AgreementCategory, string> = {
  fta: 'Free Trade Agreement',
  pta: 'Preferential Trade Agreement',
  treaty: 'Trade treaty',
};

export const statusLabel: Record<AgreementStatus, string> = {
  in_force: 'In force',
  signed: 'Signed — not yet implemented',
  negotiation: 'Under negotiation — not operational',
};

export const agreementsForCountry = (iso2: string) =>
  agreements.filter((a) => a.partnerCodes.includes(iso2.toUpperCase()));

export const inForceForCountry = (iso2: string) =>
  agreementsForCountry(iso2).filter((a) => a.status === 'in_force');

export const getAgreement = (id: string) => agreements.find((a) => a.id === id);

export const formatDate = (iso?: string) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
