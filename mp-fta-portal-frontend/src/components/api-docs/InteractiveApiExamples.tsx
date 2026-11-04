import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Copy, Check, Play, ChevronRight, Terminal, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface ApiExample {
  id: string;
  title: string;
  description: string;
  method: 'GET' | 'POST';
  endpoint: string;
  headers?: Record<string, string>;
  requestBody?: object;
  queryParams?: Record<string, string>;
  sampleResponse: object;
  notes?: string;
}

const apiExamples: ApiExample[] = [
  {
    id: 'country-search',
    title: 'Get Countries List',
    description: 'Fetch all available countries for origin, export, and import selection.',
    method: 'GET',
    endpoint: '/api/v3/country/search',
    headers: { 'x-api-key': 'YOUR_API_KEY' },
    sampleResponse: [
      {
        value: 'ind',
        label: 'India',
        flag: 'in',
        is_import: 1,
        is_export: 1,
        currency: 'inr'
      },
      {
        value: 'usa',
        label: 'United States',
        flag: 'us',
        is_import: 1,
        is_export: 1,
        currency: 'usd'
      }
    ],
    notes: 'Returns a flat array of country objects. Filter by is_import=1 for destination countries, is_export=1 for origin/exporting countries. IMPORTANT: The importing country cannot be selected as the Origin or Exporting country.'
  },
  {
    id: 'currency-lookup',
    title: 'Get Currencies by Country',
    description: 'Fetch available currencies for a specific importing country.',
    method: 'GET',
    endpoint: '/api/v3/country/currency',
    headers: { 'x-api-key': 'YOUR_API_KEY' },
    queryParams: { imp: 'ind' },
    sampleResponse: [
      { country: 'United States', currency: 'usd', unit: 'US Dollar', value: 'usd' },
      { country: 'India', currency: 'inr', unit: 'Indian Rupee', value: 'inr' },
      { country: 'European Union', currency: 'eur', unit: 'Euro', value: 'eur' }
    ],
    notes: 'Returns a flat array of currency objects. The imp parameter filters to currencies available for that importing country.'
  },
  {
    id: 'hs-code-search',
    title: 'Search HS Codes',
    description: 'Search for HS codes by keyword or partial code. Example: Searching "yarn" for Korea imports.',
    method: 'GET',
    endpoint: '/api/v3/hs_code/search',
    headers: { 'x-api-key': 'YOUR_API_KEY' },
    queryParams: { q: 'yarn', imp: 'kor' },
    sampleResponse: [
      {
        hs_code: '5402470000',
        product: 'Synthetic filament yarn (other than sewing thread), not put up for retail sale: Other, of polyesters: Other'
      },
      {
        hs_code: '5402479000',
        product: 'Synthetic filament yarn: Textured yarn: Of polyesters: Other'
      },
      {
        hs_code: '5509210000',
        product: 'Yarn of synthetic staple fibres: Single yarn: Of polyesters'
      }
    ],
    notes: 'Minimum 2 characters required. Returns hs_code and product description matching the query.'
  },
  {
    id: 'get-user-input',
    title: 'Get Initial User Inputs',
    description: 'Retrieve dynamic input fields required for a specific HS code. Example: Synthetic yarn (5402479000) importing to Korea.',
    method: 'GET',
    endpoint: '/api/v3/get_user_input',
    headers: { 'x-api-key': 'YOUR_API_KEY' },
    queryParams: { hscode: '5402479000', imp: 'kor', org: 'chn', exp: 'chn' },
    sampleResponse: {
      hscode: '5402479000',
      inputs: [
        {
          hsn_uid: 'ui_yarn_type',
          label: 'Yarn Classification',
          field: 'yarn_type',
          value_type: 'selection',
          level: '0',
          parent_hsn_uid: null,
          priority: 1,
          selections: [
            {
              uis_label: 'Textured yarn',
              uis_hsn_uid: 'uis_textured',
              uis_hsn_uid_type: 'textured',
              uis_description: 'Textured synthetic filament yarn'
            },
            {
              uis_label: 'Non-textured yarn',
              uis_hsn_uid: 'uis_non_textured',
              uis_hsn_uid_type: 'non_textured',
              uis_description: 'Non-textured synthetic filament yarn'
            }
          ]
        }
      ]
    },
    notes: 'Required params: hscode, imp, org, exp. All four parameters are mandatory for accurate trade-defense filtering. Use value_type="selection" to identify fields that may have cascading options via get_dynamic_input.'
  },
  {
    id: 'get-dynamic-input',
    title: 'Get Cascading Dynamic Inputs',
    description: 'Fetch follow-up input fields based on user selection. Example: Synthetic yarn (5402200010) from China to Austria via India.',
    method: 'GET',
    endpoint: '/api/v3/get_dynamic_input',
    headers: { 'x-api-key': 'YOUR_API_KEY' },
    queryParams: {
      hscode: '5402200010',
      imp: 'aut',
      org: 'chn',
      exp: 'ind',
      ui_hsn_uid: '5402200010_3',
      uis_hsn_uid_type: '5402200010_4_type6'
    },
    sampleResponse: {
      hscode: '5402479000',
      inputs: [
        {
          hsn_uid: '5402479000_3_1',
          label: 'Select Producer/Exporter',
          field: 'producer',
          value_type: 'selection',
          level: '2',
          parent_hsn_uid: '5402479000_3',
          priority: 1,
          
          selections: [
            { uis_label: 'Producer A', uis_hsn_uid: '5402479000_3_1_a', uis_hsn_uid_type: '' },
            { uis_label: 'Producer B', uis_hsn_uid: '5402479000_3_1_b', uis_hsn_uid_type: '' },
            { uis_label: 'All Other Producers', uis_hsn_uid: '5402479000_3_1_other', uis_hsn_uid_type: '' }
          ]
        }
      ]
    },
    notes: 'Required params: hscode, imp, org, exp, ui_hsn_uid. Optional: uis_hsn_uid_type (from the selected option\'s uis_hsn_uid_type field — use uis_hsn_uid as fallback if empty). The x-api-key header is mandatory.'
  },
  {
    id: 'calculate-duty',
    title: 'Calculate Import Duty',
    description: 'Calculate standard tariff duties for a shipment. Example: Synthetic filament yarn from China to Korea.',
    method: 'POST',
    endpoint: '/api/v3/calculate_duty',
    requestBody: {
      hscode: '5402479000',
      imp: 'kor',
      exp: 'chn',
      org: 'chn',
      currency: 'usd',
      value_of_product: 10000,
      mode: 'sea',
      incoterm: 'CIF',
      international_freight: 0,
      insurance_charges: 0,
      user_inputs: []
    },
    sampleResponse: {
      message: 'Duty calculation successful',
      duty_calculations: {
        local_duties: {
          duties: [
            {
              duty_name: 'bcd',
              duty_display_name: 'Basic Customs Duty',
              duty_short_name: 'BCD',
              display_duty_rate: 8,
              calculated_duty_foreign_currency: 800,
              calculated_duty_import_country_currency: 1104000
            },
            {
              duty_name: 'vat',
              duty_display_name: 'Value Added Tax',
              duty_short_name: 'VAT',
              display_duty_rate: 10,
              calculated_duty_foreign_currency: 1080,
              calculated_duty_import_country_currency: 1490400
            }
          ],
          count: 2
        },
        antidumping: { duties: [], count: 0 },
        total_calculated_duty_foreign_currency: 1880,
        total_calculated_duty_import_country_currency: 2594400,
        selected_currency: 'USD'
      },
      shipment_summary: {
        import_country: 'Korea',
        export_country: 'China',
        mode_of_transport: 'Sea',
        import_hsn: '5402479000',
        selected_currency: 'USD',
        selected_currency_rate: '0.00074',
        cif_value_foreign_currency: '10000',
        cif_value_import_country_currency: '13800000',
        inco_term: 'CIF',
        international_freight: '0',
        insurance_charges: '0',
        total_calculated_duty_foreign_currency: '1880',
        total_calculated_duty_import_country_currency: '2594400',
        total_landed_cost_foreign_currency: '11880',
        total_landed_cost_import_country_currency: '16394400',
        hsn_description: 'Synthetic filament yarn: Textured yarn: Of polyesters: Other',
        dynamic_inputs: []
      }
    },
    notes: 'Required: hscode, imp, exp, currency, value_of_product, mode. Optional: org (defaults to exp), incoterm (defaults to CIF), origin_charges, origin_freight, international_freight, insurance_charges, user_inputs (empty array if none needed).'
  },
  {
    id: 'save-duty',
    title: 'Get FTA Savings Analysis (DutySaver Pro)',
    description: 'Analyze potential duty savings through Free Trade Agreements. Example: Synthetic filament yarn from China to Korea.',
    method: 'POST',
    endpoint: '/api/v3/save_duty',
    requestBody: {
      hscode: '5402479000',
      imp: 'kor',
      exp: 'chn',
      org: 'chn',
      currency: 'usd',
      value_of_product: 10000,
      mode: 'sea',
      incoterm: 'CIF',
      international_freight: 0,
      insurance_charges: 0,
      user_inputs: []
    },
    sampleResponse: {
      message: 'FTA analysis complete',
      total_fta_count: 2,
      fta: [
        {
          fta_duty_name: 'Korea-China FTA (KCFTA)',
          fta_display_duty_rate: '0',
          fta_duty_display_name: 'KCFTA Preferential Duty',
          fta_duty_short_name: 'KCFTA',
          local_duties: {
            duties: [
              {
                duty_name: 'vat',
                duty_display_name: 'Value Added Tax',
                duty_short_name: 'VAT',
                display_duty_rate: 10,
                calculated_duty_foreign_currency: 1000,
                calculated_duty_import_country_currency: 1380000
              }
            ],
            count: 1
          },
          antidumping: { duties: [], count: 0 },
          total_calculated_duty_foreign_currency: 1000,
          total_calculated_duty_import_country_currency: 1380000,
          duty_saved_foreign_currency: 880,
          duty_saved_import_country_currency: 1214400,
          selected_currency: 'USD'
        },
        {
          fta_duty_name: 'RCEP (Regional Comprehensive Economic Partnership)',
          fta_display_duty_rate: '4',
          fta_duty_display_name: 'RCEP Preferential Duty',
          fta_duty_short_name: 'RCEP',
          local_duties: {
            duties: [
              {
                duty_name: 'vat',
                duty_display_name: 'Value Added Tax',
                duty_short_name: 'VAT',
                display_duty_rate: 10,
                calculated_duty_foreign_currency: 1040,
                calculated_duty_import_country_currency: 1435200
              }
            ],
            count: 1
          },
          antidumping: { duties: [], count: 0 },
          total_calculated_duty_foreign_currency: 1440,
          total_calculated_duty_import_country_currency: 1987200,
          duty_saved_foreign_currency: 440,
          duty_saved_import_country_currency: 607200,
          selected_currency: 'USD'
        }
      ]
    },
    notes: 'Same request payload as calculate_duty. Required: hscode, imp, exp, currency, value_of_product, mode. Optional: org, incoterm, charges, user_inputs. Evaluate fta entries by duty_saved_import_country_currency to identify best savings.'
  }
];

