import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { ScreeningCheck } from '@/components/portal/ScreeningCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, ExternalLink } from 'lucide-react';

const sourceLinks = [
  { label: 'Consolidated Screening List — International Trade Administration (trade.gov)', url: 'https://www.trade.gov/consolidated-screening-list' },
  { label: 'Consolidated Screening List API — data.trade.gov', url: 'https://data.trade.gov/consolidated_screening_list/v1/search' },
];

const lists = [
  'Department of Commerce, Bureau of Industry and Security: Denied Persons List, Entity List, Unverified List, Military End User List',
  'Department of State: Nonproliferation Sanctions, ITAR Debarred List',
  'Department of the Treasury, OFAC: Specially Designated Nationals (SDN) and other sanctions lists',
];

const RestrictedPartyScreening = () => (
  <PortalLayout>
    <PageHeader
      eyebrow="Free Trade Agreements · Buyer checks"
      title="Restricted Party Screening"
      description="Before you sign a deal under a Free Trade Agreement (FTA), check that your buyer, partner or consignee is not on a sanctions or denied-party list."
    />
    <div className="container py-8 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <ScreeningCheck />
      </div>
      <aside className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Database className="h-4 w-4 text-primary" />Data source</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Results come live from the <span className="font-medium">Consolidated Screening List</span> published by the U.S. Department of Commerce, International Trade Administration (ITA). It combines these lists:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">{lists.map((l) => <li key={l}>{l}</li>)}</ul>
            <ul className="space-y-2">
              {sourceLinks.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-primary hover:underline">{s.label}<ExternalLink className="mt-1 h-3 w-3 shrink-0" /></a></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <DataNotice variant="advisory">A name match can be a false positive, and no match is not a clearance. Confirm details on the official list and keep your usual buyer checks.</DataNotice>
      </aside>
    </div>
  </PortalLayout>
);

export default RestrictedPartyScreening;
