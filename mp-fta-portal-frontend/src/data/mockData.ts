// Mock data for intGrow Duty Calculator

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface HSCode {
  code: string;
  description: string;
  category: string;
}

export interface DutyRate {
  type: 'mfn' | 'fta' | 'exemption' | 'special';
  name: string;
  rate: number;
  agreement?: string;
  requirements?: string;
}

export const countries: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
];

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export const hsCodes: HSCode[] = [
  { code: '8471', description: 'Automatic data processing machines (computers)', category: 'Electronics' },
  { code: '8517', description: 'Telephone sets, smartphones', category: 'Electronics' },
  { code: '8703', description: 'Motor cars and vehicles', category: 'Automobiles' },
  { code: '3004', description: 'Medicaments (packaged for retail)', category: 'Pharmaceuticals' },
  { code: '6203', description: 'Men\'s suits, jackets, trousers', category: 'Textiles' },
  { code: '7108', description: 'Gold (unwrought or semi-manufactured)', category: 'Precious Metals' },
  { code: '2710', description: 'Petroleum oils', category: 'Energy' },
  { code: '8541', description: 'Semiconductor devices', category: 'Electronics' },
  { code: '9018', description: 'Medical instruments and appliances', category: 'Medical' },
  { code: '8708', description: 'Parts and accessories for motor vehicles', category: 'Automobiles' },
];

export const transportModes = [
  { id: 'sea', name: 'Sea', icon: 'Ship', costFactor: 1.0 },
  { id: 'air', name: 'Air', icon: 'Plane', costFactor: 1.5 },
  { id: 'road', name: 'Road', icon: 'Truck', costFactor: 1.2 },
];

// Mock FTA agreements
export const ftaAgreements: Record<string, { name: string; reduction: number }> = {
  'IN-SG': { name: 'India-Singapore CECA', reduction: 0.7 },
  'IN-TH': { name: 'India-Thailand FTA', reduction: 0.5 },
  'IN-MY': { name: 'India-Malaysia CECA', reduction: 0.6 },
  'IN-JP': { name: 'India-Japan CEPA', reduction: 0.65 },
  'IN-KR': { name: 'India-Korea CEPA', reduction: 0.6 },
  'IN-AE': { name: 'India-UAE CEPA', reduction: 0.8 },
  'US-CA': { name: 'USMCA', reduction: 1.0 },
  'US-MX': { name: 'USMCA', reduction: 1.0 },
  'GB-AU': { name: 'UK-Australia FTA', reduction: 0.9 },
  'DE-FR': { name: 'EU Single Market', reduction: 1.0 },
};

// Calculate duty rates based on inputs
export function calculateDutyRates(
  originCountry: string,
  importingCountry: string,
  hsCode: string,
  productValue: number
): DutyRate[] {
  // Base MFN rate (mock - would be from real database)
  const baseMfnRate = getBaseMfnRate(hsCode);
  
  const rates: DutyRate[] = [
    {
      type: 'mfn',
      name: 'Standard Rate (MFN)',
      rate: baseMfnRate,
    }
  ];

  // Check for FTA
  const ftaKey = `${importingCountry}-${originCountry}`;
  const reverseFtaKey = `${originCountry}-${importingCountry}`;
  const fta = ftaAgreements[ftaKey] || ftaAgreements[reverseFtaKey];
  
  if (fta) {
    rates.push({
      type: 'fta',
      name: 'FTA Preferential Rate',
      rate: baseMfnRate * (1 - fta.reduction),
      agreement: fta.name,
      requirements: 'Certificate of Origin required',
    });
  }

  // Add exemption notification (mock)
  if (hsCode.startsWith('84') || hsCode.startsWith('85')) {
    rates.push({
      type: 'exemption',
      name: 'Exemption Notification',
      rate: Math.max(0, baseMfnRate - 5),
      agreement: 'Notification No. 50/2017-Customs',
      requirements: 'End-use certificate required',
    });
  }

  // Add special scheme (mock)
  if (productValue > 50000) {
    rates.push({
      type: 'special',
      name: 'Advance Authorization',
      rate: 0,
      agreement: 'DGFT Advance License',
      requirements: 'Export obligation of 115% within 18 months',
    });
  }

  return rates;
}

function getBaseMfnRate(hsCode: string): number {
  const rateMap: Record<string, number> = {
    '8471': 15,
    '8517': 20,
    '8703': 60,
    '3004': 10,
    '6203': 25,
    '7108': 12.5,
    '2710': 5,
    '8541': 7.5,
    '9018': 7.5,
    '8708': 15,
  };
  return rateMap[hsCode] || 18; // Default 18%
}

export interface SavedCalculation {
  id: string;
  date: string;
  originCountry: Country;
  exportingCountry: Country;
  importingCountry: Country;
  currency: Currency;
  productValue: number;
  hsCode: string;
  transportMode: string;
  bestSavings: number;
  bestOption: string;
}

