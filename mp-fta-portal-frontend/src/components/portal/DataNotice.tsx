import { AlertTriangle, FlaskConical, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Variant = 'demo' | 'unavailable' | 'advisory' | 'source';

const styles: Record<Variant, { icon: typeof Info; cls: string; label: string }> = {
  demo: { icon: FlaskConical, cls: 'border-warning/40 bg-warning-soft text-foreground', label: 'Demonstration data' },
  unavailable: { icon: AlertTriangle, cls: 'border-warning/40 bg-warning-soft text-foreground', label: 'Data unavailable — verification required' },
  advisory: { icon: ShieldAlert, cls: 'border-primary/25 bg-primary-soft text-foreground', label: 'Advisory only' },
  source: { icon: Info, cls: 'border-border bg-muted text-foreground', label: 'Source' },
};

export function DataNotice({ variant, title, children, className }: { variant: Variant; title?: string; children?: ReactNode; className?: string }) {
  const s = styles[variant];
  const Icon = s.icon;
  return (
    <div role="note" className={cn('flex gap-3 rounded-md border px-4 py-3 text-sm', s.cls, className)}>
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', variant === 'advisory' ? 'text-primary' : variant === 'source' ? 'text-muted-foreground' : 'text-warning')} />
      <div className="space-y-0.5">
        <p className="font-semibold">{title ?? s.label}</p>
        {children && <div className="text-muted-foreground leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-sm border border-warning/40 bg-warning-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warning', className)}>
      <FlaskConical className="h-3 w-3" /> Demo data
    </span>
  );
}
