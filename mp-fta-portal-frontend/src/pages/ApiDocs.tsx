import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, AlertTriangle, CheckCircle, Info, Code, Server, Globe, Calculator, Sparkles, FileText, ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { InteractiveApiExamples } from '@/components/api-docs/InteractiveApiExamples';
import { PolicyApiExamples } from '@/components/api-docs/PolicyApiExamples';

const TOC_ITEMS: { id: string; label: string; strong?: boolean }[] = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'calculator-api-mapping', label: 'Calculator Input → API Mapping', strong: true },
  { id: 'authentication', label: 'Authentication & Security' },
  { id: 'country-endpoints', label: 'Country Endpoints' },
  { id: 'currency-endpoints', label: 'Currency Endpoints' },
  { id: 'hscode-endpoints', label: 'HS Code Endpoints' },
  { id: 'user-input-endpoints', label: 'Dynamic User Input Endpoints' },
  { id: 'duty-calculator', label: 'Duty Calculator API' },
  { id: 'dutysaver-pro', label: 'DutySaver Pro API' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'interactive-examples', label: 'Interactive API Examples', strong: true },
  { id: 'policy-endpoints', label: 'Policy Endpoints (India ITC-HS)', strong: true },
  { id: 'examples', label: 'Complete Examples' },
  { id: 'support', label: 'Support & Notes' },
];

