import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getModule } from '@/config/modules';
import { branding, leaders } from '@/config/branding';
import pmCm from '@/assets/pm-cm-cutout.png';
import { vyaparSetu } from '@/config/vyaparSetu';
import { mpExportSource } from '@/data/mpExports';
import { agreements, agreementCategory } from '@/data/agreements';
import { AgreementFlags } from '@/components/portal/AgreementFlags';
import heroVideo from '@/assets/mp-fta-video.mp4.asset.json';
import heroPoster from '@/assets/mp-fta-video-poster.jpg.asset.json';
import { fmtInrCr, fmtPct, fmtUsdBn, mpShareOfIndia, mpTotalInrCr, mpTotalUsdMn, stateRank } from '@/lib/exportStats';
import { cn } from '@/lib/utils';
import { AutoPlayVideo } from '@/components/portal/AutoPlayVideo';
import { ProductSuggestions } from '@/components/portal/ProductSuggestions';
import { formToQuery, suggestProducts } from '@/lib/productSuggest';
import { ArrowRight, ExternalLink, Lock, Mail, Phone, Search } from 'lucide-react';

/** The six services shown on the home page — everything else stays in the menus. */
const services: { id: string; text: string }[] = [
  { id: 'fta-finder', text: 'Compare the normal customs duty with the lower FTA duty for your product.' },
  { id: 'calculator', text: 'Work out your FTA duty savings on a shipment with live tariff data.' },
  { id: 'rules-of-origin', text: 'Check whether your product qualifies for FTA benefits.' },
  { id: 'market-opportunities', text: 'Find FTA partner markets where your product sells best.' },
  { id: 'mp-export', text: 'District products matched to FTA partner markets.' },
  { id: 'knowledge', text: 'Step-by-step guides to claiming FTA benefits.' },
];

/** India's Free Trade Agreements in force, shown as quick links in the hero. */
/** Latest FTAs in force (agreements are already sorted newest first); the two newest are highlighted. */
const heroFtas = agreements.filter((a) => a.status === 'in_force' && agreementCategory(a) === 'fta').slice(0, 5);
const highlighted = new Set(heroFtas.slice(0, 2).map((a) => a.id));

function LeaderCard({ leader, className, primary }: { leader: (typeof leaders)[number]; className?: string; primary?: boolean }) {
  return (
    <figure className={cn('overflow-hidden rounded-lg bg-card text-card-foreground shadow-raised', className)}>
      <div className="tricolour-rule h-1" aria-hidden />
      <div className="aspect-square overflow-hidden bg-primary-soft">
        <img src={leader.photo} alt={leader.name} className="h-full w-full object-cover object-top" loading="eager" />
      </div>
      <figcaption className="px-3 py-3 text-center">
        <p className={cn('font-display font-semibold leading-tight text-primary', primary ? 'text-lg' : 'text-sm')}>{leader.name}</p>
        <p className={cn('mt-1 leading-snug text-muted-foreground', primary ? 'text-sm' : 'text-xs')}>{leader.title}</p>
      </figcaption>
    </figure>
  );
}

