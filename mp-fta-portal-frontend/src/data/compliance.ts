/**
 * Market access & compliance reference. Entries summarise widely documented
 * requirements and link to the responsible authority. Requirements vary by HS
 * line — always confirm with the linked authority.
 */
export type ReqType = 'mandatory' | 'recommended' | 'guidance';
export type Category = 'food' | 'textiles' | 'pharma' | 'engineering' | 'chemicals' | 'handicrafts';
export type Topic = 'Standards' | 'Technical regulations' | 'SPS measures' | 'Labelling & packaging' | 'Import licensing' | 'Testing & certification' | 'Restrictions' | 'Documentation';

export interface Requirement {
  id: string;
  title: string;
  topic: Topic;
  type: ReqType;
  authority: string;
  url: string;
  note?: string;
}

export const categories: { id: Category; name: string }[] = [
  { id: 'food', name: 'Agriculture & food products' },
  { id: 'textiles', name: 'Textiles & garments' },
  { id: 'pharma', name: 'Pharmaceuticals' },
  { id: 'engineering', name: 'Engineering & automotive' },
  { id: 'chemicals', name: 'Chemicals' },
  { id: 'handicrafts', name: 'Handicrafts & wooden articles' },
];

export const indiaCommon: Requirement[] = [
  { id: 'in-iec', title: 'Importer-Exporter Code (IEC)', topic: 'Documentation', type: 'mandatory', authority: 'DGFT', url: 'https://www.dgft.gov.in/' },
  { id: 'in-ad', title: 'AD code registration at the port of export', topic: 'Documentation', type: 'mandatory', authority: 'CBIC / ICEGATE', url: 'https://www.icegate.gov.in/' },
  { id: 'in-rcmc', title: 'Registration-cum-Membership Certificate (RCMC) from the relevant Export Promotion Council', topic: 'Documentation', type: 'recommended', authority: 'DGFT / EPCs', url: 'https://www.dgft.gov.in/', note: 'Required to avail Foreign Trade Policy benefits.' },
  { id: 'in-coo', title: 'Preferential Certificate of Origin to claim FTA tariff', topic: 'Documentation', type: 'mandatory', authority: 'DGFT e-CoO platform', url: 'https://www.trade.gov.in/', note: 'Mandatory only when claiming a preferential tariff.' },
  { id: 'in-gst', title: 'GST LUT / bond for zero-rated exports without IGST payment', topic: 'Documentation', type: 'guidance', authority: 'GSTN', url: 'https://www.gst.gov.in/' },
  { id: 'in-policy', title: 'Check ITC-HS export policy (free / restricted / prohibited)', topic: 'Restrictions', type: 'mandatory', authority: 'DGFT', url: 'https://www.dgft.gov.in/' },
];

export const indiaByCategory: Record<Category, Requirement[]> = {
  food: [
    { id: 'in-apeda', title: 'APEDA registration for scheduled agri/food products', topic: 'Documentation', type: 'mandatory', authority: 'APEDA', url: 'https://apeda.gov.in/' },
    { id: 'in-phyto', title: 'Phytosanitary certificate for plants and plant products', topic: 'SPS measures', type: 'mandatory', authority: 'Directorate of Plant Protection, Quarantine & Storage', url: 'https://ppqs.gov.in/' },
    { id: 'in-eic', title: 'Export Inspection Council certification where notified', topic: 'Testing & certification', type: 'recommended', authority: 'Export Inspection Council', url: 'https://eicindia.gov.in/' },
  ],
  textiles: [
    { id: 'in-epc-tex', title: 'RCMC from AEPC / TEXPROCIL / HEPC as relevant', topic: 'Documentation', type: 'recommended', authority: 'Textile EPCs', url: 'https://www.aepcindia.com/' },
  ],
  pharma: [
    { id: 'in-cdsco', title: 'CDSCO export NOC / manufacturing licence and WHO-GMP / COPP where required', topic: 'Testing & certification', type: 'mandatory', authority: 'CDSCO', url: 'https://cdsco.gov.in/' },
    { id: 'in-pharmexcil', title: 'RCMC from Pharmexcil', topic: 'Documentation', type: 'recommended', authority: 'Pharmexcil', url: 'https://pharmexcil.com/' },
  ],
  engineering: [
    { id: 'in-eepc', title: 'RCMC from EEPC India', topic: 'Documentation', type: 'recommended', authority: 'EEPC India', url: 'https://www.eepcindia.org/' },
  ],
  chemicals: [
    { id: 'in-chemexcil', title: 'Check SCOMET list for dual-use chemicals', topic: 'Restrictions', type: 'mandatory', authority: 'DGFT', url: 'https://www.dgft.gov.in/' },
  ],
  handicrafts: [
    { id: 'in-epch', title: 'RCMC from Export Promotion Council for Handicrafts', topic: 'Documentation', type: 'recommended', authority: 'EPCH', url: 'https://www.epch.in/' },
    { id: 'in-fumi', title: 'ISPM-15 treatment and marking for wooden packaging', topic: 'SPS measures', type: 'mandatory', authority: 'Directorate of Plant Protection, Quarantine & Storage', url: 'https://ppqs.gov.in/' },
  ],
};

