import { Link, useParams } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAgreement, statusLabel, formatDate, agreementCategory, categorySingular } from '@/data/agreements';
import { statusBadgeClass } from './Agreements';
import NotFound from './NotFound';
import { ExternalLink } from 'lucide-react';
import { AgreementFlags } from '@/components/portal/AgreementFlags';

const AgreementDetail = () => {
  const { id } = useParams();
  const a = id ? getAgreement(id) : undefined;
  if (!a) return <NotFound />;

  const operational = a.status === 'in_force';

  return (
    <PortalLayout>
      <PageHeader
        eyebrow={`${categorySingular[agreementCategory(a)]} · ${a.type}`}
        title={a.name}
        crumbs={[{ label: 'Free Trade Agreements', to: '/trade-agreements' }, { label: a.shortName }]}
        description={<><AgreementFlags codes={a.partnerCodes} max={6} size="lg" className="mb-3 flex" /><span className="block">{a.summary}</span></>}
        actions={
          <>
            <Button asChild><Link to={`/fta-benefit-finder?dest=${a.partnerCodes[0]}`}>Check a product</Link></Button>
            <Button variant="outline" asChild><a href={a.officialSource.url} target="_blank" rel="noreferrer">Official source <ExternalLink className="ml-2 h-4 w-4" /></a></Button>
          </>
        }
      />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {!operational && (
            <DataNotice variant="unavailable" title={statusLabel[a.status]}>
              {a.statusNote ?? 'This agreement is not operational. Preferential tariffs cannot be claimed.'}
            </DataNotice>
          )}
          <Card>
            <CardHeader><CardTitle className="text-lg">Product-specific tariff schedules</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <DataNotice variant="unavailable">
                Validated tariff schedules, phase-out staging and exclusion lists are not yet loaded for this agreement. Use the Global Duty Calculator for live line-level rates.
              </DataNotice>
              {operational && <Button variant="outline" asChild><Link to="/tariff-savings-calculator">Open Global Duty Calculator</Link></Button>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Rules of origin</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {a.origin ? (
                <>
                  <p><span className="font-medium">General rule: </span>{a.origin.general}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Value content</p><p className="font-semibold">{a.origin.valueContentThreshold ? `${a.origin.valueContentThreshold}%` : 'Product-specific'}</p></div>
                    <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Tariff shift</p><p className="font-semibold">{a.origin.tariffShift ?? 'See agreement'}</p></div>
                    <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Cumulation</p><p className="font-semibold">{a.origin.cumulation ? 'Provided' : 'Not provided'}</p></div>
                  </div>
                  <p><span className="font-medium">Certificate of origin: </span>{a.origin.certificate}</p>
                  <p className="text-muted-foreground">Product-specific rules can override the general rule. Check the PSR annex for your HS line.</p>
                  <Button variant="outline" asChild><Link to={`/rules-of-origin?agreement=${a.id}`}>Open Rules of Origin Advisor</Link></Button>
                </>
              ) : (
                <DataNotice variant="unavailable">Origin rules summary not loaded for this agreement.</DataNotice>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Regulatory and documentation resources</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><a className="text-primary hover:underline" href="https://www.commerce.gov.in/" target="_blank" rel="noreferrer">Department of Commerce — agreement texts ↗</a></li>
                <li><a className="text-primary hover:underline" href="https://www.dgft.gov.in/" target="_blank" rel="noreferrer">DGFT — certificate of origin and notifications ↗</a></li>
                <li><a className="text-primary hover:underline" href="https://www.indiantradeportal.in/" target="_blank" rel="noreferrer">Indian Trade Portal — partner tariffs and SPS/TBT measures ↗</a></li>
                <li><Link className="text-primary hover:underline" to={`/compliance-navigator?dest=${a.partnerCodes[0]}`}>Market access and compliance navigator</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <aside className="lg:col-span-4">
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm">
              <div><p className="text-xs text-muted-foreground">Status</p><Badge className={statusBadgeClass[a.status]}>{statusLabel[a.status]}</Badge></div>
              <div><p className="text-xs text-muted-foreground">Partner countries</p><p>{a.partners.join(', ')}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Signed</p><p className="font-mono">{formatDate(a.signed)}</p></div>
                <div><p className="text-xs text-muted-foreground">Implementation</p><p className="font-mono">{formatDate(a.inForce)}</p></div>
              </div>
              {a.statusNote && <p className="text-muted-foreground">{a.statusNote}</p>}
              <div><p className="text-xs text-muted-foreground">Official source</p><a href={a.officialSource.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{a.officialSource.label} ↗</a></div>
              <div><p className="text-xs text-muted-foreground">Last verified</p><p>{a.lastVerified ?? 'Pending official verification'}</p></div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PortalLayout>
  );
};

export default AgreementDetail;
