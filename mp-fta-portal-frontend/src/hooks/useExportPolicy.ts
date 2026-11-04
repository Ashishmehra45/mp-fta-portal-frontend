import { useQuery } from '@tanstack/react-query';
import { getExportPolicy, ExportPolicyRecord, ExportPolicyResponse } from '@/services/intgrowApi';

export type { ExportPolicyRecord, ExportPolicyResponse };

// India Export Policy applies when the exporting OR origin country is India.
export function isIndiaExport(...countries: (string | undefined)[]): boolean {
  return countries.some((c) => {
    if (!c) return false;
    const v = c.trim().toLowerCase();
    return v === 'ind' || v === 'in' || v === 'india';
  });
}

export function useExportPolicy(hsCode?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['india-export-policy', hsCode],
    queryFn: () => getExportPolicy(hsCode!),
    enabled: enabled && !!hsCode && hsCode.replace(/\D/g, '').length >= 2,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