type DestMap = { portal: { label: string; url: string }; items: Partial<Record<Category, Requirement[]>> };

const r = (id: string, title: string, topic: Topic, type: ReqType, authority: string, url: string, note?: string): Requirement => ({ id, title, topic, type, authority, url, note });

export const destinations: Record<string, DestMap> = {
  US: {
    portal: { label: 'U.S. Customs and Border Protection', url: 'https://www.cbp.gov/' },
    items: {
      food: [r('us-fda', 'FDA food facility registration and Prior Notice of imported food', 'SPS measures', 'mandatory', 'U.S. FDA', 'https://www.fda.gov/'), r('us-lbl', 'FDA food labelling rules (nutrition facts, allergens)', 'Labelling & packaging', 'mandatory', 'U.S. FDA', 'https://www.fda.gov/')],
      textiles: [r('us-ftc', 'Textile Fiber Products Identification Act labelling', 'Labelling & packaging', 'mandatory', 'Federal Trade Commission', 'https://www.ftc.gov/')],
      pharma: [r('us-drug', 'FDA drug establishment registration, listing and approval (NDA/ANDA)', 'Technical regulations', 'mandatory', 'U.S. FDA', 'https://www.fda.gov/')],
      engineering: [r('us-cpsc', 'Consumer product safety rules where applicable', 'Technical regulations', 'guidance', 'CPSC', 'https://www.cpsc.gov/')],
      chemicals: [r('us-tsca', 'TSCA import certification', 'Technical regulations', 'mandatory', 'U.S. EPA', 'https://www.epa.gov/')],
      handicrafts: [r('us-lacey', 'Lacey Act plant product declaration for wood items', 'Documentation', 'mandatory', 'USDA APHIS', 'https://www.aphis.usda.gov/')],
    },
  },
  DE: {
    portal: { label: 'EU Access2Markets', url: 'https://trade.ec.europa.eu/access-to-markets/en/home' },
    items: {
      food: [r('eu-food', 'EU food law, hygiene and maximum residue limits; official controls at border control posts', 'SPS measures', 'mandatory', 'European Commission', 'https://trade.ec.europa.eu/access-to-markets/en/home')],
      textiles: [r('eu-tex', 'Textile fibre name labelling (Regulation (EU) 1007/2011)', 'Labelling & packaging', 'mandatory', 'European Commission', 'https://trade.ec.europa.eu/access-to-markets/en/home'), r('eu-reach-a', 'REACH restricted substances in articles', 'Technical regulations', 'mandatory', 'ECHA', 'https://echa.europa.eu/')],
      pharma: [r('eu-ma', 'EU marketing authorisation and GMP; written confirmation for APIs', 'Technical regulations', 'mandatory', 'EMA / national authorities', 'https://www.ema.europa.eu/')],
      engineering: [r('eu-ce', 'CE marking under applicable directives (machinery, low voltage, EMC)', 'Testing & certification', 'mandatory', 'European Commission', 'https://trade.ec.europa.eu/access-to-markets/en/home')],
      chemicals: [r('eu-reach', 'REACH registration via an EU-based only representative; CLP labelling', 'Technical regulations', 'mandatory', 'ECHA', 'https://echa.europa.eu/')],
      handicrafts: [r('eu-timber', 'EU timber / deforestation due-diligence rules — check applicability', 'Restrictions', 'guidance', 'European Commission', 'https://trade.ec.europa.eu/access-to-markets/en/home')],
    },
  },
  GB: {
    portal: { label: 'UK Trade Tariff', url: 'https://www.trade-tariff.service.gov.uk/' },
    items: {
      food: [r('uk-ipaffs', 'Pre-notification via IPAFFS for controlled food and plant products', 'SPS measures', 'mandatory', 'DEFRA / FSA', 'https://www.gov.uk/')],
      textiles: [r('uk-tex', 'Textile products labelling and fibre composition regulations', 'Labelling & packaging', 'mandatory', 'Office for Product Safety & Standards', 'https://www.gov.uk/')],
      pharma: [r('uk-mhra', 'MHRA marketing authorisation', 'Technical regulations', 'mandatory', 'MHRA', 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency')],
      engineering: [r('uk-ukca', 'UKCA or CE marking for regulated products', 'Testing & certification', 'mandatory', 'OPSS', 'https://www.gov.uk/')],
      chemicals: [r('uk-reach', 'UK REACH obligations', 'Technical regulations', 'mandatory', 'Health and Safety Executive', 'https://www.hse.gov.uk/')],
      handicrafts: [r('uk-timber', 'UK Timber Regulations due diligence', 'Restrictions', 'guidance', 'Office for Product Safety & Standards', 'https://www.gov.uk/')],
    },
  },
  AE: {
    portal: { label: 'UAE Ministry of Industry & Advanced Technology', url: 'https://moiat.gov.ae/' },
    items: {
      food: [r('ae-food', 'Food product registration with the emirate food authority and Arabic labelling', 'Labelling & packaging', 'mandatory', 'Emirate food authorities / MoCCAE', 'https://www.moccae.gov.ae/')],
      textiles: [r('ae-tex', 'Labelling per UAE standards for textiles', 'Labelling & packaging', 'guidance', 'MoIAT', 'https://moiat.gov.ae/')],
      pharma: [r('ae-drug', 'Product registration with the UAE health/drug authority', 'Technical regulations', 'mandatory', 'UAE health authority', 'https://mohap.gov.ae/')],
      engineering: [r('ae-ecas', 'Emirates Conformity Assessment Scheme for regulated products', 'Testing & certification', 'mandatory', 'MoIAT', 'https://moiat.gov.ae/')],
      chemicals: [r('ae-chem', 'Import permit for regulated chemicals', 'Import licensing', 'mandatory', 'MoCCAE', 'https://www.moccae.gov.ae/')],
      handicrafts: [r('ae-hc', 'General product labelling and conformity guidance', 'Labelling & packaging', 'guidance', 'MoIAT', 'https://moiat.gov.ae/')],
    },
  },
  AU: {
    portal: { label: 'Australian Border Force', url: 'https://www.abf.gov.au/' },
    items: {
      food: [r('au-bicon', 'BICON import conditions and Imported Food Inspection Scheme', 'SPS measures', 'mandatory', 'Department of Agriculture, Fisheries and Forestry', 'https://bicon.agriculture.gov.au/'), r('au-fsanz', 'Australia New Zealand Food Standards Code labelling', 'Labelling & packaging', 'mandatory', 'FSANZ', 'https://www.foodstandards.gov.au/')],
      textiles: [r('au-care', 'Care labelling mandatory standard', 'Labelling & packaging', 'mandatory', 'ACCC', 'https://www.productsafety.gov.au/')],
      pharma: [r('au-tga', 'Inclusion in the Australian Register of Therapeutic Goods (ARTG)', 'Technical regulations', 'mandatory', 'TGA', 'https://www.tga.gov.au/')],
      engineering: [r('au-rcm', 'Electrical equipment safety (RCM) for in-scope products', 'Testing & certification', 'mandatory', 'Electrical regulators', 'https://www.productsafety.gov.au/')],
      chemicals: [r('au-aicis', 'Registration with AICIS for industrial chemicals', 'Technical regulations', 'mandatory', 'AICIS', 'https://www.industrialchemicals.gov.au/')],
      handicrafts: [r('au-bio', 'Biosecurity import conditions for wood, bamboo and plant material', 'SPS measures', 'mandatory', 'DAFF', 'https://bicon.agriculture.gov.au/')],
    },
  },
  JP: {
    portal: { label: 'Japan Customs', url: 'https://www.customs.go.jp/english/' },
    items: {
      food: [r('jp-fsa', 'Food Sanitation Act import notification', 'SPS measures', 'mandatory', 'MHLW', 'https://www.mhlw.go.jp/english/'), r('jp-pq', 'Plant quarantine inspection', 'SPS measures', 'mandatory', 'MAFF Plant Protection Station', 'https://www.maff.go.jp/pps/')],
      textiles: [r('jp-hgql', 'Household Goods Quality Labelling Act', 'Labelling & packaging', 'mandatory', 'Consumer Affairs Agency', 'https://www.caa.go.jp/en/')],
      pharma: [r('jp-pmda', 'Marketing approval through PMDA', 'Technical regulations', 'mandatory', 'PMDA', 'https://www.pmda.go.jp/english/')],
      engineering: [r('jp-pse', 'PSE marking for electrical appliances in scope', 'Testing & certification', 'mandatory', 'METI', 'https://www.meti.go.jp/english/')],
      chemicals: [r('jp-cscl', 'Chemical Substances Control Law notification', 'Technical regulations', 'mandatory', 'METI / MHLW / MOE', 'https://www.meti.go.jp/english/')],
      handicrafts: [r('jp-wood', 'Plant quarantine for wooden articles', 'SPS measures', 'recommended', 'MAFF', 'https://www.maff.go.jp/pps/')],
    },
  },
  KR: {
    portal: { label: 'Korea Customs Service', url: 'https://www.customs.go.kr/english/' },
    items: {
      food: [r('kr-mfds', 'Imported food report to MFDS', 'SPS measures', 'mandatory', 'MFDS', 'https://www.mfds.go.kr/eng/')],
      textiles: [r('kr-kc', 'KC safety certification for children’s products and labelling', 'Testing & certification', 'recommended', 'KATS', 'https://www.kats.go.kr/en/')],
      pharma: [r('kr-drug', 'MFDS product approval', 'Technical regulations', 'mandatory', 'MFDS', 'https://www.mfds.go.kr/eng/')],
      engineering: [r('kr-kcm', 'KC mark for in-scope products', 'Testing & certification', 'mandatory', 'KATS', 'https://www.kats.go.kr/en/')],
      chemicals: [r('kr-reach', 'K-REACH registration', 'Technical regulations', 'mandatory', 'Ministry of Environment', 'https://eng.me.go.kr/')],
      handicrafts: [r('kr-pq', 'Plant quarantine for wooden articles', 'SPS measures', 'recommended', 'APQA', 'https://www.qia.go.kr/')],
    },
  },
  SG: {
    portal: { label: 'Singapore Customs', url: 'https://www.customs.gov.sg/' },
    items: {
      food: [r('sg-sfa', 'SFA import licence and permit for food', 'Import licensing', 'mandatory', 'Singapore Food Agency', 'https://www.sfa.gov.sg/')],
      pharma: [r('sg-hsa', 'HSA product registration', 'Technical regulations', 'mandatory', 'Health Sciences Authority', 'https://www.hsa.gov.sg/')],
      engineering: [r('sg-cps', 'Safety Mark for controlled goods', 'Testing & certification', 'mandatory', 'Enterprise Singapore', 'https://www.enterprisesg.gov.sg/')],
      chemicals: [r('sg-nea', 'Hazardous substances licensing', 'Import licensing', 'mandatory', 'NEA', 'https://www.nea.gov.sg/')],
      textiles: [r('sg-tex', 'General consumer protection labelling', 'Labelling & packaging', 'guidance', 'Enterprise Singapore', 'https://www.enterprisesg.gov.sg/')],
      handicrafts: [r('sg-hc', 'General import requirements', 'Documentation', 'guidance', 'Singapore Customs', 'https://www.customs.gov.sg/')],
    },
  },
  CH: {
    portal: { label: 'Swiss Federal Office for Customs and Border Security', url: 'https://www.bazg.admin.ch/' },
    items: {
      food: [r('ch-food', 'Swiss food law requirements (largely aligned with EU)', 'SPS measures', 'mandatory', 'FSVO', 'https://www.blv.admin.ch/')],
      pharma: [r('ch-sm', 'Swissmedic authorisation', 'Technical regulations', 'mandatory', 'Swissmedic', 'https://www.swissmedic.ch/')],
      chemicals: [r('ch-chemo', 'Swiss Chemicals Ordinance obligations', 'Technical regulations', 'mandatory', 'FOPH / FOEN', 'https://www.bag.admin.ch/')],
      engineering: [r('ch-ce', 'Conformity assessment (CE recognised for many products)', 'Testing & certification', 'mandatory', 'SECO', 'https://www.seco.admin.ch/')],
      textiles: [r('ch-tex', 'Product labelling guidance', 'Labelling & packaging', 'guidance', 'SECO', 'https://www.seco.admin.ch/')],
      handicrafts: [r('ch-hc', 'General import requirements', 'Documentation', 'guidance', 'BAZG', 'https://www.bazg.admin.ch/')],
    },
  },
  MU: {
    portal: { label: 'Mauritius Revenue Authority — Customs', url: 'https://www.mra.mu/' },
    items: {
      food: [r('mu-food', 'Food import clearance by health authorities — verify current procedure', 'SPS measures', 'mandatory', 'Ministry of Health and Wellness', 'https://health.govmu.org/')],
      pharma: [r('mu-pb', 'Registration with the Pharmacy Board', 'Technical regulations', 'mandatory', 'Ministry of Health and Wellness', 'https://health.govmu.org/')],
    },
  },
};

export const destinationOptions = Object.keys(destinations);
