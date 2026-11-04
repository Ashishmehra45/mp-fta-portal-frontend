import { UpdatedAsOn } from '@/components/portal/UpdatedAsOn';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DutyCalculationResponse, DutyCalculationRequest, DutyItem, SaveDutyFtaOption, SaveDutyResponse } from '@/services/intgrowApi';
import { useCountries } from '@/hooks/useCountries';
import { cleanApiText } from '@/lib/utils';
import {
  Sparkles,
  TrendingDown,
  FileText,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Wallet,
  Landmark,
  Maximize2,
  X,
  Award,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DutySaverComparisonProps {
  result: DutyCalculationResponse;
  calculationRequest?: DutyCalculationRequest;
  openTrigger?: number;
  selectedCurrencyCode?: string;
  inline?: boolean;
  saveDutyData?: SaveDutyResponse | null;
  saveDutyLoading?: boolean;
  saveDutyError?: Error | null;
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
  };
  return symbols[code] || code;
}

function parseFormattedNumber(value?: string | null): number {
  if (!value) return 0;
  return parseFloat(value.replace(/,/g, '')) || 0;
}

// Format amounts: 2 decimals only when value > 0, else just "0"
function fmtAmt(value: number): string {
  if (value === 0) return '0';
  if (Number.isInteger(value)) return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Collapsible Duty Row for both tables
function DutyDetailRow({
  duty,
  importCurrencyCode,
  importCurrencySymbol,
  foreignCurrencyCode,
  foreignCurrencySymbol,
  showDualCurrency,
}: {
  duty: DutyItem;
  importCurrencyCode: string;
  importCurrencySymbol: string;
  foreignCurrencyCode: string;
  foreignCurrencySymbol: string;
  showDualCurrency: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  // API: _import_country_currency = selected/primary currency, _foreign_currency = native/secondary currency
  const importAmount = duty.calculated_duty_import_country_currency ?? 0;
  const foreignAmount = duty.calculated_duty_foreign_currency ?? 0;
  const dutyLabel = cleanApiText(duty.duty_display_name || duty.duty_short_name || duty.display_note || duty.duty_name || '');
  const rateRaw = duty.local_display_rate || duty.display_duty_rate;
  const rate = typeof rateRaw === 'number' ? `${rateRaw}%` : String(rateRaw || '0');

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-accent/50 transition-all duration-200 group"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="py-4">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-foreground tracking-tight text-sm md:text-base">{dutyLabel}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground/60 hover:text-primary cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs w-64 p-3">
                  <p className="text-sm leading-relaxed">{duty.duty_description || 'No description available'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>
        <TableCell className="text-center py-4">
          <Badge variant="outline" className="font-mono px-3 py-1 bg-muted/50 max-w-[200px] whitespace-normal text-center leading-tight font-bold text-xs md:text-sm">
            {rate}
          </Badge>
        </TableCell>
        <TableCell className="text-right py-4">
          <div className="space-y-0.5">
            <p className="font-bold text-foreground text-sm md:text-base tracking-tight">
              {fmtAmt(importAmount)}
            </p>
            {showDualCurrency && (
              <p className="text-muted-foreground font-medium text-xs md:text-sm">
                {fmtAmt(foreignAmount)}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell className="w-10 py-4">
          <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </TableCell>
      </TableRow>
      <AnimatePresence>
        {expanded && (
          <TableRow>
            <TableCell colSpan={4} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-muted/40 to-muted/20 border-t border-border/50 space-y-3">
                  <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">{duty.duty_description}</p>
                  {duty.master_notification_number && (
                    <div className="flex items-center gap-2 bg-background/60 rounded-md px-3 py-2 w-fit">
                      <FileText className="h-4 w-4 text-primary/70 flex-shrink-0" />
                      <span className="font-medium text-foreground/70 text-xs md:text-sm">{duty.master_notification_number}</span>
                    </div>
                  )}
                  {duty.master_footnote && (
                    <p className="text-muted-foreground italic border-l-2 border-primary/30 pl-3 text-xs md:text-sm">{duty.master_footnote}</p>
                  )}
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}

// Tariff Table Component
function TariffTable({
  title,
  headerColor,
  duties,
  totalDuty,
  totalDutyForeign,
  importCurrencyCode,
  importCurrencySymbol,
  foreignCurrencyCode,
  foreignCurrencySymbol,
  showDualCurrency,
  isLoading = false,
  error = null,
  noSavings = false,
}: {
  title: string;
  headerColor: 'primary' | 'emerald';
  duties: DutyItem[];
  totalDuty: number;
  totalDutyForeign: number;
  importCurrencyCode: string;
  importCurrencySymbol: string;
  foreignCurrencyCode: string;
  foreignCurrencySymbol: string;
  showDualCurrency: boolean;
  isLoading?: boolean;
  error?: Error | null;
  noSavings?: boolean;
}) {
  const bgColor = headerColor === 'primary' ? 'bg-primary' : 'bg-emerald-600';
  const textColor = 'text-white';

  return (
    <Card className="overflow-hidden border-2 shadow-lg flex-1 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className={`${bgColor} hover:${bgColor}`}>
            <TableHead colSpan={4} className={`${textColor} font-bold py-3 md:py-4 tracking-tight text-base md:text-lg`}>
              {title}
            </TableHead>
          </TableRow>
          <TableRow className="bg-muted/40 border-b-2 border-border/50">
            <TableHead className="font-bold text-foreground py-3 uppercase tracking-wider text-[10px] md:text-xs">Duty Type</TableHead>
            <TableHead className="text-center font-bold text-foreground py-3 uppercase tracking-wider text-[10px] md:text-xs">
              <div className="flex items-center justify-center gap-1.5">
                Rate (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground/60 hover:text-primary cursor-help transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64 p-3">
                      <p className="text-sm leading-relaxed">Percentage rate applied to assessable value</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="text-right font-bold text-foreground py-3 uppercase tracking-wider text-[10px] md:text-xs">
              <div>
                <span>Amount</span>
                <p className="font-semibold text-muted-foreground mt-0.5 normal-case tracking-normal text-[10px] md:text-xs">
                  {importCurrencyCode}{showDualCurrency && ` / ${foreignCurrencyCode}`}
                </p>
              </div>
            </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Data unavailable</span>
                </div>
              </TableCell>
            </TableRow>
          ) : duties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No duties applicable
              </TableCell>
            </TableRow>
          ) : (
            <>
              {duties.map((duty, index) => (
                <DutyDetailRow
                  key={`duty-${duty.duty_name}-${index}`}
                  duty={duty}
                  importCurrencyCode={importCurrencyCode}
                  importCurrencySymbol={importCurrencySymbol}
                  foreignCurrencyCode={foreignCurrencyCode}
                  foreignCurrencySymbol={foreignCurrencySymbol}
                  showDualCurrency={showDualCurrency}
                  
                />
              ))}
            </>
          )}
          {/* Total Row */}
          <TableRow className={`${noSavings ? 'bg-red-50 dark:bg-red-950/30' : headerColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-primary/5'} border-t-2 border-border`}>
            <TableCell colSpan={2} className="py-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-foreground tracking-tight text-sm md:text-base">Total Payable</span>
                {noSavings && (
                  <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                    <XCircle className="h-4 w-4" />
                    No Saving
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right py-4">
              <div className="space-y-0.5">
                <p className={`text-lg md:text-2xl font-bold tracking-tight ${noSavings ? 'text-red-600 dark:text-red-400' : headerColor === 'emerald' ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary'}`}>
                  {fmtAmt(totalDuty)}
                </p>
                {showDualCurrency && (
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {fmtAmt(totalDutyForeign)}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

export function DutySaverComparison({ result, calculationRequest, openTrigger, selectedCurrencyCode, inline = false, saveDutyData, saveDutyLoading, saveDutyError }: DutySaverComparisonProps) {
  const { duty_calculations, shipment_summary } = result;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNoSavingsPopup, setShowNoSavingsPopup] = useState(false);

  const { data: countries } = useCountries();

  const importCurrencyCode =
    countries?.find((c) => c.name === shipment_summary.import_country)?.currency || 'INR';
  const foreignCurrencyCode = selectedCurrencyCode || importCurrencyCode;

  const currencySymbol = getCurrencySymbol(importCurrencyCode);
  const foreignCurrencySymbol = getCurrencySymbol(foreignCurrencyCode);
  const isDefaultCurrency = foreignCurrencyCode === importCurrencyCode;
  const primaryCurrencyCode = isDefaultCurrency ? importCurrencyCode : foreignCurrencyCode;
  const secondaryCurrencyCode = isDefaultCurrency ? foreignCurrencyCode : importCurrencyCode;

  // Standard Tariff data from Calculate Duty API (already in result)
  const standardDuties = [
    ...duty_calculations.local_duties.duties,
    ...duty_calculations.antidumping.duties,
  ];
  const standardTotalDuty = duty_calculations.total_calculated_duty_import_country_currency;
  const standardTotalDutyForeign = duty_calculations.total_calculated_duty_foreign_currency;

  // Preferential Tariff data passed from parent (triggered only on DutySaver Pro click)
  const saveDutyResult = saveDutyData || null;
  const isLoading = saveDutyLoading || false;
  const error = saveDutyError || null;

  // Get FTA options from the API response
  const ftaOptions = saveDutyResult?.fta || [];
  const ftaCount = saveDutyResult?.total_fta_count || ftaOptions.length;

  // State for selected FTA index
  const [selectedFtaIndex, setSelectedFtaIndex] = useState(0);

  // Helper: compute savings based on totals (more reliable than API-reported duty_saved)
  const getComputedSaving = (fta: SaveDutyFtaOption | null | undefined) => {
    if (!fta) return 0;
    const prefTotal = fta.total_calculated_duty_import_country_currency ?? 0;
    return Math.max(0, standardTotalDuty - prefTotal);
  };

  const getComputedSavingForeign = (fta: SaveDutyFtaOption | null | undefined) => {
    if (!fta) return 0;
    const prefTotalForeign = fta.total_calculated_duty_foreign_currency ?? 0;
    return Math.max(0, standardTotalDutyForeign - prefTotalForeign);
  };

  // Find the best FTA index (one with highest computed savings)
  const bestFtaIndex = ftaOptions.length > 0
    ? ftaOptions.reduce((bestIdx, current, idx, arr) =>
      (getComputedSaving(current) > getComputedSaving(arr[bestIdx])) ? idx : bestIdx
      , 0)
    : 0;

  // Check if ANY FTA has savings
  const anyFtaHasSavings = ftaOptions.some(fta => getComputedSaving(fta) > 0);

  // Reset to best FTA when results change
  useEffect(() => {
    if (ftaOptions.length > 0) {
      setSelectedFtaIndex(bestFtaIndex);
    }
  }, [saveDutyResult, bestFtaIndex]);

  // Show popup when no savings are available (after loading completes or when openTrigger changes)
  useEffect(() => {
    if (!isLoading && saveDutyResult) {
      const noSavingsAvailable = ftaOptions.length === 0 || !anyFtaHasSavings;
      if (noSavingsAvailable) {
        setShowNoSavingsPopup(true);
      }
    }
  }, [isLoading, saveDutyResult, ftaOptions.length, anyFtaHasSavings]);

  // Re-show popup when openTrigger changes (user clicks button again)
  useEffect(() => {
    if (openTrigger !== undefined && openTrigger > 0 && !isLoading && saveDutyResult) {
      const noSavingsAvailable = ftaOptions.length === 0 || !anyFtaHasSavings;
      if (noSavingsAvailable) {
        setShowNoSavingsPopup(true);
      }
    }
  }, [openTrigger]);

  // Get the selected FTA (or null if none)
  const selectedFta: SaveDutyFtaOption | null = ftaOptions.length > 0 ? ftaOptions[selectedFtaIndex] : null;

  // Safely extract preferential duties from selected FTA
  // Include the FTA customs duty as a separate item, plus local duties
  const preferentialDuties: DutyItem[] = selectedFta
    ? [
      // Add FTA customs duty as the first item
      {
        duty_name: selectedFta.fta_duty_name || 'customs_duty',
        duty_display_name: selectedFta.fta_duty_display_name || 'Customs Duty',
        duty_short_name: selectedFta.fta_duty_short_name || 'Customs Duty',
        duty_description: selectedFta.fta_duty_description || '',
        display_duty_rate: selectedFta.fta_display_duty_rate || '0',
        calculated_duty_import_country_currency: selectedFta.calculated_duty_import_country_currency || 0,
        calculated_duty_foreign_currency: selectedFta.calculated_duty_foreign_currency || 0,
        tax_type: 'fta',
        priority: '1',
        hsn_uid: '',
        parent_hsn_uid: '',
        display_note: '',
        remarks: null,
        master_notification_number: selectedFta.master_notification_number || '',
        master_serial_number: null,
        master_part: '',
        master_footnote: selectedFta.master_footnote || '',
      } as DutyItem,
      // Add local duties (VAT, excise, etc.)
      ...(selectedFta.local_duties?.duties || []),
      ...(selectedFta.antidumping?.duties || []),
    ]
    : [];
  const preferentialTotalDuty = selectedFta?.total_calculated_duty_import_country_currency ?? 0;
  const preferentialTotalDutyForeign = selectedFta?.total_calculated_duty_foreign_currency ?? 0;

  // Savings for selected FTA (computed from totals to avoid false positives)
  const dutySaving = getComputedSaving(selectedFta);
  const dutySavingForeign = getComputedSavingForeign(selectedFta);
  const hasSavings = dutySaving > 0 && selectedFta !== null;

  // Total Landed Cost
  const standardLandedCost = parseFormattedNumber(shipment_summary?.total_landed_cost_import_country_currency);
  const standardLandedCostForeign = parseFormattedNumber(shipment_summary?.total_landed_cost_foreign_currency);
  const preferentialLandedCost = parseFormattedNumber(
    selectedFta?.shipment_summary?.total_landed_cost_import_country_currency,
  );
  const preferentialLandedCostForeign = parseFormattedNumber(
    selectedFta?.shipment_summary?.total_landed_cost_foreign_currency,
  );

  // FTA Selector component
  const FtaSelector = () => {
    if (ftaOptions.length <= 1) return null;

    // Sort FTAs: savings first, then non-savings
    const sortedFtaIndices = ftaOptions
      .map((fta, index) => ({ fta, index }))
      .sort((a, b) => {
        const aSave = getComputedSaving(a.fta);
        const bSave = getComputedSaving(b.fta);

        const aSaves = aSave > 0;
        const bSaves = bSave > 0;

        if (aSaves && !bSaves) return -1;
        if (!aSaves && bSaves) return 1;

        // Within same category, sort by computed savings amount (higher first)
        return bSave - aSave;
      });

    return (
      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Select FTA:</span>
        </div>
        <Select
          value={String(selectedFtaIndex)}
          onValueChange={(val) => setSelectedFtaIndex(Number(val))}
        >
          <SelectTrigger className="w-[320px] bg-background">
            <SelectValue placeholder="Select an FTA option" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            {sortedFtaIndices.map(({ fta, index }) => {
              const computedSaving = getComputedSaving(fta);
              const computedSavingForeign = getComputedSavingForeign(fta);
              const hasFtaSavings = computedSaving > 0;

              return (
                <SelectItem key={`fta-${index}`} value={String(index)}>
                  <div className="flex items-center gap-2">
                    {hasFtaSavings ? (
                      <CheckCircle className="h-4 w-4 text-savings flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <span className={hasFtaSavings ? 'text-foreground' : 'text-muted-foreground'}>
                      {fta.fta_duty_short_name || fta.fta_duty_name}
                    </span>
                    {hasFtaSavings ? (
                      <span className="text-savings text-xs font-medium">
                        Save {fmtAmt(isDefaultCurrency ? computedSaving : computedSaving)} ({primaryCurrencyCode})
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">No savings</span>
                    )}
                    {index === bestFtaIndex && hasFtaSavings && (
                      <Badge
                        variant="outline"
                        className="ml-1 py-0 px-1.5 text-[10px] bg-savings/10 text-savings border-savings/30"
                      >
                        Best
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {selectedFtaIndex === bestFtaIndex && hasSavings && (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Award className="h-3 w-3 mr-1" />
            Best Saving
          </Badge>
        )}
      </div>
    );
  };

  // Shared content for both inline and fullscreen views
  const AnalysisContent = ({ isExpanded = false }: { isExpanded?: boolean }) => (
    <div className={`${inline ? 'space-y-4' : 'space-y-8'} ${isExpanded ? 'p-2' : ''}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Duty Saving */}
        <Card className={`border-0 shadow-xl rounded-xl overflow-hidden ${hasSavings ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-muted to-muted/80'}`}>
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center ${hasSavings ? 'bg-white/20' : 'bg-muted-foreground/10'}`}>
                <TrendingDown className={`h-5 w-5 ${hasSavings ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <span className={`font-semibold uppercase tracking-wide text-xs md:text-sm ${hasSavings ? 'text-white/90' : 'text-muted-foreground'}`}>Duty Saving</span>
            </div>
            <p className={`text-xl md:text-3xl font-bold tracking-tight ${hasSavings ? 'text-white' : 'text-muted-foreground'}`}>
              {fmtAmt(Math.max(0, dutySaving))} <span className="text-sm md:text-lg font-medium opacity-70">({primaryCurrencyCode})</span>
            </p>
            {!isDefaultCurrency && (
              <p className={`text-xs md:text-sm mt-2 pt-2 border-t ${hasSavings ? 'border-white/20 text-white/80' : 'border-border text-muted-foreground'}`}>
                {fmtAmt(Math.max(0, dutySavingForeign))} ({secondaryCurrencyCode})
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Landed Cost */}
        <Card className="bg-background border-2 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold uppercase tracking-wide text-muted-foreground text-xs md:text-sm">Total Landed Cost</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-foreground tracking-tight">
              {fmtAmt(hasSavings ? preferentialLandedCost : standardLandedCost)} <span className="text-sm md:text-lg font-medium text-muted-foreground">({primaryCurrencyCode})</span>
            </p>
            {!isDefaultCurrency && (
              <p className="text-xs md:text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
                {fmtAmt(hasSavings ? preferentialLandedCostForeign : standardLandedCostForeign)} ({secondaryCurrencyCode})
              </p>
            )}
            {hasSavings && (
              <Badge variant="outline" className="mt-3 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                Preferential rate applied
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Options Found */}
        <Card className="bg-background border-2 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-semibold uppercase tracking-wide text-muted-foreground text-xs md:text-sm">Options Found</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                {isLoading ? '...' : ftaCount}
              </p>
              <span className="text-sm md:text-lg font-medium text-muted-foreground">FTA{ftaCount !== 1 ? 's' : ''}</span>
            </div>
            {ftaCount > 0 && (
              <Badge variant="outline" className="mt-3 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                Preferential tariff available
              </Badge>
            )}
            {ftaCount === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground mt-2">
                No preferential tariffs found
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FTA Selector - shown when multiple FTAs are available */}
      <FtaSelector />

      {/* Side-by-Side Tariff Tables */}
      <div className={`grid grid-cols-1 ${isExpanded ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-6`}>
        {/* Standard Tariff Table - from Calculate Duty API */}
        <TariffTable
          title="Standard Tariff(s)"
          headerColor="primary"
          duties={standardDuties}
          totalDuty={standardTotalDuty}
          totalDutyForeign={standardTotalDutyForeign}
          importCurrencyCode={primaryCurrencyCode}
          importCurrencySymbol={isDefaultCurrency ? currencySymbol : foreignCurrencySymbol}
          foreignCurrencyCode={secondaryCurrencyCode}
          foreignCurrencySymbol={isDefaultCurrency ? foreignCurrencySymbol : currencySymbol}
          showDualCurrency={!isDefaultCurrency}
        />

        {/* Preferential Tariff Table - from SaveDuty API */}
        <TariffTable
          title="Preferential Tariff(s)"
          headerColor="emerald"
          duties={preferentialDuties}
          totalDuty={preferentialTotalDuty}
          totalDutyForeign={preferentialTotalDutyForeign}
          importCurrencyCode={primaryCurrencyCode}
          importCurrencySymbol={isDefaultCurrency ? currencySymbol : foreignCurrencySymbol}
          foreignCurrencyCode={secondaryCurrencyCode}
          foreignCurrencySymbol={isDefaultCurrency ? foreignCurrencySymbol : currencySymbol}
          showDualCurrency={!isDefaultCurrency}
          isLoading={isLoading}
          error={error as Error | null}
          noSavings={!isLoading && !error && preferentialTotalDuty >= standardTotalDuty}
        />
      </div>


      {/* Savings / No-savings Highlight */}
      {!isLoading && selectedFta && (
        hasSavings ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-savings/30 bg-gradient-to-r from-savings/10 to-transparent animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_3] shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-savings/15 flex items-center justify-center animate-bounce">
                      <Sparkles className="h-6 w-6 text-savings" />
                    </div>
                    <div>
                      <p className="font-semibold text-savings">You Could Save with Preferential Tariff!</p>
                      <p className="text-sm text-muted-foreground">
                        Apply for FTA benefits to reduce your import duties
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-savings font-medium">Save ({primaryCurrencyCode})</p>
                    <p className="text-2xl font-bold text-savings">
                      {fmtAmt(dutySaving)}
                    </p>
                    {!isDefaultCurrency && (
                      <p className="text-sm text-savings/80">
                        {fmtAmt(dutySavingForeign)} ({secondaryCurrencyCode})
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="border-2 border-destructive/30 bg-destructive/5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">No saving with selected FTA</p>
                    <p className="text-sm text-muted-foreground">
                      This preferential option results in the same total payable as the standard tariff.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

    </div>
  );

  // Determine if we should hide the analysis (no savings available after loading)
  const noSavingsAvailable = !isLoading && saveDutyResult && (ftaOptions.length === 0 || !anyFtaHasSavings);

  if (inline) {
    return (
      <>
        <AnalysisContent />
        <AlertDialog open={showNoSavingsPopup} onOpenChange={setShowNoSavingsPopup}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <AlertDialogTitle className="text-center text-xl">
                No Duty Saving Options Available
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base">
                {ftaOptions.length === 0
                  ? "There are no preferential tariffs or Free Trade Agreements (FTAs) applicable for this product and trade route."
                  : "The available preferential tariffs do not offer any duty savings compared to the standard tariff rates for this shipment."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction className="min-w-[120px]">
                Understood
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      {!noSavingsAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mt-8 border-t pt-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl calc-serif text-foreground font-bold">DutySaver Pro Analysis</h2>
                <p className="text-base text-muted-foreground">
                  Compare standard vs preferential tariffs and discover savings opportunities
                </p>
                <UpdatedAsOn className="mt-1" />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Expand</span>
            </Button>
          </div>

          <AnalysisContent />
        </motion.div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <DialogTitle className="text-xl calc-serif">DutySaver Pro Analysis</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Compare standard vs preferential tariffs and discover savings opportunities
                  </p>
                </div>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="px-6 py-4">
            <AnalysisContent />
          </div>
        </DialogContent>
      </Dialog>

      {/* No Savings Available Popup */}
      <AlertDialog open={showNoSavingsPopup} onOpenChange={setShowNoSavingsPopup}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              No Duty Saving Options Available
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              {ftaOptions.length === 0 
                ? "There are no preferential tariffs or Free Trade Agreements (FTAs) applicable for this product and trade route."
                : "The available preferential tariffs do not offer any duty savings compared to the standard tariff rates for this shipment."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction className="min-w-[120px]">
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

