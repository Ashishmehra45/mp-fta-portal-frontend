import { useState } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { SupportRequestForm } from '@/components/portal/SupportRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sectors } from '@/data/products';
import { countries } from '@/data/countries';
import { BadgeCheck, ExternalLink, ShieldQuestion, ShieldX } from 'lucide-react';
import { TenderFeed } from '@/components/portal/TenderFeed';
import { Link } from 'react-router-dom';

type OppType = 'all' | 'enquiry' | 'directory' | 'tender' | 'fair' | 'event' | 'mission';

const channels: { name: string; type: Exclude<OppType, 'all'>; url: string; sectors: string[]; text: string }[] = [
  { name: 'Indian Trade Portal', type: 'directory', url: 'https://www.indiantradeportal.in/', sectors: ['all'], text: 'Market information, partner tariffs and trade leads published by the Department of Commerce and FIEO.' },
  { name: 'DGFT — Trade Connect / Trade.gov.in', type: 'enquiry', url: 'https://www.trade.gov.in/', sectors: ['all'], text: 'Official single-window platform with exporter services and mission connects.' },
  { name: 'Federation of Indian Export Organisations', type: 'event', url: 'https://www.fieo.org/', sectors: ['all'], text: 'Buyer-seller meets, trade delegations and export promotion events.' },
  { name: 'India Trade Promotion Organisation', type: 'fair', url: 'https://www.indiatradefair.com/', sectors: ['all'], text: 'Calendar of trade fairs in India and Indian participation abroad.' },
  { name: 'APEDA', type: 'event', url: 'https://apeda.gov.in/', sectors: ['agriculture', 'food'], text: 'Agri-export promotion, buyer-seller meets and international fairs.' },
  { name: 'Pharmexcil', type: 'mission', url: 'https://pharmexcil.com/', sectors: ['pharma'], text: 'Pharma trade delegations and regulatory market information.' },
  { name: 'AEPC', type: 'fair', url: 'https://www.aepcindia.com/', sectors: ['textiles'], text: 'Apparel fairs and buyer-seller meets.' },
  { name: 'EPCH', type: 'fair', url: 'https://www.epch.in/', sectors: ['handicrafts'], text: 'Handicraft fairs including virtual and physical buyer meetings.' },
  { name: 'EEPC India', type: 'mission', url: 'https://www.eepcindia.org/', sectors: ['engineering', 'auto'], text: 'Engineering export promotion, trade missions and exhibitions.' },
  { name: 'UN Global Marketplace', type: 'tender', url: 'https://www.ungm.org/', sectors: ['all'], text: 'Procurement notices from UN agencies.' },
  { name: 'World Bank project procurement', type: 'tender', url: 'https://projects.worldbank.org/en/projects-operations/procurement', sectors: ['all'], text: 'Procurement notices for World Bank-financed projects.' },
];

const typeLabel: Record<Exclude<OppType, 'all'>, string> = { enquiry: 'Buyer enquiries', directory: 'Verified directories', tender: 'International tenders', fair: 'Trade fairs', event: 'Export promotion events', mission: 'Trade missions' };

const Buyers = () => {
  const [type, setType] = useState<OppType>('all');
  const [sector, setSector] = useState('all');
  const [dest, setDest] = useState('all');

  const list = channels.filter((c) => (type === 'all' || c.type === type) && (sector === 'all' || c.sectors.includes('all') || c.sectors.includes(sector)));

  return (
    <PortalLayout>
      <PageHeader eyebrow="Free Trade Agreements · Tenders" title="Tender Intelligence" description="Find buyers, tenders, fairs and trade missions in Free Trade Agreement partner markets through authorised channels. The portal never publishes unverified buyer names or enquiries." />
      <div className="container py-8 space-y-6">
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1"><Label>Opportunity type</Label>
            <Select value={type} onValueChange={(v) => setType(v as OppType)}><SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All types</SelectItem>{Object.entries(typeLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Sector</Label>
            <Select value={sector} onValueChange={setSector}><SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All sectors</SelectItem>{sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Destination</Label>
            <Select value={dest} onValueChange={setDest}><SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-64"><SelectItem value="all">All destinations</SelectItem>{countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent></Select></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <TenderFeed />

            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
                <span>Check a buyer against sanctions and denied-party lists.</span>
                <Link to="/restricted-party-screening" className="font-medium text-primary hover:underline">Restricted Party Screening →</Link>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Buyer verification indicators</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-start gap-2"><BadgeCheck className="h-4 w-4 text-accent mt-0.5" /><span><span className="font-medium">Verified</span> — identity confirmed by an authorised body (EPC, embassy or partner agency).</span></p>
                <p className="flex items-start gap-2"><ShieldQuestion className="h-4 w-4 text-warning mt-0.5" /><span><span className="font-medium">Unverified</span> — received but not yet checked. Do not ship or pay advances.</span></p>
                <p className="flex items-start gap-2"><ShieldX className="h-4 w-4 text-destructive mt-0.5" /><span><span className="font-medium">Reported</span> — flagged as suspicious by users or officials.</span></p>
              </CardContent>
            </Card>
            <DataNotice variant="advisory">Always confirm a buyer's identity through official channels before sharing samples, prices or bank details.</DataNotice>
          </aside>
        </div>

        <Card id="report">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Report an enquiry or submit an opportunity</CardTitle></CardHeader>
          <CardContent>
            <SupportRequestForm
              types={[{ value: 'buyer_report', label: 'Report a suspicious enquiry' }, { value: 'opportunity_submission', label: 'Submit an opportunity for verification' }]}
              submitLabel="Send report"
            />
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default Buyers;