// Mock saved calculations - extended with more data
export const mockSavedCalculations: SavedCalculation[] = [
  {
    id: '1',
    date: '2025-01-18',
    originCountry: countries[0], // India
    exportingCountry: countries[0],
    importingCountry: countries[6], // Singapore
    currency: currencies[0], // USD
    productValue: 25000,
    hsCode: '8517',
    transportMode: 'sea',
    bestSavings: 3500,
    bestOption: 'FTA Preferential Rate',
  },
  {
    id: '2',
    date: '2025-01-17',
    originCountry: countries[2], // China
    exportingCountry: countries[2],
    importingCountry: countries[0], // India
    currency: currencies[0],
    productValue: 150000,
    hsCode: '8471',
    transportMode: 'air',
    bestSavings: 22500,
    bestOption: 'Advance Authorization',
  },
  {
    id: '3',
    date: '2025-01-15',
    originCountry: countries[3], // Germany
    exportingCountry: countries[3],
    importingCountry: countries[1], // US
    currency: currencies[0],
    productValue: 85000,
    hsCode: '8703',
    transportMode: 'sea',
    bestSavings: 12750,
    bestOption: 'FTA Preferential Rate',
  },
  {
    id: '4',
    date: '2025-01-12',
    originCountry: countries[5], // Japan
    exportingCountry: countries[5],
    importingCountry: countries[0], // India
    currency: currencies[0],
    productValue: 45000,
    hsCode: '8541',
    transportMode: 'air',
    bestSavings: 6750,
    bestOption: 'Exemption Notification',
  },
  {
    id: '5',
    date: '2025-01-10',
    originCountry: countries[0], // India
    exportingCountry: countries[0],
    importingCountry: countries[7], // UAE
    currency: currencies[0],
    productValue: 120000,
    hsCode: '6203',
    transportMode: 'air',
    bestSavings: 18000,
    bestOption: 'India-UAE CEPA',
  },
  {
    id: '6',
    date: '2025-01-08',
    originCountry: countries[8], // Thailand
    exportingCountry: countries[8],
    importingCountry: countries[0], // India
    currency: currencies[0],
    productValue: 35000,
    hsCode: '3004',
    transportMode: 'sea',
    bestSavings: 5250,
    bestOption: 'India-Thailand FTA',
  },
  {
    id: '7',
    date: '2025-01-05',
    originCountry: countries[9], // Vietnam
    exportingCountry: countries[9],
    importingCountry: countries[1], // US
    currency: currencies[0],
    productValue: 200000,
    hsCode: '8517',
    transportMode: 'sea',
    bestSavings: 30000,
    bestOption: 'FTA Preferential Rate',
  },
  {
    id: '8',
    date: '2025-01-02',
    originCountry: countries[12], // South Korea
    exportingCountry: countries[12],
    importingCountry: countries[0], // India
    currency: currencies[0],
    productValue: 75000,
    hsCode: '8708',
    transportMode: 'sea',
    bestSavings: 11250,
    bestOption: 'India-Korea CEPA',
  },
];

// Activity data for charts
export interface ActivityData {
  month: string;
  calculations: number;
  savings: number;
}

export const monthlyActivityData: ActivityData[] = [
  { month: 'Aug', calculations: 12, savings: 45000 },
  { month: 'Sep', calculations: 18, savings: 67500 },
  { month: 'Oct', calculations: 25, savings: 89000 },
  { month: 'Nov', calculations: 22, savings: 78500 },
  { month: 'Dec', calculations: 31, savings: 112000 },
  { month: 'Jan', calculations: 28, savings: 98500 },
];

// Country distribution data
export interface CountryDistribution {
  country: string;
  flag: string;
  count: number;
  percentage: number;
}

export const topDestinations: CountryDistribution[] = [
  { country: 'India', flag: '🇮🇳', count: 42, percentage: 35 },
  { country: 'Singapore', flag: '🇸🇬', count: 28, percentage: 23 },
  { country: 'UAE', flag: '🇦🇪', count: 18, percentage: 15 },
  { country: 'USA', flag: '🇺🇸', count: 15, percentage: 13 },
  { country: 'Others', flag: '🌍', count: 17, percentage: 14 },
];

// Recent activity timeline
export interface RecentActivity {
  id: string;
  type: 'calculation' | 'save' | 'export' | 'comparison';
  description: string;
  timestamp: string;
  metadata?: {
    route?: string;
    savings?: number;
  };
}

export const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'calculation',
    description: 'Calculated duty for HS 8517 (Smartphones)',
    timestamp: '2 hours ago',
    metadata: { route: 'India → Singapore', savings: 3500 },
  },
  {
    id: '2',
    type: 'save',
    description: 'Saved calculation for electronics shipment',
    timestamp: '5 hours ago',
    metadata: { route: 'China → India' },
  },
  {
    id: '3',
    type: 'export',
    description: 'Exported PDF report for automotive parts',
    timestamp: '1 day ago',
    metadata: { route: 'Germany → USA' },
  },
  {
    id: '4',
    type: 'comparison',
    description: 'Compared 4 FTA options for textiles',
    timestamp: '2 days ago',
    metadata: { route: 'India → UAE', savings: 18000 },
  },
  {
    id: '5',
    type: 'calculation',
    description: 'Calculated duty for pharmaceuticals',
    timestamp: '3 days ago',
    metadata: { route: 'Thailand → India', savings: 5250 },
  },
];
