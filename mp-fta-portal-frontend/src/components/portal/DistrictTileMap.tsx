import { districts, type District, type Division } from '@/data/districts';
import { districtSectors, odopFor } from '@/data/odop';
import type { SectorId } from '@/data/products';
import { cn } from '@/lib/utils';

const divisionTone: Record<Division, string> = {
  Bhopal: 'bg-chart-1/15',
  Indore: 'bg-chart-2/15',
  Ujjain: 'bg-chart-3/15',
  Gwalior: 'bg-chart-4/15',
  Chambal: 'bg-chart-5/20',
  Jabalpur: 'bg-chart-2/25',
  Sagar: 'bg-chart-1/25',
  Rewa: 'bg-chart-3/25',
  Shahdol: 'bg-chart-4/25',
  Narmadapuram: 'bg-chart-5/30',
};

interface Props {
  selected?: string | null;
  onSelect?: (d: District) => void;
  division?: Division | 'all';
  sector?: SectorId | 'all';
  size?: 'sm' | 'md';
}

export function DistrictTileMap({ selected, onSelect, division = 'all', sector = 'all', size = 'md' }: Props) {
  const cols = 13;
  const rows = 7;
  return (
    <div
      role="group"
      aria-label="Schematic map of Madhya Pradesh districts"
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, auto)` }}
    >
      {districts.map((d) => {
        const dimmed =
          (division !== 'all' && d.division !== division) ||
          (sector !== 'all' && !districtSectors(d).includes(sector));
        const isSel = selected === d.name;
        const o = odopFor(d.name);
        return (
          <button
            key={d.name}
            type="button"
            onClick={() => onSelect?.(d)}
            style={{ gridColumnStart: d.col + 1, gridRowStart: d.row + 1 }}
            title={`${d.name} (${d.division} division)${o ? ` — ODOP: ${o.product}` : ' — no ODOP product listed'}`}
            aria-pressed={isSel}
            className={cn(
              'relative aspect-square rounded-[3px] border text-left transition-all focus-visible:z-10',
              size === 'md' ? 'p-1 text-[9px] sm:text-[10px] lg:text-[11px]' : 'p-0.5 text-[8px] sm:text-[9px]',
              divisionTone[d.division],
              'border-border hover:border-primary hover:shadow-card',
              dimmed && 'opacity-25',
              isSel && 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/30',
            )}
          >
            <span className="block leading-tight font-medium line-clamp-2 hyphens-auto break-normal">{d.name}</span>
            {o && !isSel && <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
