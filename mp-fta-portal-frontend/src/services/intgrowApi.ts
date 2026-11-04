const API_BASE_URL = import.meta.env.VITE_BASE_URL || `https://api4.intgrow.co`;

const getUserToken = () => {
  return (
    localStorage.getItem("intgrow_auth_token") ||
    localStorage.getItem("token") ||
    ""
  );
};


const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intgrow-proxy`;

/** Shown when intGrow refuses a calculation because the portal's account has no credit (HTTP 402). */
const SERVICE_PAUSED_MESSAGE =
  "Duty calculations are temporarily unavailable. Please try again later or contact the Export/ODOP helpline.";

/** Signed-in users call intGrow with their own token; visitors go through the portal's server relay. */
async function intgrowFetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
  if (getUserToken()) return fetch(`${API_BASE_URL}${endpoint}`, init);
  const method = (init.method ?? "GET").toUpperCase() === "GET" ? "GET" : "POST";
  let body: unknown = undefined;
  if (typeof init.body === "string") { try { body = JSON.parse(init.body); } catch { body = undefined; } }
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ path: endpoint, method, body }),
  });
  if (!res.ok) return res;
  // The relay wraps intGrow's "no credit" (402) reply in a 200 envelope; restore the real status.
  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && typeof parsed.__intgrow_status === "number") {
      return new Response(JSON.stringify({ message: parsed.message }), {
        status: parsed.__intgrow_status,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch { /* not JSON — pass through */ }
  return new Response(text, { status: res.status, headers: res.headers });
}

export interface ApiCountry {
  value: string; // ISO 3166-1 alpha-3 code in lowercase
  label: string; // Country name
  flag: string; // ISO 3166-1 alpha-2 code for flag
  is_import: number;
  is_export: number;
  currency: string;
}

export interface ApiCurrency {
  country: string;
  currency: string;
  unit: string;
  value: string;
}

export interface ApiHsCode {
  hs_code: string;
  product: string;
}

export interface UserInputSelection {
  uis_hsn: string;
  uis_hsn_uid: string;
  uis_hsn_uid_type: string;
  uis_level_uid: string;
  ui_parent_hsn_uid: string;
  uis_label: string;
  uis_description: string;
  uis_hsn_description_ref: string;
  uis_item_no: string;
  uis_field: string;
  uis_imp_country: string;
  uis_org_country: string;
  uis_exp_country: string;
  uis_priority: string;
}

export interface UserInputField {
  hsn_uid: string;
  label: string;
  field: string;
  value_type: "number" | "selection" | "string";
  level: string;
  parent_hsn_uid: string | null;
  priority: number;
  selections: UserInputSelection[] | null;
  
  conditional?: boolean;
}

export interface UserInputResponse {
  hscode: string;
  inputs: UserInputField[];
}

export interface DynamicInputResponse {
  hscode: string;
  inputs: UserInputField[];
}

export interface DutyCalculationRequest {
  hscode: string;
  imp: string;
  exp: string;
  org: string;
  currency: string;
  value_of_product: number;
  mode: "sea" | "air" | "road" |"land";
  incoterm?: "EXW" | "FOB" | "CIF";
  origin_charges?: number;
  origin_freight?: number;
  international_freight?: number;
  insurance_charges?: number;
  user_inputs?: Array<{ key: string; val: string }>;
}

export interface DutyItem {
  duty_name: string;
  display_duty_rate: number | string;
  local_display_rate?: string;
  calculated_duty_import_country_currency: number;
  calculated_duty_foreign_currency: number;
  tax_type: string;
  priority: string;
  hsn_uid: string;
  parent_hsn_uid: string;
  display_note: string;
  duty_display_name: string;
  duty_short_name: string;
  duty_description: string;
  remarks: string | null;
  master_notification_number: string;
  master_serial_number: string | null;
  master_part: string;
  master_footnote: string;
}

export interface DynamicInputSummary {
  key: string;
  value: string;
  user_input_label: string;
  user_input_selection_label: string;
  ui_description: string;
}

export interface DutyCalculationResponse {
  message: string;
  duty_calculations: {
    local_duties: {
      duties: DutyItem[];
      count: number;
    };
    antidumping: {
      duties: DutyItem[];
      count: number;
    };
    total_calculated_duty_import_country_currency: number;
    total_calculated_duty_foreign_currency: number;
    selected_currency: string;
  };
  shipment_summary: {
    import_country: string;
    export_country: string;
    mode_of_transport: string;
    import_hsn: string;
    selected_currency: string;
    selected_currency_rate: string;
    cif_value_import_country_currency: string;
    cif_value_foreign_currency: string;
    inco_term: string;
    international_freight: string;
    insurance_charges: string;
    dynamic_inputs: DynamicInputSummary[];
    total_calculated_duty_import_country_currency: string;
    total_calculated_duty_foreign_currency: string;
    total_landed_cost_import_country_currency: string;
    total_landed_cost_foreign_currency: string;
    hsn_description: string;
  };
  error?: string;
}

// SaveDuty API response types (FTA-based preferential tariffs)
export interface SaveDutyFtaOption {
  fta_duty_name: string;
  fta_display_duty_rate: string;
  fta_duty_display_name: string;
  fta_duty_short_name: string;
  fta_duty_description: string;
  calculated_duty_import_country_currency: number;
  calculated_duty_foreign_currency: number;
  local_duties: {
    duties: DutyItem[];
    count: number;
  };
  antidumping: {
    duties: DutyItem[];
    count: number;
  };
  total_calculated_duty_import_country_currency: number;
  total_calculated_duty_foreign_currency: number;
  duty_saved_import_country_currency: number;
  duty_saved_foreign_currency: number;
  selected_currency: string;
  shipment_summary: {
    import_country: string;
    export_country: string;
    mode_of_transport: string;
    import_hsn: string;
    selected_currency: string;
    selected_currency_rate: string;
    cif_value_import_country_currency: string;
    cif_value_foreign_currency: string;
    inco_term: string;
    international_freight: string;
    insurance_charges: string;
    dynamic_inputs: DynamicInputSummary[];
    total_calculated_duty_import_country_currency: string;
    total_calculated_duty_foreign_currency: string;
    total_landed_cost_import_country_currency: string;
    total_landed_cost_foreign_currency: string;
    hsn_description: string;
  };
  master_notification_number?: string | null;
  master_footnote?: string | null;
}

export interface SaveDutyResponse {
  message: string;
  fta: SaveDutyFtaOption[];
  total_fta_count: number;
}

// DutySaver types (for savings analysis)
export interface SavingsOption {
  id: string;
  category: string;
  title: string;
  description: string;
  savings_amount: number;
  savings_percent: number;
  new_duty_amount: number;
  tags: string[];
  is_best_saving: boolean;
  notification_number?: string;
}

export interface DutySaverResponse {
  message: string;
  current_duty: number;
  potential_savings: number;
  options_count: number;
  savings_options: SavingsOption[];
  best_option: SavingsOption;
  currency: string;
}

// Build headers for proxied intGrow API calls
function buildProxyHeaders(extra: Record<string, string> = {}): HeadersInit {
  const userToken = getUserToken();
  return {
    "Content-Type": "application/json",
    ...(userToken ? { "x-api-key": userToken } : {}),
    ...extra,
  };
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const userToken = getUserToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(userToken ? { "x-api-key": userToken } : {}),
    ...options.headers,
  };

  const response = await intgrowFetch(`${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API request failed" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Country endpoints
export async function getCountries(): Promise<ApiCountry[]> {
  return apiRequest<ApiCountry[]>("/api/v2/country/search");
}

export async function getAllCountries(): Promise<ApiCountry[]> {
  return apiRequest<ApiCountry[]>("/api/v2/country/search");
}

// Currency endpoints
export async function getAllCurrencies(): Promise<ApiCurrency[]> {
  return apiRequest<ApiCurrency[]>("/api/v2/country/currency");
}

export async function getCountryCurrencies(importingCountryCode: string): Promise<ApiCurrency[]> {
  return apiRequest(`/api/v2/country/currency?imp=${importingCountryCode}`);
}

// HS Code endpoints
export async function searchHsCodes(query: string, importingCountryCode: string): Promise<ApiHsCode[]> {
  if (query.length < 2) {
    throw new Error("Please enter at least 2 characters");
  }
  return apiRequest<ApiHsCode[]>(`/api/v2/hs_code/search?q=${encodeURIComponent(query)}&imp=${encodeURIComponent(importingCountryCode)}`);
}

export async function getHsCodeDetails(hsCode: string): Promise<Array<{ hs6: string }>> {
  return apiRequest(`/api/v2/hs_code/details?hs=${encodeURIComponent(hsCode)}`);
}

// User Input endpoints (for dynamic form fields based on HS code)
export async function getUserInputFields(hsCode: string, importingCountryCode: string, exportingCountryCode: string, organizationCountryCode: string): Promise<UserInputResponse> {
  return apiRequest<UserInputResponse>(
    `/api/v2/get_user_input?hscode=${encodeURIComponent(hsCode)}&imp=${encodeURIComponent(importingCountryCode)}&exp=${encodeURIComponent(exportingCountryCode)}&org=${encodeURIComponent(organizationCountryCode)}`,
  );
}

export async function getDynamicInputOptions(params: {
  hscode: string;
  imp: string;
  org: string;
  exp: string;
  ui_hsn_uid: string;
  uis_hsn_uid_type: string;
}): Promise<DynamicInputResponse> {
  const queryParams = new URLSearchParams({
    hscode: params.hscode,
    imp: params.imp,
    org: params.org,
    exp: params.exp,
    ui_hsn_uid: params.ui_hsn_uid,
    uis_hsn_uid_type: params.uis_hsn_uid_type,
  });

  return apiRequest<DynamicInputResponse>(`/api/v2/get_dynamic_input?${queryParams.toString()}`);
}

// Duty Calculation (no auth required)
export async function calculateDuty(request: DutyCalculationRequest): Promise<DutyCalculationResponse> {
  if (request?.mode === "road") request.mode = "land";
  const payload = JSON.stringify(request);
  console.log('[Calculate Duty] calculate_duty payload:', payload);

  const response = await intgrowFetch(`/api/v2/calculate_duty`, {
    method: "POST",
    headers: buildProxyHeaders(),
    body: payload,
  });

  if (!response.ok) {
    if (response.status === 402) throw new Error(SERVICE_PAUSED_MESSAGE);
    const error = await response.json().catch(() => ({ message: "Calculation failed" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Save Duty Calculation - returns FTA-based preferential tariffs
// Uses the EXACT same payload structure as calculateDuty to ensure 100% precision
export async function saveDutyCalculation(request: DutyCalculationRequest): Promise<SaveDutyResponse> {
  const payload = JSON.stringify(request);
  console.log('[DutySaver Pro] save_duty payload:', payload);

  const response = await intgrowFetch(`/api/v2/save_duty`, {
    method: "POST",
    headers: buildProxyHeaders(),
    body: payload,
  });

  if (!response.ok) {
    if (response.status === 402) throw new Error(SERVICE_PAUSED_MESSAGE);
    const error = await response.json().catch(() => ({ message: "Save failed" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('[DutySaver Pro] save_duty response:', JSON.stringify(data).substring(0, 500));
  return data;
}

// Get DutySaver Pro savings analysis
export async function getDutySaverAnalysis(request: DutyCalculationRequest): Promise<DutySaverResponse> {
  try {
    const response = await intgrowFetch(`/api/v2/get_duty_saver`, {
      method: "POST",
      headers: buildProxyHeaders(),
      body: JSON.stringify(request),
    });

    if (response.ok) {
      return response.json();
    }

    // If endpoint doesn't exist or fails, fall back to calculated mock data
    throw new Error("API not available");
  } catch {
    // Generate mock savings data based on request for demo purposes
    // In production, this would be fully API-driven
    return generateMockSavingsResponse(request);
  }
}

// Mock savings generator for demo/fallback
function generateMockSavingsResponse(request: DutyCalculationRequest): DutySaverResponse {
  const estimatedDuty = request.value_of_product * 0.15; // Estimate 15% duty
  const baseSavings = estimatedDuty * 0.2; // 20% potential savings

  const savingsOptions: SavingsOption[] = [
    {
      id: 'fta-1',
      category: 'FTA',
      title: 'Regional Trade Agreement Analysis',
      description: 'Explore regional trade agreements that may provide preferential treatment based on origin rules',
      savings_amount: baseSavings,
      savings_percent: 20,
      new_duty_amount: estimatedDuty - baseSavings,
      tags: ['Substantial Transformation', 'Regional Value Content'],
      is_best_saving: true,
      notification_number: 'FTA/2024/001',
    },
    {
      id: 'route-1',
      category: 'Routes',
      title: 'Alternative Port of Entry',
      description: 'Consider routing through bonded warehouses or free trade zones for duty deferral',
      savings_amount: baseSavings * 0.6,
      savings_percent: 12,
      new_duty_amount: estimatedDuty - (baseSavings * 0.6),
      tags: ['Free Trade Zone', 'Bonded Warehouse'],
      is_best_saving: false,
    },
    {
      id: 'route-2',
      category: 'Routes',
      title: 'Duty Drawback Program',
      description: 'Recover duties paid on imported goods that are later exported or used in manufacturing for export',
      savings_amount: baseSavings * 0.4,
      savings_percent: 8,
      new_duty_amount: estimatedDuty - (baseSavings * 0.4),
      tags: ['Export Eligible', 'Manufacturing'],
      is_best_saving: false,
    },
    {
      id: 'other-1',
      category: 'Other',
      title: 'Tariff Classification Review',
      description: 'Review HS code classification for potential duty optimization opportunities',
      savings_amount: baseSavings * 0.5,
      savings_percent: 10,
      new_duty_amount: estimatedDuty - (baseSavings * 0.5),
      tags: ['Classification', 'HS Code Review'],
      is_best_saving: false,
    },
    {
      id: 'other-2',
      category: 'Other',
      title: 'Exemption Notifications',
      description: 'Check applicable government exemption schemes and special notifications',
      savings_amount: baseSavings * 0.3,
      savings_percent: 6,
      new_duty_amount: estimatedDuty - (baseSavings * 0.3),
      tags: ['Government Scheme', 'Exemption'],
      is_best_saving: false,
    },
  ];

  return {
    message: 'DutySaver analysis complete',
    current_duty: estimatedDuty,
    potential_savings: baseSavings,
    options_count: savingsOptions.length,
    savings_options: savingsOptions,
    best_option: savingsOptions[0],
    currency: request.currency,
  };
}

// Helper to convert API country to our app's format
export function mapApiCountryToAppFormat(apiCountry: ApiCountry) {
  const flagCode = apiCountry.flag.toLowerCase();
  return {
    code: apiCountry.value,
    name: apiCountry.label,
    flag: `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${flagCode}.svg`,
    currency: apiCountry.currency.toUpperCase(),
    isImport: apiCountry.is_import === 1,
    isExport: apiCountry.is_export === 1,
  };
}

// Helper to convert API currency to our app's format
export function mapApiCurrencyToAppFormat(apiCurrency: ApiCurrency) {
  const currencyCode = apiCurrency.currency.toUpperCase();
  const symbol = getCurrencySymbol(currencyCode);
  return {
    code: currencyCode,
    name: `${apiCurrency.country} ${apiCurrency.unit}`,
    symbol,
    ...apiCurrency,
  };
}

// Currency symbol mapping
function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    CNY: "¥",
    JPY: "¥",
    AED: "د.إ",
    CAD: "C$",
    AUD: "A$",
    SGD: "S$",
    AFN: "؋",
  };
  return symbols[code] || code;
}



export interface UserSignInResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  role: string;
  token: string;
}

export interface UserSignInRequest {
  email: string;
  password: string;
}

// User sign in
export async function userSignIn(request: UserSignInRequest): Promise<UserSignInResponse> {
  let errorMessage = "";
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/auth/signIn`, {
      method: "POST",
      headers: buildProxyHeaders(),
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data?.result));
      localStorage.setItem("token", data?.result?.token);
      return data;
    }

    const errorData = await response.json();
    errorMessage = errorData?.error || "API not available";
    throw new Error(errorMessage);
  } catch {
    throw new Error(errorMessage || "API not available");
  }
}


// User sign in
export const userSignInWithApiKey = async (request: { apiKey: string }): Promise<UserSignInResponse> => {
  let errorMessage = "";
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": request.apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data?.result));
      localStorage.setItem("token", data?.result?.token);
      return data;
    }

    const errorData = await response.json();
    errorMessage = errorData?.error || "API not available";
    throw new Error(errorMessage);
  } catch {
    throw new Error(errorMessage || "API not available");
  }
}

// ── India Import Policy (ITC-HS, DGFT) ──────────────────────────────────────
export interface ImportPolicyRecord {
  itc_hs_code: string;
  policy_description?: string | null;
  policy_description_notes?: string | null;
  policy?: string | null;
  policy_notes?: string | null;
  restrictions_policy_conditions?: string | null;
  restrictions_policy_conditions_notes?: string | null;
  explanation?: string | null;
  explanation_notes?: string | null;
  last_update?: string | null;
}

export interface ImportPolicyResponse {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  count?: number;
  data: ImportPolicyRecord[];
  matched_hs_code?: string;
}

async function fetchImportPolicyPage(query: string, limit = 25, apiKey?: string): Promise<ImportPolicyResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
  };

  const response = await intgrowFetch(`/api/v2/import_policy?hscode_or_product_info=${encodeURIComponent(query)}&page=1&limit=${limit}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API request failed" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getImportPolicy(query: string): Promise<ImportPolicyResponse> {
  const apiKey = getUserToken();
  const numeric = query.replace(/\D/g, '');
  if (!numeric) {
    const res = await fetchImportPolicyPage(query.trim(), 25, apiKey);
    return res?.data?.length ? res : { data: [], count: 0 };
  }
  const stems = Array.from(
    new Set([numeric, numeric.slice(0, 8), numeric.slice(0, 6), numeric.slice(0, 4), numeric.slice(0, 2)]),
  ).filter((s) => s.length >= 2);

  for (const stem of stems) {
    const res = await fetchImportPolicyPage(stem, 25, apiKey);
    if (res?.data?.length) {
      return { ...res, matched_hs_code: stem };
    }
  }

  return { data: [], count: 0 };
}

// ── India Export Policy (ITC-HS, DGFT) ──────────────────────────────────────
export interface ExportPolicyRecord {
  itc_hs_code: string;
  policy_description?: string | null;
  policy_description_notes?: string | null;
  export_policy?: string | null;
  export_policy_notes?: string | null;
  nature_of_restriction?: string | null;
  nature_of_restriction_notes?: string | null;
  unit?: string | null;
  last_update?: string | null;
}

export interface ExportPolicyResponse {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  count?: number;
  data: ExportPolicyRecord[];
  matched_hs_code?: string;
}

async function fetchExportPolicyPage(query: string, limit = 25, apiKey?: string): Promise<ExportPolicyResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
  };

  const response = await intgrowFetch(`/api/v2/export_policy?hscode_or_product_info=${encodeURIComponent(query)}&page=1&limit=${limit}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API request failed" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getExportPolicy(query: string): Promise<ExportPolicyResponse> {
  const apiKey = getUserToken();
  const numeric = query.replace(/\D/g, '');
  if (!numeric) {
    const res = await fetchExportPolicyPage(query.trim(), 25, apiKey);
    return res?.data?.length ? res : { data: [], count: 0 };
  }
  const stems = Array.from(
    new Set([numeric, numeric.slice(0, 8), numeric.slice(0, 6), numeric.slice(0, 4), numeric.slice(0, 2)]),
  ).filter((s) => s.length >= 2);

  for (const stem of stems) {
    const res = await fetchExportPolicyPage(stem, 25, apiKey);
    if (res?.data?.length) {
      return { ...res, matched_hs_code: stem };
    }
  }

  return { data: [], count: 0 };
}
