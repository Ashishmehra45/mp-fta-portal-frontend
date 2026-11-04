import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Check, Play, ChevronRight, Terminal, FileJson, Loader2, Globe, Key, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = `/api/v1/export-policy`;

// Publishable (anon) key — safe to expose client-side.
const PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZnZhcWtwaWZ2eGxsbHpiZXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjkwNTMsImV4cCI6MjA4NTYwNTA1M30.HEpImODKIhMOTcpUhBmKVP5IeUUnW6sjduEn8EEQpf8';

interface ParamRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface PolicyEndpoint {
  id: string;
  title: string;
  description: string;
  method: 'GET' | 'POST';
  path: string;
  params: ParamRow[];
  examplePath: string; // path + query string actually called by "Run"
  exampleBody?: object;
  sampleResponse: object;
  notes?: string;
}

const endpoints: PolicyEndpoint[] = [
  {
    id: 'ep-hs-lookup',
    title: 'Lookup by HS Code',
    description:
      'Retrieve the export policy for any HS code. Works with 2–10 digit codes. Foreign HS codes (e.g. China\'s 10-digit 2101110000) are automatically resolved to the matching Indian 8-digit ITC-HS rows via prefix fallback.',
    method: 'GET',
    path: '/hs/{hsCode}',
    examplePath: '/hs/2101110000',
    params: [
      { name: 'hsCode', type: 'path', required: true, description: 'HS code, minimum 2 digits. Non-numeric characters are stripped automatically.' },
    ],
    sampleResponse: {
      data: [
        {
          id: 'a1b2c3d4-…',
          hs_code: '21011110',
          item_description: 'Coffee, not roasted, not decaffeinated: Coffee, Arabica plantation',
          export_policy: 'Free',
          policy_condition: 'Export Permitted Freely',
          restriction_type: 'Free',
          notification_number: null,
          chapter: '21',
        },
      ],
      meta: {
        requested_hs_code: '2101110000',
        matched_hs_code: '210111',
        total: 4,
        response_time_ms: 42,
      },
    },
    notes:
      'Two-stage matching: (1) exact match on 10/8/6/4/2-digit prefixes, picking the most specific rows; (2) starts-with fallback on the 6/4/2-digit stem. meta.matched_hs_code tells you which level actually matched.',
  },
  {
    id: 'ep-search',
    title: 'Full-Text & Filtered Search',
    description:
      'Search policy rows by keyword (full-text on item description), by numeric HS prefix, and/or filter by policy type and restriction type. Supports pagination.',
    method: 'GET',
    path: '/search?q=&policy=&restriction_type=&limit=&offset=',
    examplePath: '/search?q=coffee&policy=Free&limit=5',
    params: [
      { name: 'q', type: 'query', required: false, description: 'Keyword (full-text search) or numeric HS prefix. Max 200 chars.' },
      { name: 'policy', type: 'query', required: false, description: 'Filter by export policy, e.g. Free, Restricted, Prohibited.' },
      { name: 'restriction_type', type: 'query', required: false, description: 'Filter by nature of restriction.' },
      { name: 'limit', type: 'query', required: false, description: 'Rows per page. Default 20, max 100.' },
      { name: 'offset', type: 'query', required: false, description: 'Pagination offset. Default 0.' },
    ],
    sampleResponse: {
      data: [
        {
          hs_code: '09011110',
          item_description: 'Coffee, not roasted, not decaffeinated: Arabica plantation',
          export_policy: 'Free',
          policy_condition: 'Export Permitted Freely',
          restriction_type: 'Free',
          chapter: '09',
        },
      ],
      meta: { total: 57, limit: 5, offset: 0, response_time_ms: 38 },
    },
    notes: 'At least one of q, policy or restriction_type is required, otherwise the API returns 400.',
  },
  {
    id: 'ep-policy-filter',
    title: 'List by Policy Type',
    description: 'List all HS codes under a given export policy category (Free, Restricted, Prohibited, STE, etc.), with pagination.',
    method: 'GET',
    path: '/policy/{policy}',
    examplePath: '/policy/Restricted?limit=5',
    params: [
      { name: 'policy', type: 'path', required: true, description: 'Policy category name, e.g. Free, Restricted, Prohibited.' },
      { name: 'limit', type: 'query', required: false, description: 'Rows per page. Default 20, max 100.' },
      { name: 'offset', type: 'query', required: false, description: 'Pagination offset. Default 0.' },
    ],
    sampleResponse: {
      data: [
        {
          hs_code: '01061900',
          item_description: 'Other live animals: Mammals: Other',
          export_policy: 'Restricted',
          policy_condition: 'Export permitted under licence',
          restriction_type: 'Restricted',
          chapter: '01',
        },
      ],
      meta: { policy: 'Restricted', total: 163, limit: 5, offset: 0, response_time_ms: 35 },
    },
  },
  {
    id: 'ep-autocomplete',
    title: 'Autocomplete Suggestions',
    description: 'Lightweight HS code + description suggestions for search-as-you-type inputs. Numeric queries match code prefixes; text queries match descriptions.',
    method: 'GET',
    path: '/autocomplete?q=',
    examplePath: '/autocomplete?q=cotton',
    params: [
      { name: 'q', type: 'query', required: true, description: 'Search text or HS prefix. Minimum 2 characters. Returns max 10 suggestions.' },
    ],
    sampleResponse: {
      data: [
        { hs_code: '52010010', item_description: 'Cotton, not carded or combed: Indian cotton of staple length…', export_policy: 'Free' },
        { hs_code: '52051110', item_description: 'Cotton yarn (other than sewing thread)…', export_policy: 'Free' },
      ],
      meta: { total: 10, response_time_ms: 21 },
    },
  },
  {
    id: 'ep-bulk',
    title: 'Bulk HS Lookup',
    description: 'Resolve up to 50 HS codes in a single request. Each code gets the same prefix-fallback matching as the single lookup. Ideal for validating entire shipping manifests.',
    method: 'POST',
    path: '/bulk',
    examplePath: '/bulk',
    exampleBody: { hs_codes: ['2101110000', '09011110', '8703239011'] },
    params: [
      { name: 'hs_codes', type: 'body (string[])', required: true, description: 'Array of HS codes (min 2 digits each). Maximum 50 codes per request.' },
    ],
    sampleResponse: {
      data: {
        '2101110000': { matched_hs_code: '210111', records: [{ hs_code: '21011110', export_policy: 'Free' }] },
        '09011110': { matched_hs_code: '09011110', records: [{ hs_code: '09011110', export_policy: 'Free' }] },
        '8703239011': { matched_hs_code: null, records: [] },
      },
      meta: { requested: 3, found: 2, response_time_ms: 48 },
    },
  },
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
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 h-7 text-xs">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
};