const CopyButton = ({ text, label = 'Copy' }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 h-7 text-xs"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
};

const formatJson = (obj: object): string => JSON.stringify(obj, null, 2);

const buildCurlCommand = (example: ApiExample): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://api4.intgrow.co';
  let url = `${baseUrl}${example.endpoint}`;
  
  if (example.queryParams) {
    const params = new URLSearchParams(example.queryParams).toString();
    url += `?${params}`;
  }

  let cmd = `curl -X ${example.method} "${url}"`;
  
  if (example.headers) {
    Object.entries(example.headers).forEach(([key, value]) => {
      cmd += ` \\\n  -H "${key}: ${value}"`;
    });
  }
  
  if (example.method === 'POST' && example.requestBody) {
    cmd += ` \\\n  -H "Content-Type: application/json"`;
    cmd += ` \\\n  -d '${JSON.stringify(example.requestBody, null, 2)}'`;
  }
  
  return cmd;
};

const buildJsCode = (example: ApiExample): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://api4.intgrow.co';
  let url = `${baseUrl}${example.endpoint}`;
  
  if (example.queryParams) {
    const params = new URLSearchParams(example.queryParams).toString();
    url += `?${params}`;
  }

  const hasAuth = !!example.headers;

  if (example.method === 'GET') {
    const headersBlock = hasAuth
      ? `  headers: {\n    "x-api-key": "YOUR_API_KEY"\n  }\n`
      : '';
    return `const response = await fetch("${url}"${headersBlock ? `, {\n${headersBlock}}` : ''});

const data = await response.json();
console.log(data);`;
  } else {
    const headersObj = hasAuth
      ? `    "Content-Type": "application/json",\n    "x-api-key": "YOUR_API_KEY"`
      : `    "Content-Type": "application/json"`;
    return `const response = await fetch("${url}", {
  method: "POST",
  headers: {
${headersObj}
  },
  body: JSON.stringify(${formatJson(example.requestBody || {})})
});

const data = await response.json();
console.log(data);`;
  }
};