function SectionTitle({ eyebrow, title, className }: { eyebrow: string; title: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 className="mt-1 text-3xl font-semibold md:text-4xl">{title}</h2>
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestions = useMemo(() => suggestProducts(query, 6), [query]);
  const goFinder = (q: string) => navigate(`/fta-benefit-finder?q=${encodeURIComponent(q)}`);
  const rank = stateRank('usdMn2026Ytd');

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/fta-benefit-finder${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <PortalLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-strong text-primary-foreground">
        <div className="container relative py-8 sm:py-12 md:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">

            <div className="text-center">
              <p className="text-sm font-medium text-primary-foreground/75">
                Madhya Pradesh Free Trade Agreement (FTA) Portal · {branding.departmentShort}
              </p>
              <h1 className="mt-4 text-[1.9rem] font-semibold leading-tight text-balance sm:text-5xl xl:text-6xl">
                From Madhya Pradesh to Global Markets - <span className="text-saffron">Export with FTA Benefits</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg text-primary-foreground/80">
                Helping Madhya Pradesh exporters reduce tariff costs, unlock global market opportunities, and grow exports through India’s Free Trade Agreements.
              </p>

              <form onSubmit={onSearch} className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-lg bg-card p-2 shadow-raised sm:flex-row" role="search">
                <label htmlFor="hero-search" className="sr-only">Product name, HS code or country</label>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="hero-search"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSuggestOpen(true); }}
                    onFocus={() => setSuggestOpen(true)}
                    onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setSuggestOpen(false); }}
                    placeholder="Product, HS code or country"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={suggestOpen && suggestions.length > 0}
                    aria-controls="hero-suggestions"
                    className="h-12 border-0 pl-10 text-base text-foreground shadow-none focus-visible:ring-0"
                  />
                  {suggestOpen && suggestions.length > 0 && (
                    <div id="hero-suggestions" className="absolute left-0 right-0 z-30 mt-3 max-h-80 overflow-y-auto rounded-md border bg-popover text-left text-popover-foreground shadow-raised">
                      <ProductSuggestions
                        suggestions={suggestions}
                        onPickCode={(hs) => goFinder(hs)}
                        onPickForm={(f) => goFinder(formToQuery(f))}
                      />
                    </div>
                  )}
                </div>
                <Button type="submit" size="lg" className="h-12 px-6 text-base">Check FTA benefit</Button>
              </form>

              <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-primary-foreground/70">India's latest FTAs in force:</span>
                {heroFtas.map((a) => (
                  <Link key={a.id} to={`/trade-agreements/${a.id}`} className={cn('rounded-full border px-3 py-1 text-sm transition-colors', highlighted.has(a.id) ? 'border-saffron bg-saffron font-semibold text-saffron-foreground hover:bg-saffron/90' : 'border-primary-foreground/25 hover:bg-primary-foreground/10')}>
                    <AgreementFlags codes={a.partnerCodes} size="sm" className="mr-1.5 align-[-2px]" />{a.shortName}
                  </Link>
                ))}
                <Link to="/trade-agreements" className="px-2 py-1 text-sm font-medium text-saffron hover:underline">All →</Link>
              </div>
            </div>

            <figure className="mx-auto w-full max-w-sm lg:max-w-[420px] lg:self-center">
              <img src={pmCm} alt={`${leaders[0].name} and ${leaders[1].name}`} className="w-full object-contain" loading="eager" />
              <div className="tricolour-rule h-0.5" aria-hidden />
              <figcaption className="mt-2 grid grid-cols-[57%_43%] text-center">
                <div>
                  <p className="font-display text-sm font-semibold leading-tight sm:text-base">{leaders[0].name}</p>
                  <p className="text-[11px] text-primary-foreground/75 sm:text-xs">{leaders[0].title}</p>
                </div>
                <div>
                  <p className="font-display text-[13px] font-semibold leading-tight sm:text-sm">{leaders[1].name}</p>
                  <p className="whitespace-nowrap text-[11px] text-primary-foreground/75 sm:text-xs">{leaders[1].title}</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="tricolour-rule h-1" aria-hidden />
      </section>

      {/* VIDEO */}
      <section className="container pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Watch</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Madhya Pradesh and Free Trade Agreements</h2>
          <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-card">
            <AutoPlayVideo
              className="aspect-video w-full"
              src={heroVideo.url}
              poster={heroPoster.url}
              controls
              playsInline
              preload="auto"
              loop
              aria-label="Madhya Pradesh Free Trade Agreement Portal video"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container py-16">
        <SectionTitle eyebrow="Free Trade Agreement tools" title="Use FTAs to grow your exports" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ id, text }) => {
            const m = getModule(id);
            if (!m) return null;
            return (
              <Link key={id} to={m.path} className="group flex gap-4 rounded-lg border bg-card p-6 transition-colors hover:border-primary">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                  <m.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-sans text-lg font-semibold group-hover:text-primary">
                    {m.short}
                    {m.comingSoon && <span className="ml-1 inline-block shrink-0 whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">Coming soon</span>}
                    {m.requiresLogin && <Lock className="h-4 w-4 text-muted-foreground" aria-label="Sign-in required" />}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MP EXPORT STRENGTH */}
      <section className="border-y bg-card">
        <div className="container py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionTitle eyebrow={`Madhya Pradesh exports · ${mpExportSource.fiscalYear}`} title="MP's export strength to take into FTA markets" />
            <Button variant="outline" asChild><Link to="/mp-export-strength">See all statistics <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <dl className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { label: 'Total exports', value: fmtUsdBn(mpTotalUsdMn), sub: fmtInrCr(mpTotalInrCr) },
              { label: "Share of India's exports", value: fmtPct(mpShareOfIndia), sub: 'All principal commodities' },
              { label: 'Rank among states', value: `#${rank.rank}`, sub: `of ${rank.of} states & UTs, ${mpExportSource.stateYears.ytd}` },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border bg-background p-6">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-display text-4xl font-semibold text-primary">{s.value}</dd>
                <dd className="mt-1 text-sm text-muted-foreground">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">Source: {mpExportSource.label}.</p>
        </div>
      </section>

      {/* MP VYAPAR SETU */}
      <section className="container py-16">
        <div className="grid gap-8 rounded-xl border bg-saffron/5 p-8 md:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-saffron">Business for MP Entrepreneurs</p>
            <h2 className="mt-1 text-3xl font-semibold md:text-4xl">{vyaparSetu.name} <span className="text-saffron">· {vyaparSetu.hindi}</span></h2>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Meet verified international buyers in scheduled video meetings.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild><Link to="/vyapar-setu">Learn more <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" asChild>
                <a href={vyaparSetu.registerUrl} target="_blank" rel="noopener noreferrer">Register <ExternalLink className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
          <a href={vyaparSetu.partner.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center">
            <span className="text-sm text-muted-foreground">Programme partner</span>
            <img src={vyaparSetu.partner.logoUrl} alt={vyaparSetu.partner.name} className="h-14 w-auto dark:invert" loading="lazy" />
          </a>
        </div>
      </section>

      {/* HELP */}
      <section className="bg-primary text-primary-foreground">
        <div className="container flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Need help using an FTA?</h2>
            <p className="mt-2 text-primary-foreground/80">Questions on FTAs, certificates of origin or exports? Call the Export / ODOP helpline or write to us.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild>
              <a href={`tel:${branding.contactPhone.replace(/[^\d+]/g, '')}`}><Phone className="mr-2 h-4 w-4" />{branding.contactPhone}</a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
              <a href={`mailto:${branding.contactEmail}`}><Mail className="mr-2 h-4 w-4" />{branding.contactEmail}</a>
            </Button>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Index;
