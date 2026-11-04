import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getUserInputFields, 
  getDynamicInputOptions,
  UserInputResponse,
  DynamicInputResponse 
} from '@/services/intgrowApi';

export interface UserInputValue {
  hsn_uid: string;
  field: string;
  value: string;
  uis_hsn_uid_type?: string;
}

export function useUserInputs(hsCode: string, importingCountryCode: string, exportingCountryCode: string, organizationCountryCode: string, enabled: boolean = true) {
  return useQuery<UserInputResponse>({
    // Include ALL country codes in query key to ensure proper cache invalidation
    queryKey: ['userInputs', hsCode, importingCountryCode, exportingCountryCode, organizationCountryCode],
    queryFn: () => getUserInputFields(hsCode, importingCountryCode, exportingCountryCode, organizationCountryCode),
    enabled: enabled && !!hsCode && !!importingCountryCode && hsCode.length >= 4,
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 5 * 60 * 1000, // garbage collect after 5 minutes
    refetchOnMount: true,
  });
}

export function useDynamicInputs() {
  return useMutation<DynamicInputResponse, Error, {
    hscode: string;
    imp: string;
    org: string;
    exp: string;
    ui_hsn_uid: string;
    uis_hsn_uid_type: string;
  }>({
    mutationFn: (params) => getDynamicInputOptions(params),
  });
}
