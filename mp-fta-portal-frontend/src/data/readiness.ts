export type Answer = 'yes' | 'partial' | 'no';

export interface ReadinessSection {
  id: string;
  title: string;
  questions: { id: string; text: string; action: string }[];
  support: string;
  learn: string;
}

export const readinessSections: ReadinessSection[] = [
  { id: 'reg', title: 'Business registration & export authorisation', support: 'DGFT regional office / District Industries Centre', learn: 'DGFT IEC guide',
    questions: [
      { id: 'reg1', text: 'Do you have an Importer-Exporter Code (IEC)?', action: 'Apply for an IEC on the DGFT portal.' },
      { id: 'reg2', text: 'Are you registered for GST and able to file an LUT?', action: 'Complete GST registration and file a Letter of Undertaking for zero-rated exports.' },
      { id: 'reg3', text: 'Do you hold an RCMC from the relevant Export Promotion Council?', action: 'Obtain an RCMC from your sector EPC.' },
    ] },
  { id: 'hs', title: 'Product classification', support: 'Customs broker / EPC helpdesk', learn: 'HS classification basics',
    questions: [
      { id: 'hs1', text: 'Have you confirmed the 8-digit ITC-HS code of your product?', action: 'Confirm classification with a customs broker; use ITC-HS schedules.' },
      { id: 'hs2', text: 'Have you checked the export policy (free / restricted) for that code?', action: 'Check the ITC-HS export policy on the DGFT site.' },
    ] },
  { id: 'cap', title: 'Production capacity', support: 'District Industries Centre', learn: 'Capacity planning for exports',
    questions: [
      { id: 'cap1', text: 'Can you fulfil a container-sized order within agreed lead times?', action: 'Assess capacity and identify partner units for overflow.' },
      { id: 'cap2', text: 'Do you have consistent quality across batches?', action: 'Introduce batch quality control and records.' },
    ] },
  { id: 'qc', title: 'Quality certifications', support: 'Export Inspection Council / BIS', learn: 'International certifications overview',
    questions: [
      { id: 'qc1', text: 'Do you hold certifications buyers commonly require (e.g. ISO 9001, HACCP, GMP)?', action: 'Identify certifications required in target markets and plan audits.' },
    ] },
  { id: 'pack', title: 'Packaging & labelling', support: 'Indian Institute of Packaging', learn: 'Export packaging standards',
    questions: [
      { id: 'pack1', text: 'Does your packaging meet destination labelling rules (language, ingredients, origin)?', action: 'Review destination labelling rules in the Compliance Navigator.' },
      { id: 'pack2', text: 'Is wooden packaging ISPM-15 treated and marked?', action: 'Use ISPM-15 certified pallets and crates.' },
    ] },
  { id: 'mkt', title: 'Market-specific compliance', support: 'Export Promotion Council', learn: 'SPS and TBT measures',
    questions: [
      { id: 'mkt1', text: 'Have you identified mandatory registrations or tests in your target market?', action: 'Generate a checklist in the Compliance Navigator.' },
    ] },
  { id: 'price', title: 'Pricing & logistics', support: 'Freight forwarder / FIEO', learn: 'Incoterms and export pricing',
    questions: [
      { id: 'price1', text: 'Can you quote FOB and CIF prices using Incoterms?', action: 'Build an export costing sheet with freight and insurance.' },
      { id: 'price2', text: 'Do you have a freight forwarder and customs broker?', action: 'Shortlist forwarders and a licensed customs broker.' },
    ] },
  { id: 'roo', title: 'Rules of origin', support: 'Certificate of Origin issuing agency', learn: 'FTA rules of origin explainer',
    questions: [
      { id: 'roo1', text: 'Do you know which origin criterion applies to your product under the relevant FTA?', action: 'Use the Rules of Origin Advisor.' },
      { id: 'roo2', text: 'Do you keep cost and supplier records to prove origin?', action: 'Maintain bill of materials, supplier declarations and cost sheets.' },
    ] },
  { id: 'docs', title: 'Export documentation', support: 'Customs broker', learn: 'Shipping documents checklist',
    questions: [
      { id: 'docs1', text: 'Can you prepare commercial invoice, packing list and shipping bill correctly?', action: 'Use templates and a broker for your first shipments.' },
    ] },
  { id: 'mktg', title: 'International marketing capability', support: 'EPC / trade fair organisers', learn: 'Digital export marketing',
    questions: [
      { id: 'mktg1', text: 'Do you have an export catalogue and website in English?', action: 'Prepare an export catalogue with specifications and certifications.' },
      { id: 'mktg2', text: 'Have you participated in a trade fair or buyer-seller meet?', action: 'Plan participation via EPC or ITPO events.' },
    ] },
];

export const scoreOf = (a?: Answer) => (a === 'yes' ? 2 : a === 'partial' ? 1 : 0);

export function readinessLevel(pct: number) {
  if (pct >= 80) return { label: 'Export ready', tone: 'ok' as const };
  if (pct >= 55) return { label: 'Nearly ready', tone: 'ok' as const };
  if (pct >= 30) return { label: 'Developing', tone: 'warn' as const };
  return { label: 'Early stage', tone: 'warn' as const };
}
