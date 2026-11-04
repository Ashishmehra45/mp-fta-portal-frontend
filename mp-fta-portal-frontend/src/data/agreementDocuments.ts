// Official agreement texts (PDF) supplied by the portal owner, hosted as CDN assets.
import aseanFramework from '@/assets/agreements/India_ASEAN_Framework.pdf.asset.json';
import aseanTig from '@/assets/agreements/India_ASEAN_Trade_in_Goods.pdf.asset.json';
import safta from '@/assets/agreements/India_SAFTA.pdf.asset.json';
import malaysia from '@/assets/agreements/India_Malaysia_CECA.pdf.asset.json';
import singapore from '@/assets/agreements/India_Singapore_CECA.pdf.asset.json';
import efta from '@/assets/agreements/India_EFTA_TEPA.pdf.asset.json';
import uae from '@/assets/agreements/India_UAE_CEPA.pdf.asset.json';
import japan from '@/assets/agreements/India_Japan_CEPA.pdf.asset.json';
import australia from '@/assets/agreements/India_Australia_ECTA.pdf.asset.json';
import koreaFull from '@/assets/agreements/India_Korea_CEPA_Full_English.pdf.asset.json';
import koreaPreamble from '@/assets/agreements/India_Korea_CEPA_Preamble.pdf.asset.json';
import mauritius from '@/assets/agreements/India_Mauritius_CECPA.pdf.asset.json';
import sriLanka from '@/assets/agreements/India_SriLanka_FTA.pdf.asset.json';
import apta from '@/assets/agreements/India_APTA.pdf.asset.json';
import chile from '@/assets/agreements/India_Chile_PTA_Expansion.pdf.asset.json';
import mercosur from '@/assets/agreements/India_Mercosur_PTA.pdf.asset.json';
import oman from '@/assets/agreements/India_Oman_CEPA.pdf.asset.json';
import newZealand from '@/assets/agreements/India_NewZealand_FTA.pdf.asset.json';
import uk from '@/assets/agreements/India_UK_CETA.pdf.asset.json';

export interface AgreementDocument { label: string; url: string; filename: string }

const doc = (label: string, a: { url: string; original_filename: string }): AgreementDocument => ({ label, url: a.url, filename: a.original_filename });

export const agreementDocuments: Record<string, AgreementDocument[]> = {
  'india-nz-fta': [doc('Agreement text', newZealand)],
  'india-oman-cepa': [doc('Agreement text', oman)],
  'india-uk-ceta': [doc('Agreement text', uk)],
  'asean-india-tig': [doc('Framework Agreement', aseanFramework), doc('Trade in Goods Agreement', aseanTig)],
  safta: [doc('Agreement text', safta)],
  'india-malaysia-ceca': [doc('Agreement text', malaysia)],
  'india-singapore-ceca': [doc('Agreement text', singapore)],
  'india-efta-tepa': [doc('Agreement text', efta)],
  'india-uae-cepa': [doc('Agreement text', uae)],
  'india-japan-cepa': [doc('Agreement text', japan)],
  'india-mauritius-cecpa': [doc('Agreement text', mauritius)],
  'india-australia-ecta': [doc('Agreement text', australia)],
  'india-korea-cepa': [doc('Full agreement (English)', koreaFull), doc('Preamble', koreaPreamble)],
  'india-sri-lanka-fta': [doc('Agreement text', sriLanka)],
  apta: [doc('Agreement text, rules of origin & concessions', apta)],
  'india-chile-pta': [doc('Expanded PTA (2017)', chile)],
  'india-mercosur-pta': [doc('Agreement text', mercosur)],
};