const ApiExampleCard = ({ example }: { example: ApiExample }) => {
  const curlCommand = buildCurlCommand(example);
  const jsCode = buildJsCode(example);
  const responseJson = formatJson(example.sampleResponse);

  return (
    <AccordionItem value={example.id} className="border rounded-lg mb-3 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
        <div className="flex items-center gap-3 text-left">
          <Badge 
            variant={example.method === 'GET' ? 'secondary' : 'default'}
            className={example.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}
          >
            {example.method}
          </Badge>
          <div>
            <span className="font-medium">{example.title}</span>
            <span className="text-muted-foreground text-sm ml-2 hidden sm:inline">
              {example.endpoint}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <p className="text-muted-foreground text-sm mb-4">{example.description}</p>
        
        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="mb-3">
            <TabsTrigger value="curl" className="gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              cURL
            </TabsTrigger>
            <TabsTrigger value="javascript" className="gap-1.5">
              <FileJson className="h-3.5 w-3.5" />
              JavaScript
            </TabsTrigger>
            <TabsTrigger value="response" className="gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curl">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={curlCommand} />
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-[300px]">
                <code>{curlCommand}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="javascript">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={jsCode} />
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-[300px]">
                <code>{jsCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="response">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={responseJson} label="Copy JSON" />
              </div>
              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg text-sm overflow-x-auto max-h-[400px]">
                <code>{responseJson}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        {example.notes && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>💡 Note:</strong> {example.notes}
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export const InteractiveApiExamples = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Interactive API Examples
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on any endpoint to view sample requests and responses. Copy code snippets to use in your application.
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {apiExamples.map((example) => (
            <ApiExampleCard key={example.id} example={example} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
