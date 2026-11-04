import {
  Search,
  Calculator,
  Globe2,
  FileCheck2,
  ClipboardCheck,
  ShieldCheck,
  ShieldAlert,
  Handshake,
  Map,
  LayoutDashboard,
  BellRing,
  MessagesSquare,
  BookOpen,
  ScrollText,
  TrendingUp,
  CalendarClock,
  type LucideIcon,
} from 'lucide-react';

export interface PortalModule {
  id: string;
  number?: number;
  title: string;
  short: string;
  description: string;
  path: string;
  icon: LucideIcon;
  group: 'tools' | 'markets' | 'government' | 'resources';
  requiresLogin?: boolean;
  /** Shown with a "Coming soon" tag; page stays reachable. */
  comingSoon?: boolean;
}

export const modules: PortalModule[] = [
  {
    id: 'fta-finder',
    number: 1,
    title: 'FTA Benefit Finder',
    short: 'Benefit Finder',
    description: 'Check which Indian trade agreements cover your product and destination, and your likely eligibility status.',
    path: '/fta-benefit-finder',
    icon: Search,
    group: 'tools',
  },
  {
    id: 'calculator',
    number: 2,
    title: 'Global Duty Calculator',
    short: 'Global Duty Calculator',
    description: 'Compare standard and preferential customs duty using live tariff data, with landed-cost breakdown and reports.',
    path: '/tariff-savings-calculator',
    icon: Calculator,
    group: 'tools',
  },
  {
    id: 'rules-of-origin',
    number: 3,
    title: 'Rules of Origin Advisor',
    short: 'Rules of Origin',
    description: 'A guided questionnaire that produces a preliminary origin assessment and lists missing evidence.',
    path: '/rules-of-origin',
    icon: FileCheck2,
    group: 'tools',
  },
  {
    id: 'market-opportunities',
    number: 4,
    title: 'Market Opportunity Intelligence',
    short: 'Market Opportunities',
    description: 'Rank export markets, including India’s FTA partners, with a transparent scoring model.',
    path: '/market-opportunities',
    icon: Globe2,
    group: 'markets',
  },
  {
    id: 'mp-export',
    number: 5,
    title: 'District Export Intelligence Map',
    short: 'MP Export Map',
    description: 'Madhya Pradesh districts, products and clusters, matched to FTA partner markets.',
    path: '/mp-export-intelligence',
    icon: Map,
    group: 'markets',
  },
  {
    id: 'mp-strength',
    title: 'MP Export Strength',
    short: 'MP Export Strength',
    description: "Official export statistics: Madhya Pradesh's top products, sectors, monthly trend and share of India's exports.",
    path: '/mp-export-strength',
    icon: TrendingUp,
    group: 'markets',
  },
  {
    id: 'compliance',
    number: 6,
    title: 'Market Access & Compliance Navigator',
    short: 'Compliance Navigator',
    description: 'Standards, SPS measures, labelling, licensing and documentation — as a checklist you can save and download.',
    path: '/compliance-navigator',
    icon: ShieldCheck,
    group: 'tools',
  },
  {
    id: 'buyers',
    number: 7,
    title: 'Tender Intelligence',
    short: 'Tender Intelligence',
    description: 'Authorised channels for buyer enquiries, international tenders, trade fairs and missions.',
    path: '/buyer-tender-intelligence',
    icon: Handshake,
    group: 'markets',
  },
  {
    id: 'screening',
    title: 'Restricted Party Screening',
    short: 'Restricted Party Screening',
    description: 'Check a buyer or partner against the US Consolidated Screening List of sanctioned and denied parties.',
    path: '/restricted-party-screening',
    icon: ShieldAlert,
    group: 'markets',
  },
  {
    id: 'vyapar-setu',
    title: 'MP Vyapar Setu — B2B Meetings',
    short: 'MP Vyapar Setu',
    description: 'Business Bridge for MP Entrepreneurs: register, get verified and book confirmed video meetings with international buyers.',
    path: '/vyapar-setu',
    icon: CalendarClock,
    group: 'markets',
  },
  {
    id: 'readiness',
    number: 8,
    title: 'Export Readiness Assessment',
    short: 'Export Readiness',
    description: 'Check how ready you are to export and claim FTA benefits, with recommended actions.',
    path: '/export-readiness',
    icon: ClipboardCheck,
    group: 'tools',
  },
  {
    id: 'dashboard',
    number: 9,
    title: 'Government Administration Dashboard',
    short: 'Government Dashboard',
    description: 'District, sector and destination performance with FTA utilisation indicators.',
    path: '/government-dashboard',
    icon: LayoutDashboard,
    group: 'government',
  },
  {
    id: 'alerts',
    number: 10,
    title: 'Personalised FTA Alerts',
    short: 'FTA Alerts',
    description: 'Save products, HS codes and markets to follow tariff, origin and regulatory changes.',
    path: '/fta-alerts',
    icon: BellRing,
    group: 'markets',
  },
  {
    id: 'assistant',
    number: 11,
    title: 'AI Trade Assistant',
    short: 'Trade Assistant',
    description: 'Ask Free Trade Agreement and export questions in plain language; answers cite official sources.',
    path: '/trade-assistant',
    icon: MessagesSquare,
    group: 'resources',
  },
  {
    id: 'agreements',
    title: 'Free Trade Agreement Explorer',
    short: 'Free Trade Agreements',
    description: "Searchable directory of India's Free Trade Agreements with status, dates and official references.",
    path: '/trade-agreements',
    icon: ScrollText,
    group: 'resources',
  },
  {
    id: 'knowledge',
    title: 'Knowledge and Support',
    short: 'Knowledge & Support',
    description: 'How to claim FTA benefits: guides, FAQs and exporter assistance.',
    path: '/knowledge-support',
    icon: BookOpen,
    group: 'resources',
  },
];

/** Only these modules are live; every other module is tagged "Coming soon". */
export const LIVE_MODULE_IDS = ['fta-finder', 'calculator', 'vyapar-setu', 'rules-of-origin', 'readiness', 'mp-export', 'mp-strength', 'agreements', 'screening', 'buyers', 'knowledge'];
modules.forEach((m) => { m.comingSoon = !LIVE_MODULE_IDS.includes(m.id); });
// Live modules first, "Coming soon" last (stable, so each group keeps its order).
// Hidden modules are removed from every menu and list.
const HIDDEN_MODULE_IDS = ['alerts', 'market-opportunities', 'assistant', 'dashboard'];
modules.splice(0, modules.length, ...modules.filter((m) => !HIDDEN_MODULE_IDS.includes(m.id)));
modules.sort((a, b) => Number(!!a.comingSoon) - Number(!!b.comingSoon));

export const getModule = (id: string) => modules.find((m) => m.id === id);
