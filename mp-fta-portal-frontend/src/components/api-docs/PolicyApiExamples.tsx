import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Play, Terminal, FileJson, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getExportPolicy, getImportPolicy } from '@/services/intgrowApi';

type PolicyKind = 'export' | 'import';

const BASE = 'https://api4.intgrow.co/api/v2';

const formatJson = (obj: unknown): string => JSON.stringify(obj, null, 2);

const CopyButton = ({ text, label = 'Copy' }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 h-7 text-xs"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
};

const sampleResponses: Record<PolicyKind, object> = {
  export: {
    pagination: { page: 1, limit: 25, total: 4, totalPages: 1, hasNext: false, hasPrev: false },
    count: 4,
    data: [
      {
        itc_hs_code: '10063010',
        policy_description: 'Rice, semi-milled or wholly milled — Basmati rice',
        export_policy: 'Free',
        nature_of_restriction: 'Subject to registration of contract with APEDA',
        unit: 'KGS',
        last_update: '2024-04-01',
      },
    ],
    matched_hs_code: '100630',
  },
  import: {
    pagination: { page: 1, limit: 25, total: 6, totalPages: 1, hasNext: false, hasPrev: false },
    count: 6,
    data: [
      {
        itc_hs_code: '10063010',
        policy_description: 'Rice, semi-milled or wholly milled',
        policy: 'Restricted',
        restrictions_policy_conditions: 'Import allowed against licence issued by DGFT',
        unit: 'KGS',
        last_update: '2024-04-01',
      },
    ],
    matched_hs_code: '100630',
  },
};

interface LiveResult {
  ok: boolean;
  ms: number;
  body: string;
}

const PolicyRunner = ({ kind }: { kind: PolicyKind }) => {
  const [query, setQuery] = useState(kind === 'export' ? '10063010' : 'rice');
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState<LiveResult | null>(null);

  const url = `${BASE}/${kind}_policy?hscode_or_product_info=${encodeURIComponent(query)}&page=1&limit=25`;

  const curl = `curl -X GET "${url}" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

  const js = `const res = await fetch(
  "${url}",
  { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
);
const json = await res.json();
console.log(json.data);`;

  const run = async () => {
    setRunning(true);
    setLive(null);
    const started = performance.now();
    try {
      const json = kind === 'export' ? await getExportPolicy(query) : await getImportPolicy(query);
      setLive({ ok: true, ms: Math.round(performance.now() - started), body: formatJson(json) });
    } catch (err) {
      setLive({
        ok: false,
        ms: Math.round(performance.now() - started),
        body: `Request failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-blue-600">GET</Badge>
          <span className="font-mono text-base">/api/v2/{kind}_policy</span>
          <span className="text-sm text-muted-foreground font-normal">
            India ITC-HS {kind === 'export' ? 'Export' : 'Import'} Policy
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <label className="text-sm font-medium mb-1 block">hscode_or_product_info (required)</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 10063010 or rice"
            />
          </div>
          <Button onClick={run} disabled={running || !query.trim()} className="gap-2">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? 'Running…' : 'Send Request'}
          </Button>
        </div>

        <Tabs defaultValue="live">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="live" className="gap-1.5"><Zap className="h-3.5 w-3.5" />Try it Live</TabsTrigger>
            <TabsTrigger value="curl" className="gap-1.5"><Terminal className="h-3.5 w-3.5" />cURL</TabsTrigger>
            <TabsTrigger value="js" className="gap-1.5"><FileJson className="h-3.5 w-3.5" />JavaScript</TabsTrigger>
            <TabsTrigger value="sample" className="gap-1.5">Sample Response</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-3">
            {live ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={live.ok ? 'bg-green-600' : 'bg-red-600'}>{live.ok ? 'Success' : 'Error'}</Badge>
                  <Badge variant="outline">{live.ms} ms</Badge>
                </div>
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10"><CopyButton text={live.body} label="Copy JSON" /></div>
                  <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg text-sm overflow-x-auto max-h-[400px]">
                    <code>{live.body}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter an HS code or product keyword and click "Send Request" to call the live {kind} policy API
                (numeric codes automatically fall back to 8/6/4/2-digit stems).
              </p>
            )}
          </TabsContent>

          <TabsContent value="curl" className="mt-3">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10"><CopyButton text={curl} /></div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto"><code>{curl}</code></pre>
            </div>
          </TabsContent>

          <TabsContent value="js" className="mt-3">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10"><CopyButton text={js} /></div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto"><code>{js}</code></pre>
            </div>
          </TabsContent>

          <TabsContent value="sample" className="mt-3">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10"><CopyButton text={formatJson(sampleResponses[kind])} label="Copy JSON" /></div>
              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg text-sm overflow-x-auto max-h-[400px]">
                <code>{formatJson(sampleResponses[kind])}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export const PolicyApiExamples = () => (
  <div>
    <PolicyRunner kind="export" />
    <PolicyRunner kind="import" />
  </div>
);