const ApiDocs = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const goToSection = (id: string) => {
    if (id !== 'getting-started') {
      setOpenItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
    // Wait for the accordion content to mount/expand before scrolling.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Global Duty Calculator · Calculator API</p>
          <h1 className="text-4xl font-semibold mb-4">Calculator API Documentation</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Reference for the tariff calculation and preferential duty (DutySaver) APIs that power the Global Duty Calculator. Technology partner: intGrow.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm"><Server className="h-3 w-3 mr-1" />Base URL: https://api4.intgrow.co</Badge>
            <Badge variant="outline" className="text-sm"><Code className="h-3 w-3 mr-1" />API Version: v3</Badge>
            <Badge className="bg-green-600 text-sm"><CheckCircle className="h-3 w-3 mr-1" />Production Ready</Badge>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOC_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className={`flex items-center gap-2 text-primary hover:underline text-left ${item.strong ? 'font-medium' : ''}`}
                >
                  <ArrowRight className="h-4 w-4 shrink-0" />{item.label}
                </button>
              ))}

            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />Getting Started
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                The intGrow API provides comprehensive import duty calculation services for international trade. 
                It supports duty calculations for 100+ countries with real-time tariff data.
              </p>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <p className="text-muted-foreground mb-2">// Base URL for all API requests</p>
                <p className="text-primary">https://api4.intgrow.co/api/v3/</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />Duty Calculator
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Calculate import duties, taxes, and total landed costs for any product using HS codes.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />DutySaver Pro
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Discover FTA-based preferential tariffs and potential duty savings opportunities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Accordion type="multiple" className="space-y-2" value={openItems} onValueChange={setOpenItems}>

        {/* Calculator Input to API Mapping */}
        <AccordionItem value="calculator-api-mapping" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" />Calculator Input → API Mapping</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="calculator-api-mapping" className="pt-2">
          <p className="text-muted-foreground mb-4">
            This section explains which API endpoint is used for each input field in the Duty Calculator, 
            the purpose of each API, and how they work together in the calculation workflow.
          </p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />API Workflow Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-3">The calculator uses APIs in this sequence:</p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-blue-50">1. Country Search</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-blue-50">2. Currency</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-blue-50">3. HS Code Search</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-blue-50">4. User Inputs</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-green-50">5. Calculate Duty</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-amber-50">6. Save Duty / DutySaver</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Flowchart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Complete API Call Sequence Flowchart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-lg border min-w-[800px]">
                  {/* Phase 1: Reference Data */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-blue-600">Phase 1</Badge>
                      <span className="font-semibold text-sm">Reference Data Collection</span>
                    </div>
                    <div className="flex items-start gap-4">
                      {/* Start */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-12 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
                          Start
                        </div>
                        <div className="w-0.5 h-8 bg-slate-400"></div>
                      </div>
                      
                      {/* Country Selection */}
                      <div className="flex flex-col items-center">
                        <div className="w-40 h-16 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">GET</span>
                          <span className="text-xs text-center">/country/search</span>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">Origin, Export, Import</div>
                        <div className="w-0.5 h-4 bg-slate-400"></div>
                        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90" />
                      </div>

                      {/* Currency */}
                      <div className="flex flex-col items-center">
                        <div className="w-40 h-16 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">GET</span>
                          <span className="text-xs text-center">/country/currency</span>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">Based on Import Country</div>
                        <div className="w-0.5 h-4 bg-slate-400"></div>
                        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90" />
                      </div>

                      {/* HS Code */}
                      <div className="flex flex-col items-center">
                        <div className="w-40 h-16 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">GET</span>
                          <span className="text-xs text-center">/hs_code/search</span>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">Product Classification</div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Dynamic Inputs */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-amber-600">Phase 2</Badge>
                      <span className="font-semibold text-sm">Dynamic Input Discovery</span>
                    </div>
                    <div className="flex items-start gap-4">
                      {/* Get User Input */}
                      <div className="flex flex-col items-center">
                        <div className="w-44 h-20 bg-amber-100 dark:bg-amber-900 border-2 border-amber-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">GET</span>
                          <span className="text-xs text-center font-medium">/get_user_input</span>
                          <span className="text-[10px] text-muted-foreground">Level 0 (Root selections)</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-slate-400 mt-7" />

                      {/* Decision Diamond */}
                       <div className="flex flex-col items-center">
                        <div className="w-32 h-20 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 transform rotate-0 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                          <span className="text-[10px] font-medium text-center px-2">value_type<br/>= selection?</span>
                        </div>
                        <div className="flex gap-8 mt-2 text-xs">
                          <span className="text-green-600 font-medium">Yes</span>
                          <span className="text-red-600 font-medium">No</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-green-500 mt-7" />

                      {/* Get Dynamic Input */}
                      <div className="flex flex-col items-center">
                        <div className="w-44 h-20 bg-orange-100 dark:bg-orange-900 border-2 border-orange-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-orange-700 dark:text-orange-300">GET</span>
                          <span className="text-xs text-center font-medium">/get_dynamic_input</span>
                          <span className="text-[10px] text-muted-foreground">Child levels (Level 1, 2, ...)</span>
                        </div>
                        <div className="text-[10px] mt-1 text-muted-foreground text-center">
                          ui_hsn_uid = parent hsn_uid<br/>
                          uis_hsn_uid_type = selected option
                        </div>
                      </div>

                      {/* Loop Arrow */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs text-muted-foreground mb-1">Repeat until</div>
                        <div className="w-20 h-10 border-2 border-dashed border-slate-400 rounded flex items-center justify-center">
                          <span className="text-[10px]">No more<br/>options</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Calculation */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-green-600">Phase 3</Badge>
                      <span className="font-semibold text-sm">Duty Calculation</span>
                    </div>
                    <div className="flex items-start gap-4">
                      {/* Manual Inputs */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-16 bg-slate-100 dark:bg-slate-700 border-2 border-slate-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-medium">Manual Inputs</span>
                          <span className="text-[10px] text-muted-foreground">Value, Incoterm, Charges</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-5">
                        <span className="text-xs text-muted-foreground">+</span>
                      </div>

                      {/* Collected User Inputs */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-16 bg-amber-50 dark:bg-amber-900/50 border-2 border-amber-300 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-medium">user_inputs[]</span>
                          <span className="text-[10px] text-muted-foreground">From Phase 2</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-slate-400 mt-5" />

                      {/* Calculate Duty */}
                      <div className="flex flex-col items-center">
                        <div className="w-44 h-20 bg-green-100 dark:bg-green-900 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-green-700 dark:text-green-300">POST</span>
                          <span className="text-xs text-center font-medium">/calculate_duty</span>
                          <span className="text-[10px] text-muted-foreground">Standard tariff</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-slate-400 mt-7" />

                      {/* Results */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-16 bg-green-50 dark:bg-green-900/50 border-2 border-green-300 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-medium">Duty Breakdown</span>
                          <span className="text-[10px] text-muted-foreground">Taxes, Total Landed Cost</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 4: FTA Analysis */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-purple-600">Phase 4</Badge>
                      <span className="font-semibold text-sm">FTA Savings Analysis (Optional)</span>
                    </div>
                    <div className="flex items-start gap-4">
                      {/* Same Request */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-16 bg-slate-100 dark:bg-slate-700 border-2 border-slate-400 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-medium">Same Request</span>
                          <span className="text-[10px] text-muted-foreground">From Phase 3</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-slate-400 mt-5" />

                      {/* Save Duty */}
                      <div className="flex flex-col items-center">
                        <div className="w-44 h-20 bg-purple-100 dark:bg-purple-900 border-2 border-purple-500 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">POST</span>
                          <span className="text-xs text-center font-medium">/save_duty</span>
                          <span className="text-[10px] text-muted-foreground">FTA-wise analysis</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-slate-400 mt-7" />

                      {/* FTA Evaluation */}
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-20 bg-purple-50 dark:bg-purple-900/50 border-2 border-purple-300 rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-medium">Evaluate Each FTA</span>
                          <span className="text-[10px] text-muted-foreground text-center">Compare duty_saved values<br/>by fta_duty_name</span>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-slate-400 mt-7" />

                      {/* Best Option */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex flex-col items-center justify-center p-2">
                          <span className="text-xs font-bold">Best FTA</span>
                          <span className="text-[10px]">Maximum Savings</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-8 pt-4 border-t border-slate-300 dark:border-slate-600">
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
                        <span>Reference Data APIs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-100 border border-amber-400 rounded"></div>
                        <span>Dynamic Input APIs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                        <span>Calculation APIs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded"></div>
                        <span>FTA Analysis APIs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Input Field → API Endpoint Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Calculator Input</TableHead>
                    <TableHead className="w-[250px]">API Endpoint</TableHead>
                    <TableHead className="w-[120px]">Method</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Origin Country</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/country/search</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Fetches list of all countries. Filter by <code className="bg-muted px-1 rounded">is_export=1</code> to show only countries that can be origin/manufacturing locations.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Exporting Country</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/country/search</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Same API as Origin Country. Filter by <code className="bg-muted px-1 rounded">is_export=1</code> to show countries that can ship/export goods.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Importing Country</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/country/search</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Same API. Filter by <code className="bg-muted px-1 rounded">is_import=1</code> to show destination countries where duties can be calculated.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Currency</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/country/currency?imp=XXX</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Fetches currencies available for the selected importing country. The <code className="bg-muted px-1 rounded">imp</code> parameter filters to show only relevant currencies.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">HS Code</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/hs_code/search?q=XXX&imp=XXX</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Searches HS codes by code or product name. Country-specific codes are returned based on the <code className="bg-muted px-1 rounded">imp</code> parameter.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Product Value</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground italic">— No API —</TableCell>
                    <TableCell><Badge variant="outline">Manual</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      User enters the product value directly. Sent as <code className="bg-muted px-1 rounded">value_of_product</code> in calculate_duty request.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Incoterm (EXW/FOB/CIF)</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground italic">— No API —</TableCell>
                    <TableCell><Badge variant="outline">Manual</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Static selection. Determines which charge fields are required (origin charges, freight, insurance).
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Transport Mode</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground italic">— No API —</TableCell>
                    <TableCell><Badge variant="outline">Manual</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Static selection (Sea/Air/Road). Sent as <code className="bg-muted px-1 rounded">mode</code> in calculate_duty request.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Origin/Freight/Insurance Charges</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground italic">— No API —</TableCell>
                    <TableCell><Badge variant="outline">Manual</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      User enters values based on incoterm. Sent as <code className="bg-muted px-1 rounded">origin_charges</code>, <code className="bg-muted px-1 rounded">international_freight</code>, <code className="bg-muted px-1 rounded">insurance_charges</code>.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-amber-50/50">
                    <TableCell className="font-medium">Anti-Dumping Duty Selection</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/get_user_input</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Returns dynamic fields for trade defense duties. Selections are filtered by <code className="bg-muted px-1 rounded">uis_imp_country</code>, <code className="bg-muted px-1 rounded">uis_org_country</code>, <code className="bg-muted px-1 rounded">uis_exp_country</code>.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-amber-50/50">
                    <TableCell className="font-medium">Countervailing Duty Selection</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/get_user_input</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Same API as Anti-Dumping. Fields with <code className="bg-muted px-1 rounded">field="countervailing"</code> are for countervailing duties.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-amber-50/50">
                    <TableCell className="font-medium">Additional Product Details</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/get_user_input</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Returns product-specific input requirements (e.g., alcohol %, composition, use type) based on HS code.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-amber-50/50">
                    <TableCell className="font-medium">Cascading/Conditional Inputs</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/get_dynamic_input</TableCell>
                    <TableCell><Badge className="bg-blue-600">GET</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      Fetches child options for <code className="bg-muted px-1 rounded">value_type="selection"</code> fields. Enables multi-level dynamic forms.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Calculation & Analysis APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Action</TableHead>
                    <TableHead className="w-[250px]">API Endpoint</TableHead>
                    <TableHead className="w-[120px]">Method</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-green-50/50">
                    <TableCell className="font-medium">Calculate Duty</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/calculate_duty</TableCell>
                    <TableCell><Badge className="bg-green-600">POST</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      <strong>Core calculation.</strong> Takes all input fields and returns duty breakdown, total duties, and landed cost. No authentication required.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-emerald-50/50">
                    <TableCell className="font-medium">Save Duty (Preferential)</TableCell>
                    <TableCell className="font-mono text-sm">/api/v3/save_duty</TableCell>
                    <TableCell><Badge className="bg-green-600">POST</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      <strong>FTA preferential tariffs.</strong> Returns available Free Trade Agreement options with preferential duty rates and potential savings. Used for DutySaver Pro comparison.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />API Purpose Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-blue-600">GET</Badge> /country/search
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Provides the master list of countries with import/export flags. Called once on page load to populate all three country dropdowns (Origin, Exporting, Importing).
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Filtering:</strong> Use <code className="bg-muted px-1 rounded">is_import=1</code> for destination countries, <code className="bg-muted px-1 rounded">is_export=1</code> for origin/shipping countries.
                  </p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-blue-600">GET</Badge> /country/currency
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Dynamically loads available currencies for the selected importing country. Ensures users can only select valid currencies for duty calculation.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Trigger:</strong> Called whenever the Importing Country selection changes.
                  </p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-blue-600">GET</Badge> /hs_code/search
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Enables product lookup by HS code or description. Returns country-specific HS codes based on the importing country's tariff schedule.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Trigger:</strong> Called as user types in the HS Code search field (debounced, min 2 characters).
                  </p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-blue-600">GET</Badge> /get_user_input
                    <Badge variant="outline" className="text-amber-600 border-amber-400">Level 0</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Returns the <strong>Level 0 (root-level)</strong> input fields for the given HS code and country. These are the initial/top-level selections such as Anti-Dumping Exporter, Countervailing Exporter, Safeguard duties, and additional product attributes. This is always the <strong>first call</strong> in the dynamic input discovery process.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Trigger:</strong> Called once after HS Code is selected to load the root-level dynamic form fields.
                  </p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-blue-600">GET</Badge> /get_dynamic_input
                    <Badge variant="outline" className="text-orange-600 border-orange-400">Child Levels</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Fetches <strong>child-level (Level 1, 2, ...)</strong> cascading options based on the user's selection in a parent field. For example, after selecting an Anti-Dumping Exporter (Level 0), this API returns the Anti-Dumping Declaration options (Level 1). This process repeats for deeper levels until no further child options exist.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Trigger:</strong> Called each time the user selects an option in a <code className="bg-muted px-1 rounded">value_type="selection"</code> field, to load the next child-level fields.
                  </p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-green-600">POST</Badge> /calculate_duty
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Core duty calculation engine. Computes all applicable duties (customs, VAT, excise, anti-dumping, etc.) and total landed cost.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Trigger:</strong> Called when user clicks "Calculate Duty" button with all required inputs.
                  </p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Badge className="bg-green-600">POST</Badge> /save_duty
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> Retrieves preferential tariff options under Free Trade Agreements. Returns FTA-specific duty rates and calculated savings.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Trigger:</strong> Called alongside calculate_duty to enable DutySaver Pro comparison.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Authentication & Security */}
        <AccordionItem value="authentication" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Authentication & Security</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="authentication" className="pt-2">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />API Key Authentication
                </h3>
                <p className="text-muted-foreground mb-4">
                  Most endpoints require an API key passed in the request header. Contact{' '}
                  <a href="mailto:support@intgrow.co" className="text-primary hover:underline">support@intgrow.co</a>{' '}
                  to obtain your API key.
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`// Required header for authenticated endpoints
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY"
}`}</pre>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Public vs Protected Endpoints</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Authentication</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-sm">/api/v3/calculate_duty</TableCell>
                      <TableCell><Badge variant="secondary">Public</Badge></TableCell>
                      <TableCell>Basic duty calculation</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">/api/v3/save_duty</TableCell>
                      <TableCell><Badge variant="secondary">Public</Badge></TableCell>
                      <TableCell>FTA preferential tariffs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">/api/v3/country/*</TableCell>
                      <TableCell><Badge>API Key Required</Badge></TableCell>
                      <TableCell>Country & currency data</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">/api/v3/hs_code/*</TableCell>
                      <TableCell><Badge>API Key Required</Badge></TableCell>
                      <TableCell>HS code search & details</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">/api/v3/get_user_input</TableCell>
                      <TableCell><Badge>API Key Required</Badge></TableCell>
                      <TableCell>Dynamic input fields</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />Security Best Practices
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Never expose your API key in client-side code or public repositories</li>
                  <li>Use environment variables to store API keys securely</li>
                  <li>Implement HTTPS for all API communications</li>
                  <li>Rotate API keys periodically for enhanced security</li>
                  <li>Monitor API usage for unusual patterns</li>
                </ul>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Country Endpoints */}
        <AccordionItem value="country-endpoints" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />Country Endpoints</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="country-endpoints" className="pt-2">
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/country/search</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Retrieves a list of all supported countries with their import/export capabilities.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Response Fields</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">value</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>ISO 3166-1 alpha-3 country code (lowercase)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">label</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Full country name</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">flag</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>ISO 3166-1 alpha-2 code for flag icon</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">is_import</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell>1 = country can be used as import destination</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">is_export</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell>1 = country can be used as origin/exporter</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">currency</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Default currency code for the country</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Response</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`[
  {
    "value": "ind",
    "label": "India",
    "flag": "in",
    "is_import": 1,
    "is_export": 1,
    "currency": "inr"
  },
  {
    "value": "usa",
    "label": "United States",
    "flag": "us",
    "is_import": 1,
    "is_export": 1,
    "currency": "usd"
  }
]`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Currency Endpoints */}
        <AccordionItem value="currency-endpoints" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />Currency Endpoints</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="currency-endpoints" className="pt-2">
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/country/currency</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Retrieves available currencies. When <code className="bg-muted px-1 rounded">imp</code> parameter is provided, 
                returns currencies available for that importing country.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">imp</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                      <TableCell>Importing country code (alpha-3) to filter currencies</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Fields</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">country</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Country name associated with the currency</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">currency</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Currency code (lowercase)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">unit</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Full currency name/unit</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">value</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Currency code used as value</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  GET /api/v3/country/currency?imp=ind
                </div>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* HS Code Endpoints */}
        <AccordionItem value="hscode-endpoints" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Code className="h-5 w-5 text-primary" />HS Code Endpoints</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="hscode-endpoints" className="pt-2">
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/hs_code/search</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Search for HS codes by code number or product description. Minimum 2 characters required for search.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">q</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Search query (min 2 characters) - HS code or product name</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">imp</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Importing country code to get country-specific HS codes</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Fields</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hs_code</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>The Harmonized System code</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">product</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Product description for the HS code</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  GET /api/v3/hs_code/search?q=coffee&imp=ind
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/hs_code/details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get detailed information for a specific HS code.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hs</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>The HS code to get details for</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dynamic User Input Endpoints */}
        <AccordionItem value="user-input-endpoints" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Dynamic User Input Endpoints</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="user-input-endpoints" className="pt-2">
          <p className="text-muted-foreground mb-4">
            These endpoints provide dynamic form fields based on the HS code and country configuration. 
            The process follows a <strong>two-step hierarchical pattern</strong>:
          </p>
          <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
            <h5 className="font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2">
              <Info className="h-4 w-4" />Level-Based Input Discovery
            </h5>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-2 ml-4 list-disc">
              <li><strong>Level 0 (Root) → <code className="bg-white dark:bg-amber-900 px-1 rounded">get_user_input</code></strong> — Returns the initial top-level selection fields (e.g., Anti-Dumping Exporter, Countervailing Exporter, Safeguard duties, product-specific attributes). Call this <strong>once</strong> after HS code selection.</li>
              <li><strong>Child Levels (1, 2, ...) → <code className="bg-white dark:bg-amber-900 px-1 rounded">get_dynamic_input</code></strong> — Returns cascading sub-options based on the user's parent selection (e.g., after selecting an Exporter at Level 0, fetch the Declaration options at Level 1). Call this <strong>each time</strong> a user makes a selection in a <code className="bg-white dark:bg-amber-900 px-1 rounded">value_type="selection"</code> field.</li>
            </ul>
          </div>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/get_user_input</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Retrieves the <strong>Level 0 (root-level)</strong> dynamic input fields required for duty calculation based on HS code and importing country. 
                This is always the first call in the input discovery process and returns the top-level selections such as Anti-Dumping Exporter, Countervailing Exporter, and product-specific attributes.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hscode</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>HS code for the product</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">imp</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Importing country code (alpha-3)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">org</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Origin (manufacturing) country code (alpha-3). Required for accurate trade-defense filtering of selections.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">exp</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Exporting country code (alpha-3). Required for accurate trade-defense filtering of selections.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Structure - UserInputField</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hsn_uid</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Unique identifier for the input field</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">label</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Display label for the field</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">field</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Field type identifier (e.g., "anti_dumping", "countervailing")</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">value_type</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>
                        <strong>Primary field type discriminator.</strong> Use this to determine how to render the input:
                        <br /><code className="bg-muted px-1 rounded">"selection"</code> → dropdown/option picker (uses <code className="bg-muted px-1 rounded">selections</code> array)
                        <br /><code className="bg-muted px-1 rounded">"number"</code> → numeric input (e.g., weight, quantity)
                        <br /><code className="bg-muted px-1 rounded">"string"</code> → free-text input
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">level</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Nesting level for cascading fields</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">parent_hsn_uid</TableCell>
                      <TableCell>string | null</TableCell>
                      <TableCell>Parent field ID for conditional/cascading inputs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">priority</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell>Display order priority</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">selections</TableCell>
                      <TableCell>array | null</TableCell>
                      <TableCell>Available options for selection-type fields</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">conditional</TableCell>
                      <TableCell>boolean</TableCell>
                      <TableCell>Whether field depends on parent selection</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Selection Object Fields</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">uis_hsn</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>HS code associated with selection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_hsn_uid</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Unique ID for selection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_label</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Display label for selection option</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_description</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Detailed description of selection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_imp_country</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Import country filter for this selection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_org_country</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Origin country filter for this selection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_exp_country</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Exporting country filter for this selection</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/get_dynamic_input</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Fetches <strong>child-level (Level 1, 2, ...)</strong> cascading input options based on the user's prior Level 0 selection. 
                For example, after the user selects an Anti-Dumping Exporter (Level 0 from <code className="bg-muted px-1 rounded">get_user_input</code>), 
                call this API to fetch the corresponding Anti-Dumping Declaration options (Level 1). Continue calling for deeper levels until no more child options exist.
              </p>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                <h5 className="font-semibold flex items-center gap-2 text-blue-800">
                  <Info className="h-4 w-4" />When to Call This API
                </h5>
                <p className="text-sm text-blue-700 mt-1">
                  Call <code className="bg-white dark:bg-slate-800 px-1 rounded">get_dynamic_input</code> when a user makes a selection in a <code className="bg-white dark:bg-slate-800 px-1 rounded">value_type: "selection"</code> field. 
                  This API returns the child/dependent fields that should be displayed based on that selection.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hscode</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>HS code for the product</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">imp</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Importing country code</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">org</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Origin country code</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">exp</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>Exporting country code</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">ui_hsn_uid</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>The <code className="bg-muted px-1 rounded">hsn_uid</code> of the parent field where the user made a selection</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">uis_hsn_uid_type</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge>Required</Badge></TableCell>
                      <TableCell>The <code className="bg-muted px-1 rounded">uis_hsn_uid_type</code> from the selected option. If empty in the response, use <code className="bg-muted px-1 rounded">uis_hsn_uid</code> or <code className="bg-muted px-1 rounded">uis_label</code> as the value to send.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h5 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <Info className="h-4 w-4" />Why are ui_hsn_uid &amp; uis_hsn_uid_type Required?
                </h5>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-2">
                  <p>
                    <strong>ui_hsn_uid</strong> — This is the field's own <code className="bg-white dark:bg-slate-800 px-1 rounded">hsn_uid</code> from the <code className="bg-white dark:bg-slate-800 px-1 rounded">get_user_input</code> response. It is <strong>always available</strong> and inherently required — it tells the API which parent field the user interacted with.
                  </p>
                  <p>
                    <strong>uis_hsn_uid_type</strong> — This query parameter is <strong>required to be sent</strong>, but the <strong>value is flexible</strong>. The API response from <code className="bg-white dark:bg-slate-800 px-1 rounded">get_user_input</code> does not always populate <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_hsn_uid_type</code> for every selection option. When it is empty or missing, use this fallback chain:
                  </p>
                  <ol className="list-decimal list-inside ml-2 space-y-1">
                    <li>Use <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_hsn_uid_type</code> if present in the selected option</li>
                    <li>Otherwise, use <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_hsn_uid</code> from the selected option</li>
                    <li>As a last resort, use <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_label</code> from the selected option</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h5 className="font-semibold flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />Parameter Value Mapping
                </h5>
                <p className="text-sm text-amber-700 mt-2 mb-3">
                  Understanding where parameter values come from:
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-sm">ui_hsn_uid</TableCell>
                      <TableCell className="text-sm">From the parent field's <code className="bg-white dark:bg-slate-800 px-1 rounded">hsn_uid</code> (the field where user clicked/selected)</TableCell>
                      <TableCell className="font-mono text-xs">"AD_EXPORTER_001"</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">uis_hsn_uid_type</TableCell>
                      <TableCell className="text-sm">From the selected option's <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_hsn_uid_type</code>. If empty, use <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_hsn_uid</code> or <code className="bg-white dark:bg-slate-800 px-1 rounded">uis_label</code></TableCell>
                      <TableCell className="font-mono text-xs">"EXPORTER_TYPE_A"</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h5 className="font-semibold flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />Complete Workflow Example
                </h5>
                <div className="text-sm text-green-700 mt-2 space-y-3">
                  <div className="bg-white p-3 rounded font-mono text-xs">
                    <p className="text-green-600 mb-2">// Step 1: Call get_user_input to get initial fields</p>
                    <p>GET /api/v3/get_user_input?hscode=09011110&imp=ind</p>
                    <p className="text-green-600 mt-3 mb-1">// Response includes field with hsn_uid="AD_EXPORTER", value_type="selection"</p>
                  </div>
                  <div className="bg-white p-3 rounded font-mono text-xs">
                    <p className="text-green-600 mb-2">// Step 2: User selects an option with uis_hsn_uid_type="5402200010_4_type6"</p>
                    <p className="text-green-600 mb-2">// Call get_dynamic_input to fetch child fields</p>
                    <p>GET /api/v3/get_dynamic_input?hscode=5402200010&imp=aut&org=chn&exp=ind&ui_hsn_uid=5402200010_3&uis_hsn_uid_type=5402200010_4_type6</p>
                  </div>
                  <div className="bg-white p-3 rounded font-mono text-xs">
                    <p className="text-green-600 mb-2">// Step 3: Response returns child fields (e.g., AD Declaration options)</p>
                    <p className="text-green-600">// These new fields appear in the form with parent_hsn_uid="AD_EXPORTER"</p>
                  </div>
                  <div className="bg-white p-3 rounded font-mono text-xs">
                    <p className="text-green-600 mb-2">// Step 4: Include ALL selected values in calculate_duty user_inputs array</p>
                    <p>{`user_inputs: [`}</p>
                    <p className="pl-4">{`{ "key": "AD_EXPORTER", "val": "CHN_EXPORTER_001" },`}</p>
                    <p className="pl-4">{`{ "key": "AD_DECLARATION", "val": "DECL_TYPE_B" }`}</p>
                    <p>{`]`}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Card */}
          <Card className="mt-6 border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                get_user_input vs get_dynamic_input - Key Differences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aspect</TableHead>
                    <TableHead>get_user_input</TableHead>
                    <TableHead>get_dynamic_input</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Purpose</TableCell>
                    <TableCell>Fetches <strong>initial/parent</strong> input fields for an HS code</TableCell>
                    <TableCell>Fetches <strong>child/cascading</strong> fields based on user selection</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">When to Call</TableCell>
                    <TableCell>Once after HS Code + Importing Country are selected</TableCell>
                    <TableCell>After user selects an option in a <code className="bg-muted px-1 rounded">value_type: "selection"</code> field</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Required Params</TableCell>
                    <TableCell><code className="bg-muted px-1 rounded">hscode</code>, <code className="bg-muted px-1 rounded">imp</code>, <code className="bg-muted px-1 rounded">org</code>, <code className="bg-muted px-1 rounded">exp</code></TableCell>
                    <TableCell><code className="bg-muted px-1 rounded">hscode</code>, <code className="bg-muted px-1 rounded">imp</code>, <code className="bg-muted px-1 rounded">org</code>, <code className="bg-muted px-1 rounded">exp</code>, <code className="bg-muted px-1 rounded">ui_hsn_uid</code></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Call Frequency</TableCell>
                    <TableCell>Once per HS Code change</TableCell>
                    <TableCell>Multiple times as user makes selections</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Required in New API?</TableCell>
                    <TableCell><Badge className="bg-green-600">Yes - Always</Badge></TableCell>
                    <TableCell><Badge className="bg-amber-600">Conditional</Badge> Only for <code className="bg-muted px-1 rounded">value_type: "selection"</code> fields</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Duty Calculator API */}
        <AccordionItem value="duty-calculator" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" />Duty Calculator API</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="duty-calculator" className="pt-2">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-600">POST</Badge>
                <span className="font-mono text-lg">/api/v3/calculate_duty</span>
                <Badge variant="secondary">Public</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Calculates import duties, taxes, and total landed cost for a shipment. This is the core calculation endpoint.
              </p>

              <Tabs defaultValue="request">
                <TabsList>
                  <TabsTrigger value="request">Request Payload</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="example">Example</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">hscode</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>Harmonized System code for the product</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">imp</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>Importing (destination) country code (alpha-3)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">exp</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>Exporting (shipping) country code (alpha-3)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">org</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>Origin (manufacturing) country code (alpha-3)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>Currency code for the product value (e.g., "usd", "eur")</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">value_of_product</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>Product value in the specified currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">mode</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge>Required</Badge></TableCell>
                        <TableCell>"sea" | "air" | "road" - Mode of transport</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">incoterm</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                        <TableCell>"EXW" | "FOB" | "CIF" - International Commercial Terms. Defaults to "CIF" if omitted.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">origin_charges</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                        <TableCell>Origin handling charges. Relevant for EXW incoterm; defaults to 0.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">origin_freight</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                        <TableCell>Domestic freight to port of export. Relevant for EXW incoterm; defaults to 0.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">international_freight</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                        <TableCell>International shipping cost. Relevant for EXW/FOB incoterms; defaults to 0.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">insurance_charges</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                        <TableCell>Insurance charges. Relevant for EXW/FOB incoterms; defaults to 0.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">user_inputs</TableCell>
                        <TableCell>array</TableCell>
                        <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                        <TableCell>Dynamic input values from get_user_input endpoint. Send an empty array <code className="bg-muted px-1 rounded">[]</code> if none are needed. When get_user_input returns fields, include all selections here for accurate results.</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h5 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-300">
                      <Info className="h-4 w-4" />Required vs Optional Fields
                    </h5>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 mb-2">
                       <code className="bg-white dark:bg-blue-900 px-1 rounded">hscode</code>, <code className="bg-white dark:bg-blue-900 px-1 rounded">imp</code>, <code className="bg-white dark:bg-blue-900 px-1 rounded">exp</code>, <code className="bg-white dark:bg-blue-900 px-1 rounded">org</code>, <code className="bg-white dark:bg-blue-900 px-1 rounded">currency</code>, <code className="bg-white dark:bg-blue-900 px-1 rounded">value_of_product</code>, and <code className="bg-white dark:bg-blue-900 px-1 rounded">mode</code> are mandatory. 
                       All other fields have sensible defaults. For the most accurate results, include <code className="bg-white dark:bg-blue-900 px-1 rounded">incoterm</code> and the relevant charge fields based on your incoterm.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h5 className="font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300">
                      <Info className="h-4 w-4" />user_inputs Array Format
                    </h5>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 mb-2">
                      If <code className="bg-white dark:bg-amber-900 px-1 rounded">/get_user_input</code> returns dynamic fields for the selected HS code, include all user selections in this array for the most accurate duty calculation.
                      If no dynamic inputs are required, send an empty array <code className="bg-white dark:bg-amber-900 px-1 rounded">[]</code> or omit the field entirely.
                    </p>
                    <div className="mt-2 bg-white p-3 rounded font-mono text-sm">
                      <pre>{`[
  { "key": "hsn_uid_value", "val": "selected_uis_hsn_uid" },
  { "key": "another_field_uid", "val": "selected_value" }
]`}</pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <h4 className="font-semibold">Top-Level Response</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">message</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Status message</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">duty_calculations</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>Duty breakdown with all applicable duties</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">shipment_summary</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>Complete shipment details and totals</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">error</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Error message if calculation failed</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Separator />

                  <h4 className="font-semibold">duty_calculations Object</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">local_duties</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>{"{ duties: DutyItem[], count: number }"} - Standard duties (customs, VAT, etc.)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">antidumping</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>{"{ duties: DutyItem[], count: number }"} - Trade defense duties</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_calculated_duty_import_country_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Total duty in importing country's currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_calculated_duty_foreign_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Total duty in selected foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">selected_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>The foreign currency code used</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Separator />

                  <h4 className="font-semibold">DutyItem Object</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">duty_name</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Internal duty identifier</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">duty_display_name</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Full display name for the duty</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">duty_short_name</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Abbreviated duty name (e.g., "BCD", "IGST")</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">duty_description</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Detailed description of the duty</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">display_duty_rate</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Duty rate percentage</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">calculated_duty_import_country_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Calculated amount in import country currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">calculated_duty_foreign_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Calculated amount in foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">tax_type</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Type of tax (e.g., "customs", "vat", "excise")</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">display_note</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Additional notes about the duty</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">remarks</TableCell>
                        <TableCell>string | null</TableCell>
                        <TableCell>Special remarks or conditions</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">master_notification_number</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Government notification reference</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Separator />

                  <h4 className="font-semibold">shipment_summary Object</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">import_country</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Destination country name</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">export_country</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Shipping country name</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">mode_of_transport</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Sea, Air, or Road</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">import_hsn</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>HS code used for calculation</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">hsn_description</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Product description for the HS code</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">inco_term</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Incoterm used (EXW, FOB, CIF)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">selected_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Foreign currency code</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">selected_currency_rate</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Exchange rate (1 local = X foreign)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">cif_value_import_country_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>CIF value in local currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">cif_value_foreign_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>CIF value in foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_calculated_duty_import_country_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Total duties in local currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_calculated_duty_foreign_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Total duties in foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_landed_cost_import_country_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Total landed cost (CIF + duties) in local currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_landed_cost_foreign_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Total landed cost in foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">dynamic_inputs</TableCell>
                        <TableCell>array</TableCell>
                        <TableCell>User selections summary for reference</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="example">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request</h4>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{`POST /api/v3/calculate_duty
Content-Type: application/json

{
  "hscode": "09011100",
  "imp": "ind",
  "exp": "usa",
  "org": "bra",
  "currency": "usd",
  "value_of_product": 10000,
  "mode": "sea",
  "incoterm": "FOB",
  "international_freight": 500,
  "insurance_charges": 100,
  "user_inputs": []
}`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Response</h4>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                        <pre>{`{
  "message": "Duty calculation successful",
  "duty_calculations": {
    "local_duties": {
      "duties": [
        {
          "duty_name": "basic_customs_duty",
          "duty_display_name": "Basic Customs Duty",
          "duty_short_name": "BCD",
          "duty_description": "Standard import duty rate",
          "display_duty_rate": 100,
          "calculated_duty_import_country_currency": 891000,
          "calculated_duty_foreign_currency": 10600,
          "tax_type": "customs",
          "priority": "1",
          "hsn_uid": "hs_001",
          "parent_hsn_uid": null,
          "display_note": "",
          "remarks": null,
          "master_notification_number": "1/2017-Customs"
        },
        {
          "duty_name": "igst",
          "duty_display_name": "Integrated Goods & Services Tax",
          "duty_short_name": "IGST",
          "duty_description": "GST on imports",
          "display_duty_rate": 5,
          "calculated_duty_import_country_currency": 89100,
          "calculated_duty_foreign_currency": 1060,
          "tax_type": "vat",
          "priority": "2",
          "hsn_uid": "hs_002",
          "parent_hsn_uid": null,
          "display_note": "",
          "remarks": null,
          "master_notification_number": "CGST Act"
        }
      ],
      "count": 2
    },
    "antidumping": {
      "duties": [],
      "count": 0
    },
    "total_calculated_duty_import_country_currency": 980100,
    "total_calculated_duty_foreign_currency": 11660,
    "selected_currency": "usd"
  },
  "shipment_summary": {
    "import_country": "India",
    "export_country": "United States",
    "mode_of_transport": "Sea",
    "import_hsn": "09011100",
    "hsn_description": "Coffee, not roasted: Not decaffeinated",
    "inco_term": "FOB",
    "selected_currency": "USD",
    "selected_currency_rate": "0.0119",
    "cif_value_import_country_currency": "891000",
    "cif_value_foreign_currency": "10600",
    "international_freight": "500",
    "insurance_charges": "100",
    "total_calculated_duty_import_country_currency": "980100",
    "total_calculated_duty_foreign_currency": "11660",
    "total_landed_cost_import_country_currency": "1871100",
    "total_landed_cost_foreign_currency": "22260",
    "dynamic_inputs": []
  }
}`}</pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* DutySaver Pro API */}
        <AccordionItem value="dutysaver-pro" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />DutySaver Pro API</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="dutysaver-pro" className="pt-2">
          <p className="text-muted-foreground mb-4">
            DutySaver Pro provides analysis of Free Trade Agreements (FTAs) and preferential tariffs that can reduce import duties.
          </p>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-600">POST</Badge>
                <span className="font-mono text-lg">/api/v3/save_duty</span>
                <Badge variant="secondary">Public</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Returns all applicable FTA-based preferential tariffs and calculates potential duty savings compared to standard MFN rates.
              </p>

              <Tabs defaultValue="request">
                <TabsList>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="example">Example</TabsTrigger>
                </TabsList>

                <TabsContent value="request">
                  <p className="text-muted-foreground mb-4">
                    Uses the same request payload as <code className="bg-muted px-1 rounded">/api/v3/calculate_duty</code>. 
                    See the Duty Calculator section for full payload documentation.
                  </p>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <h4 className="font-semibold">Top-Level Response</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">message</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Status message</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">fta</TableCell>
                        <TableCell>array</TableCell>
                        <TableCell>Array of FTA options with preferential tariffs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_fta_count</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Number of applicable FTAs found</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Separator />

                  <h4 className="font-semibold">FTA Option Object (SaveDutyFtaOption)</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">fta_duty_name</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>FTA agreement name (e.g., "India-ASEAN FTA")</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">fta_display_duty_rate</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Preferential duty rate percentage</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">fta_duty_display_name</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Full display name for the FTA duty</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">fta_duty_short_name</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Abbreviated FTA duty name</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">fta_duty_description</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Description of the preferential treatment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">calculated_duty_import_country_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>FTA duty amount in local currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">calculated_duty_foreign_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>FTA duty amount in foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">local_duties</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>Other applicable duties (VAT, excise) under this FTA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">antidumping</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>Trade defense duties (if applicable)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_calculated_duty_import_country_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Total duty with FTA in local currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">total_calculated_duty_foreign_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Total duty with FTA in foreign currency</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">duty_saved_import_country_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Amount saved in local currency vs MFN rate</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">duty_saved_foreign_currency</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Amount saved in foreign currency vs MFN rate</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">selected_currency</TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Foreign currency code</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">shipment_summary</TableCell>
                        <TableCell>object</TableCell>
                        <TableCell>Complete shipment summary (same structure as calculate_duty)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">master_notification_number</TableCell>
                        <TableCell>string | null</TableCell>
                        <TableCell>Government notification reference for the FTA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">master_footnote</TableCell>
                        <TableCell>string | null</TableCell>
                        <TableCell>Additional footnotes or conditions</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="example">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Response with Multiple FTA Options</h4>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                        <pre>{`{
  "message": "FTA analysis complete",
  "total_fta_count": 2,
  "fta": [
    {
      "fta_duty_name": "India-ASEAN Free Trade Agreement",
      "fta_display_duty_rate": "5",
      "fta_duty_display_name": "AIFTA Preferential Duty",
      "fta_duty_short_name": "AIFTA",
      "fta_duty_description": "Preferential rate under ASEAN-India FTA",
      "calculated_duty_import_country_currency": 44550,
      "calculated_duty_foreign_currency": 530,
      "local_duties": {
        "duties": [
          {
            "duty_name": "igst",
            "duty_display_name": "IGST",
            "duty_short_name": "IGST",
            "display_duty_rate": 5,
            "calculated_duty_import_country_currency": 46777,
            "calculated_duty_foreign_currency": 556
          }
        ],
        "count": 1
      },
      "antidumping": {
        "duties": [],
        "count": 0
      },
      "total_calculated_duty_import_country_currency": 91327,
      "total_calculated_duty_foreign_currency": 1086,
      "duty_saved_import_country_currency": 888773,
      "duty_saved_foreign_currency": 10574,
      "selected_currency": "usd",
      "shipment_summary": {
        "import_country": "India",
        "export_country": "Thailand",
        "total_landed_cost_import_country_currency": "982327",
        "total_landed_cost_foreign_currency": "11686"
      },
      "master_notification_number": "46/2011-Customs",
      "master_footnote": "Certificate of Origin required"
    },
    {
      "fta_duty_name": "India-Singapore CECA",
      "fta_display_duty_rate": "0",
      "fta_duty_display_name": "CECA Zero Duty",
      "fta_duty_short_name": "CECA",
      "fta_duty_description": "Zero duty under India-Singapore CECA",
      "calculated_duty_import_country_currency": 0,
      "calculated_duty_foreign_currency": 0,
      "duty_saved_import_country_currency": 891000,
      "duty_saved_foreign_currency": 10600
      // ... additional fields
    }
  ]
}`}</pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* save_duty - Primary FTA Analysis API */}
          <Card className="mb-6 border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                save_duty - Primary API for FTA Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                <p className="text-sm text-green-700">
                  Use <code className="bg-white dark:bg-slate-800 px-1 rounded">save_duty</code> for all FTA comparison and savings analysis.
                  Evaluate the <code className="bg-white dark:bg-slate-800 px-1 rounded">duty_saved_import_country_currency</code> field from each FTA option to identify 
                  the best savings opportunity.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h5 className="font-semibold flex items-center gap-2 text-blue-800">
                  <Info className="h-4 w-4" />Evaluating FTA Savings
                </h5>
                <p className="text-sm text-blue-700 mt-1 mb-2">
                  The <code className="bg-white dark:bg-slate-800 px-1 rounded">save_duty</code> response contains an array of FTA options. 
                  To identify the best option:
                </p>
                <div className="bg-white p-3 rounded font-mono text-xs">
                  <p className="text-blue-600 mb-2">// Sort by duty_saved_import_country_currency (highest first)</p>
                  <p>{`const sortedFTAs = response.fta.sort((a, b) =>`}</p>
                  <p className="pl-4">{`b.duty_saved_import_country_currency - a.duty_saved_import_country_currency`}</p>
                  <p>{`);`}</p>
                  <p className="text-blue-600 mt-2">// The first item has the highest savings</p>
                  <p>{`const bestOption = sortedFTAs[0];`}</p>
                </div>
              </div>
            </CardContent>
          </Card>

                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Error Handling */}
        <AccordionItem value="error-handling" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Error Handling</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="error-handling" className="pt-2">
          
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">HTTP Status Codes</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Meaning</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell><Badge className="bg-green-600">200</Badge></TableCell>
                      <TableCell>OK</TableCell>
                      <TableCell>Request successful</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">400</Badge></TableCell>
                      <TableCell>Bad Request</TableCell>
                      <TableCell>Invalid request parameters or payload</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">401</Badge></TableCell>
                      <TableCell>Unauthorized</TableCell>
                      <TableCell>Missing or invalid API key</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">403</Badge></TableCell>
                      <TableCell>Forbidden</TableCell>
                      <TableCell>API key doesn't have access to this resource</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">404</Badge></TableCell>
                      <TableCell>Not Found</TableCell>
                      <TableCell>Endpoint or resource not found</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">422</Badge></TableCell>
                      <TableCell>Unprocessable Entity</TableCell>
                      <TableCell>Validation error (e.g., invalid HS code)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">429</Badge></TableCell>
                      <TableCell>Too Many Requests</TableCell>
                      <TableCell>Rate limit exceeded</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Badge variant="destructive">500</Badge></TableCell>
                      <TableCell>Internal Server Error</TableCell>
                      <TableCell>Server-side error - contact support</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Error Response Format</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre>{`{
  "message": "Error description",
  "error": "Detailed error message",
  "code": "ERROR_CODE"  // Optional
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Common Error Scenarios</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-destructive">Invalid HS Code</h4>
                    <p className="text-sm text-muted-foreground mb-2">The provided HS code doesn't exist or isn't valid for the importing country.</p>
                    <div className="bg-muted p-2 rounded font-mono text-sm">
                      {"{ \"message\": \"Invalid HS code for specified country\" }"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-destructive">Country Not Supported</h4>
                    <p className="text-sm text-muted-foreground mb-2">The country code isn't supported for import/export.</p>
                    <div className="bg-muted p-2 rounded font-mono text-sm">
                      {"{ \"message\": \"Country not supported for import\" }"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-destructive">Missing Required Fields</h4>
                    <p className="text-sm text-muted-foreground mb-2">Required fields are missing from the request.</p>
                    <div className="bg-muted p-2 rounded font-mono text-sm">
                      {"{ \"message\": \"Missing required field: hscode\" }"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rate Limits */}
        <AccordionItem value="rate-limits" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" />Rate Limits</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="rate-limits" className="pt-2">
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Requests/Minute</TableHead>
                    <TableHead>Requests/Day</TableHead>
                    <TableHead>Burst Limit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><Badge variant="secondary">Free</Badge></TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Badge>Standard</Badge></TableCell>
                    <TableCell>60</TableCell>
                    <TableCell>5,000</TableCell>
                    <TableCell>20</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Badge className="bg-accent">Enterprise</Badge></TableCell>
                    <TableCell>300</TableCell>
                    <TableCell>Unlimited</TableCell>
                    <TableCell>100</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2 text-amber-800">
                  <Info className="h-4 w-4" />Rate Limit Headers
                </h4>
                <p className="text-sm text-amber-700 mt-2">
                  Check response headers for rate limit information:
                </p>
                <div className="mt-2 bg-white p-3 rounded font-mono text-sm">
                  <pre>{`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1699999999`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Interactive API Examples */}
        <AccordionItem value="interactive-examples" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Play className="h-5 w-5 text-primary" />Interactive API Examples</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="interactive-examples" className="pt-2">
          <p className="text-muted-foreground mb-6">
            Explore sample requests and responses for each API endpoint. Click to expand and copy code snippets directly into your application.
          </p>
          <InteractiveApiExamples />
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Policy Endpoints (India) */}
        <AccordionItem value="policy-endpoints" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />Policy Endpoints (India ITC-HS)</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="policy-endpoints" className="pt-2">

          <p className="text-muted-foreground mb-6">
            DGFT ITC-HS import and export policy lookup. Both endpoints accept an HS code or a product keyword and
            return paginated policy records. In the calculator, the <strong>Import Policy</strong> tab appears when the
            importing country is India, and the <strong>Export Policy</strong> tab appears when the exporting or origin
            country is India.
          </p>

          <h3 className="text-lg font-semibold mb-3">Interactive Examples — run against the live API</h3>
          <PolicyApiExamples />

          <h3 className="text-lg font-semibold mb-3 mt-6">Full Reference</h3>



          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/export_policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Returns the DGFT export policy (Free / Restricted / Prohibited / STE) for an ITC-HS code or product description.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hscode_or_product_info</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge className="bg-destructive">Required</Badge></TableCell>
                      <TableCell>ITC-HS code (2–8 digits) or product keyword, e.g. <code className="bg-muted px-1 rounded">21011100</code> or <code className="bg-muted px-1 rounded">coffee</code></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">page</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                      <TableCell>Page number, defaults to 1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">limit</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                      <TableCell>Records per page, defaults to 25</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Fields</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">itc_hs_code</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>8-digit Indian ITC-HS code</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">policy_description</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Product description of the tariff line</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">export_policy</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Policy status: Free, Restricted, Prohibited or STE</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">nature_of_restriction</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Conditions / licensing requirements attached to the policy</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">unit</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Unit of quantity for the tariff line</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">*_notes</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Footnotes for the corresponding field (may be null)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">pagination</TableCell>
                      <TableCell>object</TableCell>
                      <TableCell>page, limit, total, totalPages, hasNext, hasPrev</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`curl "https://api4.intgrow.co/api/v3/export_policy?hscode_or_product_info=21011100&page=1&limit=25" \\
  -H "x-api-key: your-api-key"`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Response</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "data": [
    {
      "itc_hs_code": "21011100",
      "policy_description": "Extracts, essences and concentrates of coffee",
      "policy_description_notes": null,
      "export_policy": "Free",
      "export_policy_notes": null,
      "nature_of_restriction": null,
      "nature_of_restriction_notes": null,
      "unit": "KGS",
      "last_update": "2024-04-01"
    }
  ]
}`}</pre>
                </div>
              </div>

              <div className="p-4 bg-muted/50 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4 text-primary" />HS Code Fallback
                </h4>
                <p className="text-sm text-muted-foreground">
                  Indian ITC-HS lines are 8 digits while foreign codes may be 10 digits and diverge after the 6th digit.
                  Query the full code first, then retry with 8, 6, 4 and 2-digit stems until <code className="bg-muted px-1 rounded">data</code> is non-empty.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-600">GET</Badge>
                <span className="font-mono text-lg">/api/v3/import_policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Returns the DGFT import policy for an ITC-HS code or product description. Same parameters and pagination
                shape as the export policy endpoint.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">hscode_or_product_info</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell><Badge className="bg-destructive">Required</Badge></TableCell>
                      <TableCell>ITC-HS code (2–8 digits) or product keyword</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">page</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                      <TableCell>Page number, defaults to 1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">limit</TableCell>
                      <TableCell>number</TableCell>
                      <TableCell><Badge variant="outline">Optional</Badge></TableCell>
                      <TableCell>Records per page, defaults to 25</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Fields</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">itc_hs_code</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>8-digit Indian ITC-HS code</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">policy_description</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Product description of the tariff line</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">policy</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Policy status: Free, Restricted, Prohibited or STE</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">restrictions_policy_conditions</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Licensing conditions or restrictions</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">explanation</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Additional DGFT explanation for the tariff line</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">*_notes</TableCell>
                      <TableCell>string</TableCell>
                      <TableCell>Footnotes for the corresponding field (may be null)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`curl "https://api4.intgrow.co/api/v3/import_policy?hscode_or_product_info=61032200&page=1&limit=25" \\
  -H "x-api-key: your-api-key"`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Response</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "data": [
    {
      "itc_hs_code": "61032200",
      "policy_description": "Of cotton",
      "policy_description_notes": null,
      "policy": "Free",
      "policy_notes": null,
      "restrictions_policy_conditions": null,
      "restrictions_policy_conditions_notes": null,
      "explanation": null,
      "explanation_notes": null,
      "last_update": "2024-04-01"
    }
  ]
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">JavaScript Example (with stem fallback)</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`async function getPolicy(kind, hsCode) {
  const numeric = hsCode.replace(/\\D/g, "");
  const stems = [...new Set([numeric, numeric.slice(0, 8), numeric.slice(0, 6),
                             numeric.slice(0, 4), numeric.slice(0, 2)])]
    .filter((s) => s.length >= 2);

  for (const stem of stems) {
    const res = await fetch(
      \`https://api4.intgrow.co/api/v3/\${kind}_policy?hscode_or_product_info=\${stem}&page=1&limit=25\`,
      { headers: { "x-api-key": API_KEY } }
    );
    const json = await res.json();
    if (json?.data?.length) return { ...json, matched_hs_code: stem };
  }
  return { data: [], count: 0 };
}

// India export policy for a 10-digit foreign code
await getPolicy("export", "2101110000");`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>


        {/* Complete Examples */}
        <AccordionItem value="examples" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Code className="h-5 w-5 text-primary" />Complete Examples</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="examples" className="pt-2">
          
          <Tabs defaultValue="javascript">
            <TabsList className="mb-4">
              <TabsTrigger value="javascript">JavaScript/TypeScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>

            <TabsContent value="javascript">
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`// Complete Duty Calculation Example with TypeScript

interface DutyRequest {
  hscode: string;
  imp: string;
  exp: string;
  org: string;
  currency: string;
  value_of_product: number;
  mode: "sea" | "air" | "road";
  incoterm?: "EXW" | "FOB" | "CIF";
  international_freight?: number;
  insurance_charges?: number;
  user_inputs?: Array<{ key: string; val: string }>;
}

const API_BASE = "https://api4.intgrow.co";
const API_KEY = "your-api-key";

// Helper function for API calls
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(\`\${API_BASE}\${endpoint}\`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API error" }));
    throw new Error(error.message);
  }

  return response.json();
}

// 1. Get countries list
async function getCountries() {
  return apiRequest<any[]>("/api/v3/country/search");
}

// 2. Search HS codes
async function searchHsCodes(query: string, importCountry: string) {
  return apiRequest<any[]>(
    \`/api/v3/hs_code/search?q=\${encodeURIComponent(query)}&imp=\${importCountry}\`
  );
}

// 3. Get dynamic inputs
async function getDynamicInputs(hsCode: string, importCountry: string) {
  return apiRequest<any>(
    \`/api/v3/get_user_input?hscode=\${hsCode}&imp=\${importCountry}\`
  );
}

// 4. Calculate duty (no API key needed)
async function calculateDuty(request: DutyRequest) {
  const response = await fetch(\`\${API_BASE}/api/v3/calculate_duty\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return response.json();
}

// 5. Get FTA savings (no API key needed)
async function getSavings(request: DutyRequest) {
  const response = await fetch(\`\${API_BASE}/api/v3/save_duty\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return response.json();
}

// Complete flow example
async function calculateImportDuty() {
  try {
    // Step 1: Define calculation parameters
    const request: DutyRequest = {
      hscode: "09011100",
      imp: "ind",
      exp: "usa",
      org: "bra",
      currency: "usd",
      value_of_product: 10000,
      mode: "sea",
      incoterm: "FOB",
      international_freight: 500,
      insurance_charges: 100,
    };

    // Step 2: Calculate standard duty
    const dutyResult = await calculateDuty(request);
    console.log("Standard Duty:", dutyResult.duty_calculations.total_calculated_duty_foreign_currency);

    // Step 3: Check for FTA savings
    const savingsResult = await getSavings(request);
    if (savingsResult.total_fta_count > 0) {
      const bestFta = savingsResult.fta[0];
      console.log("Potential Savings:", bestFta.duty_saved_foreign_currency);
      console.log("FTA Used:", bestFta.fta_duty_name);
    }

    return { dutyResult, savingsResult };
  } catch (error) {
    console.error("Calculation failed:", error);
    throw error;
  }
}

// Run the example
calculateImportDuty().then(console.log);`}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="python">
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`import requests
from typing import Optional, List, Dict, Any

API_BASE = "https://api4.intgrow.co"
API_KEY = "your-api-key"

def api_request(endpoint: str, method: str = "GET", data: Optional[Dict] = None) -> Any:
    """Make an authenticated API request."""
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }
    
    url = f"{API_BASE}{endpoint}"
    
    if method == "GET":
        response = requests.get(url, headers=headers)
    else:
        response = requests.post(url, json=data, headers=headers)
    
    response.raise_for_status()
    return response.json()


def get_countries() -> List[Dict]:
    """Get list of supported countries."""
    return api_request("/api/v3/country/search")


def search_hs_codes(query: str, import_country: str) -> List[Dict]:
    """Search for HS codes by query."""
    from urllib.parse import quote
    return api_request(f"/api/v3/hs_code/search?q={quote(query)}&imp={import_country}")


def calculate_duty(
    hscode: str,
    imp: str,
    exp: str,
    currency: str,
    value_of_product: float,
    mode: str = "sea",
    org: str,
    incoterm: str = "CIF",
    international_freight: float = 0,
    insurance_charges: float = 0,
    user_inputs: Optional[List[Dict]] = None
) -> Dict:
    """Calculate import duty for a shipment."""
     payload = {
        "hscode": hscode,
        "imp": imp,
        "exp": exp,
        "org": org,
        "currency": currency,
        "value_of_product": value_of_product,
        "mode": mode,
        "incoterm": incoterm,
        "international_freight": international_freight,
        "insurance_charges": insurance_charges,
        "user_inputs": user_inputs or []
    }
    
    # calculate_duty doesn't require API key
    response = requests.post(
        f"{API_BASE}/api/v3/calculate_duty",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    response.raise_for_status()
    return response.json()


def get_fta_savings(
    hscode: str,
    imp: str,
    exp: str,
    currency: str,
    value_of_product: float,
    mode: str = "sea",
    **kwargs
) -> Dict:
    """Get FTA-based preferential tariff options."""
    payload = {
        "hscode": hscode,
        "imp": imp,
        "exp": exp,
        "currency": currency,
        "value_of_product": value_of_product,
        "mode": mode,
        **kwargs
    }
    
    response = requests.post(
        f"{API_BASE}/api/v3/save_duty",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    response.raise_for_status()
    return response.json()


# Example usage
if __name__ == "__main__":
    # Calculate duty for coffee import
    result = calculate_duty(
        hscode="09011100",
        imp="ind",
        exp="usa",
        org="bra",
        currency="usd",
        value_of_product=10000,
        mode="sea",
        incoterm="FOB",
        international_freight=500,
        insurance_charges=100
    )
    
    print(f"Total Duty: {result['duty_calculations']['total_calculated_duty_foreign_currency']} USD")
    print(f"Landed Cost: {result['shipment_summary']['total_landed_cost_foreign_currency']} USD")
    
    # Check FTA savings
    savings = get_fta_savings(
        hscode="09011100",
        imp="ind",
        exp="usa",
        currency="usd",
        value_of_product=10000,
        mode="sea"
    )
    
    if savings["total_fta_count"] > 0:
        best_fta = savings["fta"][0]
        print(f"\\nPotential Savings: {best_fta['duty_saved_foreign_currency']} USD")
        print(f"FTA: {best_fta['fta_duty_name']}")`}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curl">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Get Countries</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`curl -X GET "https://api4.intgrow.co/api/v3/country/search" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY"`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Search HS Codes</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`curl -X GET "https://api4.intgrow.co/api/v3/hs_code/search?q=coffee&imp=ind" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY"`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Calculate Duty</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`curl -X POST "https://api4.intgrow.co/api/v3/calculate_duty" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hscode": "09011100",
    "imp": "ind",
    "exp": "usa",
    "org": "bra",
    "currency": "usd",
    "value_of_product": 10000,
    "mode": "sea",
    "incoterm": "FOB",
    "international_freight": 500,
    "insurance_charges": 100
  }'`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Get FTA Savings</h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`curl -X POST "https://api4.intgrow.co/api/v3/save_duty" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hscode": "09011100",
    "imp": "ind",
    "exp": "usa",
    "currency": "usd",
    "value_of_product": 10000,
    "mode": "sea"
  }'`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
                    </div>
          </AccordionContent>
        </AccordionItem>

        {/* Support & Notes */}
        <AccordionItem value="support" className="border rounded-lg mb-4 px-2">
          <AccordionTrigger className="text-xl font-bold hover:no-underline gap-2 py-3">
            <span className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Support & End Notes</span>
          </AccordionTrigger>
          <AccordionContent>
            <div id="support" className="pt-2">
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Support</h4>
                  <p className="text-muted-foreground">
                    For API integration support, please email{' '}
                    <a href="mailto:support@intgrow.co" className="text-primary hover:underline">
                      support@intgrow.co
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">API Key Requests</h4>
                  <p className="text-muted-foreground">
                    To request an API key or upgrade your plan, contact our sales team.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Interactive API Docs</h4>
                  <p className="text-muted-foreground">
                    Try the interactive API documentation at{' '}
                    <a 
                      href="https://api4.intgrow.co/api/v3/docs/api/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      api4.intgrow.co/api/v3/docs/api/
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />Data Accuracy
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Tariff rates are updated regularly but may not reflect real-time changes. 
                    Always verify with official customs authorities for compliance.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Info className="h-4 w-4" />FTA Eligibility
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    FTA preferential rates require Certificate of Origin (COO) and compliance 
                    with Rules of Origin. DutySaver Pro results are indicative only.
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />Coverage
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    The API currently covers 100+ countries with comprehensive HS code data 
                    and 50+ FTA agreements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4">Changelog & Versioning</h4>
              <p className="text-muted-foreground mb-4">
                The current API version is <code className="bg-muted px-1 rounded">v3</code>. 
                We follow semantic versioning and provide deprecation notices before breaking changes.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Changes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><Badge>v3.0</Badge></TableCell>
                    <TableCell>Current</TableCell>
                    <TableCell>Streamlined value_type handling, removed has_options, improved documentation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Badge variant="outline">v2.0</Badge></TableCell>
                    <TableCell>Previous</TableCell>
                    <TableCell>Added DutySaver Pro, dynamic inputs, multi-currency support</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Badge variant="outline">v1.0</Badge></TableCell>
                    <TableCell>Deprecated</TableCell>
                    <TableCell>Initial release with basic duty calculation</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
                    </div>
          </AccordionContent>
        </AccordionItem>

        </Accordion>

      </main>
      <Footer />
    </div>
  );
};

export default ApiDocs;
