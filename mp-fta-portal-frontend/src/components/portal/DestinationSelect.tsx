import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DestinationCountry } from '@/services/rateCheck';

interface Props {
  value: string;
  onChange: (code: string) => void;
  countries?: DestinationCountry[];
  isLoading: boolean;
  isError: boolean;
  ariaLabel?: string;
}

/** Destination dropdown fed only by countries with a supplied tariff schedule. */
export function DestinationSelect({ value, onChange, countries, isLoading, isError, ariaLabel = 'Destination country' }: Props) {
  const ready = !!countries?.length;
  const placeholder = isLoading ? 'Loading countries…' : isError || !ready ? 'Countries unavailable' : 'Destination';
  return (
    <Select value={ready ? value : undefined} onValueChange={(v) => { if (v) onChange(v); }} disabled={!ready}>
      <SelectTrigger aria-label={ariaLabel}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent className="max-h-72">
        {countries?.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
