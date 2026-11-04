import { cn } from '@/lib/utils';

const flagUrl = (code: string) => `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${code.toLowerCase()}.svg`;

/** Partner-country flags for an agreement (first few, then "+n"). */
export function AgreementFlags({ codes, max = 3, className, size = 'md' }: { codes: string[]; max?: number; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const shown = codes.includes('EU') ? ['EU'] : codes.slice(0, max);
  const extra = codes.includes('EU') ? 0 : codes.length - shown.length;
  const h = size === 'sm' ? 'h-3.5' : size === 'lg' ? 'h-7' : 'h-5';
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {shown.map((c) => (
        <img key={c} src={flagUrl(c)} alt="" className={cn(h, 'w-auto rounded-[2px] shadow-sm ring-1 ring-border')} loading="lazy" />
      ))}
      {extra > 0 && <span className="text-xs text-muted-foreground">+{extra}</span>}
    </span>
  );
}
