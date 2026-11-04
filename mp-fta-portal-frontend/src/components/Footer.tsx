import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/portal/BrandMark';
import { branding, prototypeNotice } from '@/config/branding';
import { modules } from '@/config/modules';
import intgrowLogo from '@/assets/intgrow-logo.png';
import imGlobalLogo from '@/assets/im-global-logo.png.asset.json';

const official = [
  { label: 'Department of Commerce', url: 'https://www.commerce.gov.in/' },
  { label: 'Directorate General of Foreign Trade', url: 'https://www.dgft.gov.in/' },
  { label: 'Indian Trade Portal', url: 'https://www.indiantradeportal.in/' },
  { label: 'CBIC — Customs', url: 'https://www.cbic.gov.in/' },
  { label: 'MP Industrial Development Corporation', url: 'https://mpidc.mp.gov.in/' },
];

// Footer accepts legacy props for compatibility with older pages.
export function Footer(_props: { isLandingPage?: boolean } = {}) {
  const tools = modules.filter((m) => m.group === 'tools');
  const rest = modules.filter((m) => m.group !== 'tools');
  return (
    <footer className="border-t bg-card mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4 space-y-4">
          <BrandMark />
          <p className="text-sm text-muted-foreground max-w-sm">
            An initiative of the {branding.governmentName}, implemented by {branding.departmentName}. {branding.tagline}
          </p>
          <dl className="text-xs text-muted-foreground space-y-1">
            <div><dt className="inline font-medium text-foreground">Email: </dt><dd className="inline"><a href={`mailto:${branding.contactEmail}`} className="hover:text-primary">{branding.contactEmail}</a></dd></div>
            <div><dt className="inline font-medium text-foreground">{branding.helplineLabel}: </dt><dd className="inline">{branding.contactPhone}</dd></div>
            <div><dt className="inline font-medium text-foreground">MP Trade Portal: </dt><dd className="inline"><a href={branding.tradePortalUrl} target="_blank" rel="noreferrer" className="hover:text-primary">mptradeportal.org ↗</a></dd></div>
          </dl>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <a href="https://intgrow.co" target="_blank" rel="noreferrer" className="hover:opacity-80">
              <img src={intgrowLogo} alt="IntGrow" className="h-14 sm:h-16 w-auto" loading="lazy" />
            </a>
            <span className="text-lg font-semibold">&amp;</span>
            <img src={imGlobalLogo.url} alt="IM Global" className="h-14 sm:h-16 w-auto" loading="lazy" />
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-sans text-sm font-semibold mb-3">Free Trade Agreement tools</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {tools.map((m) => <li key={m.id}><Link to={m.path} className="hover:text-primary">{m.title}</Link>{m.comingSoon && <span className="ml-1 inline-block shrink-0 whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">Coming soon</span>}</li>)}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="font-sans text-sm font-semibold mb-3">FTA markets & resources</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {rest.map((m) => <li key={m.id}><Link to={m.path} className="hover:text-primary">{m.short}</Link>{m.comingSoon && <span className="ml-1 inline-block shrink-0 whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">Coming soon</span>}</li>)}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-sans text-sm font-semibold mb-3">Official resources</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {official.map((o) => (
              <li key={o.url}><a href={o.url} target="_blank" rel="noreferrer" className="hover:text-primary">{o.label} ↗</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 flex flex-col md:flex-row gap-2 justify-between text-xs text-muted-foreground">
          {prototypeNotice && <p>{prototypeNotice}</p>}
          <p>Tariff calculations powered by {branding.technologyPartner}. Results are estimates, not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
