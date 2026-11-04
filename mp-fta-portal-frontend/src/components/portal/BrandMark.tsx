import { branding } from '@/config/branding';
import { cn } from '@/lib/utils';

/** Government of MP / MPIDC logo with the portal name. */
export function BrandMark({ className, compact = false, labelClassName = 'hidden sm:block' }: { className?: string; compact?: boolean; labelClassName?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {branding.logoUrl ? (
        <span className="inline-flex shrink-0 flex-col items-center">
          <img
            src={branding.logoUrl}
            alt={`${branding.governmentName} · ${branding.departmentName}`}
            className="h-12 w-auto max-w-[70vw] object-contain sm:h-16"
          />
        </span>
      ) : (
        <div
          aria-hidden
          className="relative h-10 w-10 shrink-0 rounded-sm bg-primary text-primary-foreground grid place-items-center font-display font-semibold text-sm tracking-tight"
        >
          MP
          <span className="absolute -bottom-px left-1 right-1 h-[3px] bg-accent" />
        </div>
      )}
      {!compact && (
        <div className={cn('leading-tight border-l pl-3', labelClassName)}>
          <div className="font-display text-[15px] font-semibold text-foreground">Free Trade Agreement</div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Portal</div>
        </div>
      )}
    </div>
  );
}
