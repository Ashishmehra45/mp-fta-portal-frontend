import { useQuery } from '@tanstack/react-query';
import { saveDutyCalculation, DutyCalculationRequest, SaveDutyResponse } from '@/services/intgrowApi';

export function useSaveDuty(request: DutyCalculationRequest | null, enabled: boolean = true) {
  return useQuery<SaveDutyResponse>({
    queryKey: ['saveDuty', request],
    queryFn: () => {
      if (!request) throw new Error('Request is required');
      console.log('[DutySaver Pro] Triggering save_duty API with enabled:', enabled, 'request:', JSON.stringify(request));
      return saveDutyCalculation(request);
    },
    enabled: enabled && !!request,
    staleTime: 0, // Always refetch fresh data for precision
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes for gc
    refetchOnMount: true,
    retry: 1,
  });
}
