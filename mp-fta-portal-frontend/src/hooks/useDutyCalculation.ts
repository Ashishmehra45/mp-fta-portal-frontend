import { useMutation } from '@tanstack/react-query';
import { calculateDuty, DutyCalculationRequest, DutyCalculationResponse } from '@/services/intgrowApi';

export function useDutyCalculation() {
  return useMutation({
    mutationFn: (request: DutyCalculationRequest) => calculateDuty(request),
  });
}

export type { DutyCalculationRequest, DutyCalculationResponse };
