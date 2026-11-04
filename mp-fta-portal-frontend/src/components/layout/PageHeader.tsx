import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Clock, Lock } from 'lucide-react';
import { modules } from '@/config/modules';

interface Props {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  requiresLogin?: boolean;
  crumbs?: { label: string; to?: string }[];
}

export function PageHeader({ eyebrow, title, description, actions, requiresLogin, crumbs }: Props) {
  const { pathname } = useLocation();
  const comingSoon = modules.some((m) => m.comingSoon && (pathname === m.path || pathname.startsWith(m.path + '/')));
  return (
    <section className="border-b bg-card">
      <div className="container py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          {(crumbs ?? [{ label: title }]).map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {c.to ? <Link to={c.to} className="hover:text-primary">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
            </span>
          ))}
        </nav>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                {eyebrow}
                {requiresLogin && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-primary-soft px-1.5 py-0.5 text-[10px] text-primary">
                    <Lock className="h-3 w-3" /> Sign-in required
                  </span>
                )}
              </p>
            )}
            {comingSoon && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-warning">
                <Clock className="h-3.5 w-3.5" /> Coming soon
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground text-balance">{title}</h1>
            {description && <div className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">{description}</div>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        {comingSoon && (
          <p className="mt-5 rounded-md border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-foreground">
            <strong>Coming soon.</strong> This feature is still being prepared and is shown as a preview only. Use the{' '}
            <Link to="/fta-benefit-finder" className="font-semibold text-primary underline">FTA Benefit Finder</Link> or the{' '}
            <Link to="/tariff-savings-calculator" className="font-semibold text-primary underline">Global Duty Calculator</Link> today.
          </p>
        )}
      </div>
    </section>
  );
}
