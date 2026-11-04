export interface Country {
  code: string;
  name: string;
  region: string;
}

/** Destination markets available in the portal's public tools. */
export const countries: Country[] = [
  { code: 'AE', name: 'United Arab Emirates', region: 'Gulf' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Gulf' },
  { code: 'OM', name: 'Oman', region: 'Gulf' },
  { code: 'QA', name: 'Qatar', region: 'Gulf' },
  { code: 'KW', name: 'Kuwait', region: 'Gulf' },
  { code: 'BH', name: 'Bahrain', region: 'Gulf' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'IS', name: 'Iceland', region: 'Europe' },
  { code: 'US', name: 'United States', region: 'Americas' },
  { code: 'CA', name: 'Canada', region: 'Americas' },
  { code: 'BR', name: 'Brazil', region: 'Americas' },
  { code: 'AR', name: 'Argentina', region: 'Americas' },
  { code: 'CL', name: 'Chile', region: 'Americas' },
  { code: 'PE', name: 'Peru', region: 'Americas' },
  { code: 'AU', name: 'Australia', region: 'Asia-Pacific' },
  { code: 'NZ', name: 'New Zealand', region: 'Asia-Pacific' },
  { code: 'JP', name: 'Japan', region: 'Asia-Pacific' },
  { code: 'KR', name: 'Republic of Korea', region: 'Asia-Pacific' },
  { code: 'CN', name: 'China', region: 'Asia-Pacific' },
  { code: 'SG', name: 'Singapore', region: 'ASEAN' },
  { code: 'MY', name: 'Malaysia', region: 'ASEAN' },
  { code: 'TH', name: 'Thailand', region: 'ASEAN' },
  { code: 'VN', name: 'Viet Nam', region: 'ASEAN' },
  { code: 'ID', name: 'Indonesia', region: 'ASEAN' },
  { code: 'PH', name: 'Philippines', region: 'ASEAN' },
  { code: 'BD', name: 'Bangladesh', region: 'South Asia' },
  { code: 'NP', name: 'Nepal', region: 'South Asia' },
  { code: 'LK', name: 'Sri Lanka', region: 'South Asia' },
  { code: 'BT', name: 'Bhutan', region: 'South Asia' },
  { code: 'MV', name: 'Maldives', region: 'South Asia' },
  { code: 'MU', name: 'Mauritius', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Africa' },
  { code: 'KE', name: 'Kenya', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Africa' },
  { code: 'EG', name: 'Egypt', region: 'Africa' },
];

export const getCountry = (code: string) => countries.find((c) => c.code === code);
