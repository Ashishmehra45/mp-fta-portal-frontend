import { Link } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SupportRequestForm } from '@/components/portal/SupportRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, FileText, BadgeCheck, Globe2, ExternalLink } from 'lucide-react';

const guides = [
  {
    icon: BookOpen, title: 'Export guide: getting started',
    steps: ['Register your business and obtain an IEC from DGFT.', 'Register for GST and file an LUT for zero-rated exports.', 'Obtain an RCMC from the relevant Export Promotion Council.', 'Confirm your 8-digit ITC-HS code and export policy.', 'Appoint a freight forwarder and customs broker; register your AD code at the port.'],
  },
  {
    icon: FileText, title: 'FTA utilisation guide',
    steps: ['Check whether an agreement is in force with your destination.', 'Confirm that your exact tariff line receives a concession and at what rate.', 'Test your product against the agreement’s rules of origin.', 'Apply for a preferential Certificate of Origin on the DGFT e-CoO platform before shipment.', 'Share the certificate with your buyer so they can claim the preference at import.'],
  },
  {
    icon: BadgeCheck, title: 'Rules of origin explained',
    steps: ['Wholly obtained: goods entirely grown, mined, harvested or produced in India.', 'Change in tariff classification: imported inputs must change HS heading (CTH) or sub-heading (CTSH).', 'Value content: a minimum share of the price must come from originating materials and processing.', 'Cumulation: inputs from the partner country may count as originating.', 'Minimal operations such as packing or simple mixing generally do not confer origin.'],
  },
  {
    icon: Globe2, title: 'Market-specific compliance',
    steps: ['Identify mandatory registrations, standards and tests in the destination.', 'Check sanitary and phytosanitary rules for agri and food products.', 'Confirm labelling language and content requirements.', 'Plan certification and testing lead times into your delivery schedule.', 'Use the Compliance Navigator to build a downloadable checklist.'],
  },
];

const faqs = [
  { q: 'Does an FTA automatically reduce the duty on my product?', a: 'No. The agreement must be in force, your exact tariff line must receive a concession, and your product must meet the rules of origin. Your buyer claims the lower rate at import using your certificate of origin.' },
  { q: 'Are GST, VAT or anti-dumping duties waived under an FTA?', a: 'Generally no. FTAs reduce customs duty on qualifying goods. Domestic taxes in the importing country and trade remedies such as anti-dumping duties usually still apply.' },
  { q: 'Who issues the preferential certificate of origin?', a: 'Preferential certificates are issued through the DGFT e-CoO platform by notified agencies. This portal does not issue certificates.' },
  { q: 'Why do some results say “Data unavailable — verification required”?', a: 'The portal will not show a tariff rate or statistic unless it comes from a validated source. Where data is not yet integrated, it asks you to verify with the official source.' },
  { q: 'Do I need to sign in?', a: 'No. Every tool, including the Global Duty Calculator, is open to all without signing in.' },
  { q: 'Is the AI Trade Assistant’s answer official advice?', a: 'No. It summarises guidance and points to official sources. For binding decisions, consult customs authorities or an authorised trade expert.' },
];

const policyUpdates = [
  { label: 'DGFT — Notifications, public notices and trade notices', url: 'https://www.dgft.gov.in/' },
  { label: 'CBIC — Customs tariff notifications', url: 'https://www.cbic.gov.in/' },
  { label: 'Department of Commerce — Trade agreements and press releases', url: 'https://www.commerce.gov.in/' },
  { label: 'Indian Trade Portal — Partner-country tariffs and measures', url: 'https://www.indiantradeportal.in/' },
];

const Knowledge = () => (
  <PortalLayout>
    <PageHeader title="Knowledge and Support" eyebrow="Free Trade Agreements · Guidance" description="How to claim Free Trade Agreement benefits: practical guides, answers to common questions, official policy sources and a route to expert assistance." />
    <div className="container py-8 space-y-10">
      <section className="grid gap-4 md:grid-cols-2">
        {guides.map((g) => (
          <Card key={g.title}>
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><g.icon className="h-5 w-5 text-primary" />{g.title}</CardTitle></CardHeader>
            <CardContent><ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">{g.steps.map((s) => <li key={s}>{s}</li>)}</ol></CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="rounded-lg border bg-card px-4">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className={i === faqs.length - 1 ? 'border-b-0' : ''}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-semibold mb-4">Trade policy updates</h2>
          <Card><CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-3">Follow these official sources for notifications.</p>
            <ul className="space-y-2 text-sm">{policyUpdates.map((p) => <li key={p.url}><a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">{p.label}<ExternalLink className="h-3.5 w-3.5" /></a></li>)}</ul>
          </CardContent></Card>
        </div>
      </section>

      <section id="assist" className="scroll-mt-28">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Exporter assistance and referral</CardTitle>
            <p className="text-sm text-muted-foreground">Ask for help with FTA eligibility, origin documentation or market requirements, or request referral to an authorised trade expert.</p>
          </CardHeader>
          <CardContent>
            <SupportRequestForm
              types={[{ value: 'assistance', label: 'General assistance' }, { value: 'expert_referral', label: 'Referral to a trade expert' }, { value: 'data_correction', label: 'Report a data issue' }]}
              topics={['FTA eligibility', 'Rules of origin', 'Tariff savings', 'Market compliance', 'Export documentation', 'Buyer connections', 'Other']}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  </PortalLayout>
);

export default Knowledge;
