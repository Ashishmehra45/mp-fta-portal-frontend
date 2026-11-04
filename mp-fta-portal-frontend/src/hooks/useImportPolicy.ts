import { useQuery } from '@tanstack/react-query';
import { getImportPolicy, ImportPolicyRecord, ImportPolicyResponse } from '@/services/intgrowApi';

export type { ImportPolicyRecord, ImportPolicyResponse };

// India Import Policy applies only when the importing country is India.
export function isIndiaImport(impCountry?: string): boolean {
  if (!impCountry) return false;
  const v = impCountry.trim().toLowerCase();
  return v === 'ind' || v === 'in' || v === 'india';
}

export function useImportPolicy(hsCode?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['india-import-policy', hsCode],
    queryFn: () => getImportPolicy(hsCode!),
    enabled: enabled && !!hsCode && hsCode.replace(/\D/g, '').length >= 2,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
