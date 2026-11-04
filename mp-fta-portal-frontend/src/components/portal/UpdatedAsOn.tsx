import { CalendarCheck } from 'lucide-react';
import { updatedAsOnLabel } from '@/lib/updatedAsOn';
import { cn } from '@/lib/utils';

/** Small "Updated as on <date>" tag placed with every block of tariff rates. */
export function UpdatedAsOn({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary', className)}>
      <CalendarCheck className="h-3.5 w-3.5" />
      {updatedAsOnLabel()}
    </span>
  );
}
