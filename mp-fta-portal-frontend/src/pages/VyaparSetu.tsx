import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { MexicanCompanies } from '@/components/portal/MexicanCompanies';
import { Button } from '@/components/ui/button';
import { vyaparSetu as vs } from '@/config/vyaparSetu';
import { audiences } from '@/config/branding';
import {
  ArrowUpRight, CalendarClock, CheckCircle2, ClipboardList, Globe2, KeyRound, LayoutDashboard,
  Mail, MapPin, Phone, ShieldCheck, Users, Video,
} from 'lucide-react';

const featureIcons = [LayoutDashboard, Users, CalendarClock, Video];
const accessIcons = [Globe2, ClipboardList, CheckCircle2, ShieldCheck];
const p = vs.partner;

function ExternalButton({ href, children, variant = 'default' }: { href: string; children: React.ReactNode; variant?: 'default' | 'outline' | 'secondary' }) {
  return (
    <Button variant={variant} asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children} <ArrowUpRight className="ml-1.5 h-4 w-4" />
      </a>
    </Button>
  );
}

/** Mock of a meeting slot card — illustrative, shows how dual-time slots look. */
function SlotPreview() {
  const rows = [
    { ist: '18:30', other: '07:00', status: 'Confirmed', tone: 'bg-accent text-accent-foreground' },
    { ist: '19:10', other: '07:40', status: 'Requested', tone: 'bg-saffron text-saffron-foreground' },
    { ist: '19:50', other: '08:20', status: 'Open', tone: 'bg-muted text-muted-foreground' },
  ];
  return (
    <div className="rounded-lg bg-card p-5 text-card-foreground shadow-raised">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your slots · Day 1</p>
        <span className="text-xs text-muted-foreground">Illustration</span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.ist} className="flex items-center justify-between rounded-md border px-3 py-2.5">
            <div className="font-mono text-sm">
              <span className="font-semibold text-primary">{r.ist} IST</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="text-muted-foreground">{r.other} partner time</span>
            </div>
            <span className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${r.tone}`}>{r.status}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2 rounded-md bg-primary-soft px-3 py-2 text-xs text-primary">
        <Video className="h-4 w-4" /> Video link attached automatically once confirmed
      </div>
    </div>
  );
}

const VyaparSetu = () => (
  <PortalLayout>
    <PageHeader
      eyebrow="Business for MP Entrepreneurs"
      title={vs.name}
      description={`${vs.tagline} — register your company, get verified and book confirmed B2B meetings with international buyers and partners.`}
      actions={
        <div className="flex flex-wrap gap-2">
          <ExternalButton href={vs.registerUrl}>Register your company</ExternalButton>
          <ExternalButton href={vs.signInUrl} variant="outline">Company sign in</ExternalButton>
        </div>
      }
    />

    {/* Hero band */}
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="tricolour-rule h-1" aria-hidden />
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="font-display text-5xl font-semibold text-saffron md:text-6xl">{vs.hindi}</p>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">From Madhya Pradesh to the world’s meeting table</h2>
          <p className="mt-4 max-w-xl text-primary-foreground/80 leading-relaxed">
            One place to register, get vetted, share your availability and lock in confirmed video meetings with overseas
            importers — without working out time zones.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-primary-foreground/15 bg-primary-foreground/15">
            {vs.facts.map((f) => (
              <div key={f.k} className="bg-primary-strong p-4">
                <dt className="font-display text-2xl font-semibold">{f.k}</dt>
                <dd className="mt-1 text-xs text-primary-foreground/70 leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <SlotPreview />
      </div>
    </section>

    <div className="container space-y-14 py-12">
      {/* Programme partner */}
      <section aria-labelledby="partner-h" className="overflow-hidden rounded-lg border bg-card shadow-card">
        <div className="tricolour-rule h-1" aria-hidden />
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col justify-between gap-6 lg:border-r lg:pr-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron">Current programme partner</p>
              <img src={p.logoUrl} alt={p.name} className="mt-5 h-auto w-full max-w-xs dark:invert" loading="lazy" />
            </div>
            <div className="space-y-2 text-sm">
              <a href={`mailto:${p.contact.email}`} className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4 text-primary" />{p.contact.email}</a>
              {p.contact.phones.map((ph) => (
                <a key={ph} href={`tel:${ph.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" />{ph}</a>
              ))}
              <p className="flex gap-2 text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{p.contact.address}</p>
            </div>
          </div>
          <div>
            <h2 id="partner-h" className="text-2xl font-semibold">{p.name} <span className="text-muted-foreground">({p.short})</span></h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{p.about}</p>
            <div className="mt-5 rounded-md border-l-4 border-saffron bg-saffron/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-saffron">Live on {vs.name}</p>
              <p className="mt-1 font-semibold">{p.programme.name}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.programme.body}</p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.services.map((s) => (
                <li key={s} className="rounded-full border bg-primary-soft px-3 py-1 text-xs font-medium text-primary">{s}</li>
              ))}
            </ul>
            <div className="mt-6">
              <ExternalButton href={p.website} variant="outline">Visit mexicoindia.org</ExternalButton>
            </div>
          </div>
        </div>
      </section>

      <MexicanCompanies />

      <DataNotice variant="advisory" title={`Runs on ${vs.displayHost}`}>
        {vs.name} opens in a separate meeting platform with its own sign-in — your portal account is not used there.
        Company and programme data on the platform is shared by {p.short}. Sector-specific programmes and dates for MP
        entrepreneurs are announced by the programme secretariat.
      </DataNotice>

      {/* Steps */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">How it works</p>
        <h2 className="mt-1 text-3xl font-semibold">Four steps to a confirmed meeting</h2>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-4">
          {vs.steps.map((s, i) => (
            <li key={s.title} className="bg-card p-6">
              <span className="font-mono text-sm font-semibold text-saffron">0{i + 1}</span>
              <h3 className="mt-3 font-sans text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Inside the platform</p>
        <h2 className="mt-1 text-3xl font-semibold">What you get after approval</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vs.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <div key={f.title} className="rounded-lg border bg-card p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Access + registration */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="font-sans text-lg font-semibold">Who can access what</h2>
          </div>
          <ul className="divide-y">
            {vs.access.map((a, i) => {
              const Icon = accessIcons[i];
              return (
                <li key={a.who} className="flex gap-4 px-6 py-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-semibold">{a.who}</p>
                    <p className="text-sm text-muted-foreground">{a.can}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="font-sans text-lg font-semibold">Keep these ready to register</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {vs.registrationFields.map((f) => (
              <li key={f} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <ExternalButton href={vs.registerUrl}>Register now</ExternalButton>
            <ExternalButton href={vs.siteUrl} variant="outline">Visit {vs.displayHost}</ExternalButton>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="rounded-lg border bg-primary-soft p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Who it’s for</p>
        <h2 className="mt-1 text-2xl font-semibold">Built for the people who make MP’s exports</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {audiences.map((a) => (
            <span key={a} className="rounded-full border border-primary/20 bg-card px-3 py-1 text-sm">{a}</span>
          ))}
        </div>
      </section>
    </div>
  </PortalLayout>
);

export default VyaparSetu;
