
import mibcLogo from '@/assets/mibc-logo.png.asset.json';

/**
 * MP Vyapar Setu — "Business Bridge for MP Entrepreneurs".
 * The B2B meeting platform itself runs at meeting.intgrow.co (separate app,
 * separate sign-in). This portal only describes it and links to it.
 * Details below mirror what that platform actually offers today.
 */
export const vyaparSetu = {
  name: 'MP Vyapar Setu',
  tagline: 'Business Bridge for MP Entrepreneurs',
  hindi: 'व्यापार सेतु',
  siteUrl: 'https://meeting.intgrow.co',
  registerUrl: 'https://meeting.intgrow.co/auth',
  signInUrl: 'https://meeting.intgrow.co/auth',
  displayHost: 'meeting.intgrow.co',
  /** Public (publishable) address of the meeting platform's data service — used only to read approved Mexican companies. */
  platformApi: {
    url: 'https://imethvfrbszzjghbjijb.supabase.co',
    publishableKey: 'sb_publishable_6CYiyqfdp0zsOdfPK5SOqg_3KQVKLi7',
  },
  facts: [
    { k: '30 min', v: 'Per meeting, with a 10-minute changeover between calls' },
    { k: '2 timezones', v: 'Every slot shown in India time and your partner’s local time' },
    { k: 'Vetted only', v: 'Companies appear only after secretariat approval' },
    { k: 'Auto video link', v: 'Attached as soon as both sides confirm a meeting' },
  ],
  steps: [
    { title: 'Register your company', body: 'Create an account and submit a short profile — what you make or buy, brands, volumes and what you are looking for.' },
    { title: 'Secretariat approval', body: 'The programme secretariat verifies every entry before it becomes visible to buyers and partners.' },
    { title: 'Open your slots', body: 'Pick the 30-minute slots you can attend. Each time is shown in both countries’ time zones.' },
    { title: 'Meet and close deals', body: 'Send a meeting request; when the other side accepts, a video meeting link is attached automatically.' },
  ],
  features: [
    { title: 'Company dashboard', body: 'Your upcoming and past meetings in one place, plus suggested companies worth meeting.' },
    { title: 'Find partners', body: 'Browse approved companies by country, type and category, with brand and product details.' },
    { title: 'Availability planner', body: 'Tick the programme slots you can attend and see how many counterparts are free at the same time.' },
    { title: 'Meeting requests', body: 'Requests received and sent, with one-click accept or decline and a ready video link.' },
  ],
  registrationFields: [
    'Choose India as your country (MP companies register as buyers / partners)',
    'Company name and city',
    'Contact person and email',
    'Phone with country code',
    'Website (optional)',
    'Short description of products, brands and needs',
  ],
  access: [
    { who: 'Anyone', can: 'View the programme page and create an account.' },
    { who: 'Registered company', can: 'Complete and edit its own company profile while waiting for approval.' },
    { who: 'Approved company', can: 'See other approved companies, set availability, send and accept meeting requests, join video meetings.' },
    { who: 'Programme secretariat', can: 'Approve or reject companies, manage programme slots and oversee all meetings.' },
  ],
  currentProgramme: 'Mexico–India Business Council Tequila Accelerator',
  /** Current programme partner — details from mexicoindia.org (official MIBC website). */
  partner: {
    name: 'México–India Business Council',
    short: 'MIBC',
    logoUrl: mibcLogo.url,
    website: 'https://mexicoindia.org',
    about:
      'Established with the support of the Government of México and recognised by the Government of India, MIBC is the institutional platform for México–India commercial engagement — investment facilitation, market entry, trade promotion and government-coordinated delegations.',
    programme: {
      name: 'Tequila Accelerator',
      body: 'Market entry programme helping Mexican tequila and spirits brands meet Indian importers, distributors and HoReCa partners. B2B meeting days 1–3 September (dates confirmed by the secretariat).',
    },
    services: ['Matchmaking & trade missions', 'Market intelligence & tariff analysis', 'Investment facilitation', 'Policy engagement'],
    contact: {
      email: 'office.ceo@mexicoindia.org',
      phones: ['+91 88787 05984', '+91 70005 61461'],
      address: 'C06, Chhatrapati Shivaji Maharaj International Airport, Mumbai, Maharashtra 400099',
    },
  },
};
