import { useState } from 'react';
import { Header } from '@/components/Header';
import { useTranslation } from 'react-i18next';
import { Footer } from '@/components/Footer';
import { CalculatorForm, Incoterm, CalculatorFormProps, CalculatorFormData } from '@/components/calculator/CalculatorForm';
import { useCountries } from '@/hooks/useCountries';
import { CalculatorResults } from '@/components/calculator/CalculatorResults';

import { useDutyCalculation, DutyCalculationRequest } from '@/hooks/useDutyCalculation';
import { DutyCalculationResponse } from '@/services/intgrowApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, 
  ArrowRight,
  Calculator as CalculatorIcon, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Package,
  Banknote,
  Ship,
  Plane,
  Truck,
  FileText,
  Pencil,
  Info,
  FileCode2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthDialog } from '@/components/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';

// Input Summary Panel Component
function InputSummaryPanel({ 
  request, 
  result,
  onEdit,
  selectedCurrencyCode,
}: { 
  request: DutyCalculationRequest; 
  result: DutyCalculationResponse;
  onEdit: () => void;
  selectedCurrencyCode?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const shipmentSummary = result.shipment_summary;
  const { data: countries } = useCountries();
  const importCurrencyCode = countries?.find((c) => c.name === shipmentSummary.import_country)?.currency || 'INR';
  const displayCurrency = selectedCurrencyCode || importCurrencyCode;

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'air': return <Plane className="h-4 w-4" />;
      case 'road': return <Truck className="h-4 w-4" />;
      default: return <Ship className="h-4 w-4" />;
    }
  };

  // Get origin country name from the request.org code
  const originCountryName = countries?.find(c => c.code.toLowerCase() === request.org)?.name || request.org.toUpperCase();
  const exportCountryName = countries?.find(c => c.code.toLowerCase() === request.exp)?.name || shipmentSummary.export_country;

  // Country route display
  const countryRoute = `${exportCountryName} → ${originCountryName} → ${shipmentSummary.import_country}`;

  const inputItems = [
    {
      icon: <FileText className="h-4 w-4" />,
      label: 'HS Code',
      value: shipmentSummary.import_hsn,
    },
    {
      icon: <Package className="h-4 w-4" />,
      label: 'Product Value',
      value: `${displayCurrency} ${request.value_of_product.toLocaleString()}`,
    },
    {
      icon: getTransportIcon(request.mode),
      label: 'Transport',
      value: `${request.mode.charAt(0).toUpperCase() + request.mode.slice(1)} / ${shipmentSummary.inco_term}`,
    },
    {
      icon: <Banknote className="h-4 w-4" />,
      label: 'CIF Value',
      value: displayCurrency !== importCurrencyCode
        ? `${displayCurrency} ${shipmentSummary.cif_value_import_country_currency} (${importCurrencyCode} ${shipmentSummary.cif_value_foreign_currency})`
        : `${importCurrencyCode} ${shipmentSummary.cif_value_import_country_currency}`,
    },
  ];

  // Add freight and insurance if applicable
  if (request.international_freight && request.international_freight > 0) {
    inputItems.push({
      icon: <Ship className="h-4 w-4" />,
      label: 'Int. Freight',
      value: `${displayCurrency} ${request.international_freight.toLocaleString()}`,
    });
  }
  if (request.insurance_charges && request.insurance_charges > 0) {
    inputItems.push({
      icon: <FileText className="h-4 w-4" />,
      label: 'Insurance',
      value: `${displayCurrency} ${request.insurance_charges.toLocaleString()}`,
    });
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-2 border-dashed bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalculatorIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Calculation Inputs</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{countryRoute}</span>
                    <span>•</span>
                    <span>HS {shipmentSummary.import_hsn}</span>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {shipmentSummary.inco_term}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardContent>
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardContent className="pt-0 pb-4 px-4">
              <div className="border-t pt-4">
                {/* Country Route Banner */}
                <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Exporting</p>
                    <p className="text-sm font-semibold">{exportCountryName}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="text-sm font-semibold">{originCountryName}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Importing</p>
                    <p className="text-sm font-semibold">{shipmentSummary.import_country}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {inputItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-background border flex items-center justify-center flex-shrink-0 text-muted-foreground">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium truncate" title={item.value}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </motion.div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

const Calculator = () => {
  const [result, setResult] = useState<DutyCalculationResponse | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<DutyCalculationRequest | null>(null);
  const [lastFormData, setLastFormData] = useState<CalculatorFormData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutate: calculateDuty, isPending } = useDutyCalculation();

  // Determine if we should show full-width results
  const showFullWidthResults = result !== null;

  const handleCalculate: CalculatorFormProps['onCalculate'] = (data) => {
    // Store form data for edit modal pre-population
    setLastFormData(data);

    // Send values as-is in the selected currency — the API handles conversion internally.
    const request: DutyCalculationRequest = {
      hscode: data.hsCode,
      imp: data.importingCountry.code.toLowerCase(),
      exp: data.exportingCountry.code.toLowerCase(),
      org: data.originCountry.code.toLowerCase(),
      currency: data.currency.code.toLowerCase(),
      value_of_product: data.productValue,
      mode: data.transportMode as 'sea' | 'air' | 'road',
      incoterm: data.incoterm,
      // Include user inputs if provided
      user_inputs: data.userInputs?.map(input => ({
        key: input.field,
        val: input.value,
      })),
      // Include charges based on incoterm
      ...(data.incoterm === 'EXW' && {
        origin_charges: data.originCharges || 0,
        origin_freight: data.originFreight || 0,
        international_freight: data.internationalFreight || 0,
        insurance_charges: data.insuranceCharges || 0,
      }),
      ...((data.incoterm === 'FOB' || data.incoterm === 'CIF') && {
        international_freight: data.internationalFreight || 0,
        insurance_charges: data.insuranceCharges || 0,
      }),
    };

    // Store the request for DutySaver analysis
    setLastRequest(request);

    setCalcError(null);
    calculateDuty(request, {
      onSuccess: (response) => {
        if (response.duty_calculations) {
          setResult(response);
          setEditModalOpen(false); // Close modal on success
        } else if (response.error) {
          setCalcError(response.error);
          toast.error(response.error);
        }
      },
      onError: (error) => {
        const message = error.message || 'Failed to calculate duties';
        setCalcError(message);
        toast.error(message);
      },
    });
  };

  const handleNewCalculation = () => {
    setResult(null);
    setLastRequest(null);
    setLastFormData(null);
  };

  return (
    <div className="min-h-screen flex flex-col calc-premium">
      <Header />
      <PageHeader
        eyebrow="Free Trade Agreements · Savings"
        title="Global Duty Calculator"
        description="Compare the normal customs duty with the Free Trade Agreement (FTA) rate using live tariff data. Customs duty savings are shown separately from total landed cost."
        actions={
          <>
            {showFullWidthResults && (
              <Button variant="outline" onClick={handleNewCalculation} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('calculator.newCalculation')}
              </Button>
            )}
          </>
        }
      />
      <main className="flex-1">
        <div className="container py-6">
          <Collapsible className="mb-6 rounded-md border bg-card">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium">
              <span className="flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Methodology and assumptions</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-4 py-3 text-sm text-muted-foreground space-y-1.5">
              <p>Customs value is built from the product value and, depending on the Incoterm, freight and insurance (CIF basis where the importing country uses it).</p>
              <p>Standard (MFN) duty and preferential duty are calculated on the same customs value; the difference is the estimated customs duty saving.</p>
              <p>GST, VAT, excise, anti-dumping, safeguard and other charges are not treated as waived by an FTA and remain in landed cost where applicable.</p>
              <p>Duty rates and calculations are powered by IntGrow's live global tariff data and carry their source. Results are estimates — confirm before quoting a price. Download PDF reports from the results view.</p>
            </CollapsibleContent>
          </Collapsible>

          <AnimatePresence mode="wait">
            {!showFullWidthResults ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Left: Calculator Form */}
                <div>
                  <CalculatorForm onCalculate={handleCalculate} isLoading={isPending} isAuthenticated={isAuthenticated} />
                </div>

                {/* Right: Placeholder */}
                <div className="space-y-6">
                  {calcError && !isPending ? (
                    <div role="alert" className="calc-card rounded-xl border border-destructive/40 bg-destructive/5 p-8 text-center">
                      <h3 className="calc-serif mb-2 text-2xl text-destructive">Duty values could not be calculated</h3>
                      <p className="text-muted-foreground text-lg">{calcError}</p>
                    </div>
                  ) : (
                    <div className="calc-card rounded-xl p-8 text-center">
                      <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <CalculatorIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="calc-serif mb-2 text-3xl">{t('calculator.readyTitle')}</h3>
                      <p className="text-muted-foreground text-lg">
                        {t('calculator.readyDesc')}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Collapsible Input Summary */}
                {result && lastRequest && (
                  <InputSummaryPanel 
                    request={lastRequest} 
                    result={result} 
                    onEdit={() => setEditModalOpen(true)}
                    selectedCurrencyCode={lastFormData?.currency?.code}
                  />
                )}

                {/* Full-width Results */}
                {result && (
                  <CalculatorResults 
                    result={result} 
                    calculationRequest={lastRequest || undefined}
                    selectedCurrencyCode={lastFormData?.currency?.code}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />

      {/* Edit Calculation Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              {t('calculator.editCalculation')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="p-6">
              <CalculatorForm 
                onCalculate={handleCalculate} 
                isLoading={isPending} 
                initialValues={lastFormData || undefined}
                isAuthenticated={isAuthenticated}
                isEditMode={true}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Auth Dialog */}
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </div>
  );
};

export default Calculator;
