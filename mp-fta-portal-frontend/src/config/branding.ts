/**
 * Government branding for the portal.
 * Department, logo, contacts and leadership come from the Government of
 * Madhya Pradesh / MPIDC trade portal (mptradeportal.org). Replace portraits
 * with officially approved photographs before public launch.
 */
import mpidcLogo from '@/assets/mpidc-logo-v2.png.asset.json';
import pmPhoto from '@/assets/pm-narendra-modi.jpg.asset.json';
import cmPhoto from '@/assets/cm-mohan-yadav.jpg.asset.json';

export const branding = {
  portalName: 'Madhya Pradesh Free Trade Agreement (FTA) Portal',
  shortName: 'MP FTA Portal',
  tagline: 'From Free Trade Agreements to Business Opportunities.',
  stateName: 'Madhya Pradesh',
  governmentName: 'Government of Madhya Pradesh',
  departmentName: 'MP Industrial Development Corporation Ltd. (MPIDC)',
  departmentShort: 'MPIDC',
  logoUrl: mpidcLogo.url as string | null,
  contactEmail: 'export.investment@mpidc.co.in',
  contactPhone: '+91-755-257-7145',
  helplineLabel: 'FTA/EXPORT HELPLINE',
  tradePortalUrl: 'https://mptradeportal.org/',
  address: 'Official address to be confirmed',
  /** Placeholder — official launch announcement, shown only when set */
  launchAnnouncement: null as string | null,
  /** 'prototype' until formal approval is obtained */
  approvalStatus: 'prototype' as 'prototype' | 'approved',
  technologyPartner: 'intGrow',
};

/** Leaders shown on the homepage, in the same order as the official MP trade portal. */
export const leaders = [
  { name: 'Shri Narendra Modi', title: "Hon'ble Prime Minister of India", photo: pmPhoto.url },
  { name: 'Dr. Mohan Yadav', title: "Hon'ble Chief Minister, MP", photo: cmPhoto.url },
];

/** Who the state's export support is for (wording from the official MP trade portal). */
export const audiences = [
  'Exporters',
  'Freight Forwarders',
  'Custom House Agents',
  'Farmers & FPOs',
  'Handloom & Handicraft Entrepreneurs',
  'Startups',
  'MSMEs',
  'Industrial Units',
];

export const prototypeNotice =
  '';