const formatJson = (obj: object): string => JSON.stringify(obj, null, 2);

const buildCurl = (ep: PolicyEndpoint): string => {
  const url = `${BASE_URL}${ep.examplePath}`;
  let cmd = `curl -X ${ep.method} "${url}"`;
  cmd += ` \\\n  -H "apikey: ${PUBLISHABLE_KEY}"`;
  cmd += ` \\\n  -H "Authorization: Bearer ${PUBLISHABLE_KEY}"`;
  if (ep.method === 'POST' && ep.exampleBody) {
    cmd += ` \\\n  -H "Content-Type: application/json"`;
    cmd += ` \\\n  -d '${JSON.stringify(ep.exampleBody)}'`;
  }
  return cmd;
};

const buildJs = (ep: PolicyEndpoint): string => {
  const url = `${BASE_URL}${ep.examplePath}`;
  if (ep.method === 'GET') {
    return `const response = await fetch("${url}", {
  headers: {
    "apikey": "YOUR_PUBLISHABLE_KEY",
    "Authorization": "Bearer YOUR_PUBLISHABLE_KEY"
  }
});

const data = await response.json();
console.log(data);`;
  }
  return `const response = await fetch("${url}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": "YOUR_PUBLISHABLE_KEY",
    "Authorization": "Bearer YOUR_PUBLISHABLE_KEY"
  },
  body: JSON.stringify(${formatJson(ep.exampleBody || {})})
});

const data = await response.json();
console.log(data);`;
};

interface LiveResult {
  status: number;
  ms: number;
  body: string;
}

const EndpointCard = ({ ep }: { ep: PolicyEndpoint }) => {
  const [live, setLive] = useState<LiveResult | null>(null);
  const [running, setRunning] = useState(false);

  const runLive = async () => {
    setRunning(true);
    setLive(null);
    const started = performance.now();
    try {
      const res = await fetch(`${BASE_URL}${ep.examplePath}`, {
        method: ep.method,
        headers: {
          apikey: PUBLISHABLE_KEY,
          Authorization: `Bearer ${PUBLISHABLE_KEY}`,
          ...(ep.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(ep.method === 'POST' && ep.exampleBody ? { body: JSON.stringify(ep.exampleBody) } : {}),
      });
      const body = await res.json();
      setLive({ status: res.status, ms: Math.round(performance.now() - started), body: formatJson(body) });
    } catch (err) {
      setLive({ status: 0, ms: Math.round(performance.now() - started), body: `Network error: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setRunning(false);
    }
  };

  return (
    <AccordionItem value={ep.id} className="border rounded-lg mb-3 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
        <div className="flex items-center gap-3 text-left">
          <Badge
            variant={ep.method === 'GET' ? 'secondary' : 'default'}
            className={
              ep.method === 'GET'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }
          >
            {ep.method}
          </Badge>
          <div>
            <span className="font-medium">{ep.title}</span>
            <span className="text-muted-foreground text-sm ml-2 hidden sm:inline">{ep.path}</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <p className="text-muted-foreground text-sm mb-4">{ep.description}</p>

        {/* Parameters */}
        <h4 className="font-semibold text-sm mb-2">Parameters</h4>
        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ep.params.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-mono text-sm">{p.name}</TableCell>
                <TableCell className="text-sm">{p.type}</TableCell>
                <TableCell>
                  {p.required ? <Badge className="bg-red-600">Required</Badge> : <Badge variant="outline">Optional</Badge>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="mb-3 flex-wrap h-auto">
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
              Sample Response
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Try it Live
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curl">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={buildCurl(ep)} />
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-[300px]">
                <code>{buildCurl(ep)}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="javascript">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={buildJs(ep)} />
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-[300px]">
                <code>{buildJs(ep)}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="response">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={formatJson(ep.sampleResponse)} label="Copy JSON" />
              </div>
              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg text-sm overflow-x-auto max-h-[400px]">
                <code>{formatJson(ep.sampleResponse)}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={runLive} disabled={running} className="gap-2">
                  {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {running ? 'Running…' : 'Send Request'}
                </Button>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                  {ep.method} {BASE_URL}{ep.examplePath}
                </code>
              </div>
              {live && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={live.status >= 200 && live.status < 300 ? 'bg-green-600' : 'bg-red-600'}>
                      Status: {live.status || 'Network Error'}
                    </Badge>
                    <Badge variant="outline">{live.ms} ms</Badge>
                  </div>
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CopyButton text={live.body} label="Copy JSON" />
                    </div>
                    <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg text-sm overflow-x-auto max-h-[400px]">
                      <code>{live.body}</code>
                    </pre>
                  </div>
                </div>
              )}
              {!live && !running && (
                <p className="text-sm text-muted-foreground">
                  Click "Send Request" to execute this call against the production API and see the real response.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {ep.notes && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>💡 Note:</strong> {ep.notes}
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

const credentialsSnippet = `Base URL:        ${BASE_URL}
Publishable Key: ${PUBLISHABLE_KEY}

Headers (send both):
  apikey: ${PUBLISHABLE_KEY}
  Authorization: Bearer ${PUBLISHABLE_KEY}`;

export const ExportPolicyApiDocs = () => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Overview & Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The <strong>India Export Policy API</strong> provides programmatic access to the official ITC-HS export
            policy schedule — <strong>18,120 policy rows</strong> covering every 8-digit ITC-HS code, as published by
            DGFT (schedule dated 30-07-2026). Use it to check whether goods can be freely exported from India, or
            whether they are Restricted / Prohibited / STE. The data is read-only public reference data.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                Credentials to share with consumers
              </h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CopyButton text={credentialsSnippet} label="Copy credentials" />
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto max-h-[220px]">
                  <code>{credentialsSnippet}</code>
                </pre>
              </div>
              <p className="text-xs text-muted-foreground">
                The publishable key is a public client key (safe to share) — row-level security on the backend keeps
                the data read-only. Requests also work without any key while JWT verification is disabled, but sending
                the headers above is recommended and future-proof.
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Quick facts
              </h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Base URL</TableCell>
                    <TableCell className="font-mono text-xs break-all">{BASE_URL}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Version</TableCell>
                    <TableCell>v1.0.0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Scope</TableCell>
                    <TableCell>Exports from India (ITC-HS), 18,120 rows</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Auth</TableCell>
                    <TableCell>Publishable key headers (see left). No user login required.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CORS</TableCell>
                    <TableCell>Open — callable from browsers and servers</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rate limit</TableCell>
                    <TableCell>Bulk endpoint: max 50 HS codes per request</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Response envelope:</strong> every endpoint returns{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{'{ data, meta }'}</code> —{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">data</code> holds the records and{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">meta</code> holds totals, matched HS code,
              pagination and response time. Errors return <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{'{ error: string }'}</code>{' '}
              with HTTP 400/404/500.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Endpoints — Interactive Examples
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Expand any endpoint for parameters, copy-paste cURL/JavaScript snippets, sample responses, and a live
            runner that executes the request against production.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {endpoints.map((ep) => (
              <EndpointCard key={ep.id} ep={ep} />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};
