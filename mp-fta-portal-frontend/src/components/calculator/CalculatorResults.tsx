import { UpdatedAsOn } from '@/components/portal/UpdatedAsOn';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DutyCalculationResponse, DutyItem, SaveDutyFtaOption, DutyCalculationRequest } from '@/services/intgrowApi';
import { useCountries } from '@/hooks/useCountries';
import { useSaveDuty } from '@/hooks/useSaveDuty';
import { cleanApiText } from '@/lib/utils';
import {
  ArrowRight,
  Sparkles,
  Ship,
  Plane,
  Truck,
  CheckCircle2,
  Package,
  Receipt,
  Banknote,
  Info,
  FileText,
  ChevronDown,
  ChevronUp,
  Globe,
  Building2,
  Landmark,
  Scale,
  ListChecks,
  MapPin,
  Hash,
  Repeat,
  Printer,
  Download,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  ScrollText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DutySaverComparison } from './DutySaverComparison';
import { ExportPolicyInfo } from './ExportPolicyInfo';
import { isIndiaExport } from '@/hooks/useExportPolicy';
import { ImportPolicyInfo } from './ImportPolicyInfo';
import { isIndiaImport } from '@/hooks/useImportPolicy';

interface CalculatorResultsProps {
  result: DutyCalculationResponse;
  calculationRequest?: DutyCalculationRequest;
  selectedCurrencyCode?: string;
}

const transportIcons: Record<string, typeof Ship> = {
  sea: Ship,
  air: Plane,
  road: Truck,
};

function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", INR: "₹", CNY: "¥", JPY: "¥",
    AED: "د.إ", CAD: "C$", AUD: "A$", SGD: "S$",
  };
  return symbols[code] || code;
}

function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

function fmtAmt(value: number): string {
  if (value === 0) return '0';
  if (Number.isInteger(value)) return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DutyTableRow({
  duty,
  currencyCode,
  currencySymbol,
  foreignCurrencyCode,
  foreignCurrencySymbol,
  isAntiDumping = false,
}: {
  duty: DutyItem;
  currencyCode: string;
  currencySymbol: string;
  foreignCurrencyCode: string;
  foreignCurrencySymbol: string;
  isAntiDumping?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const importAmount = duty.calculated_duty_import_country_currency ?? 0;
  const foreignAmount = duty.calculated_duty_foreign_currency ?? 0;
  const isDefaultCurrency = foreignCurrencyCode === currencyCode;
  // Primary = selected currency, Secondary = the other
  // API: _import_country_currency = selected currency value, _foreign_currency = native currency value
  const primaryAmount = isDefaultCurrency ? importAmount : importAmount;
  const primaryCode = isDefaultCurrency ? currencyCode : foreignCurrencyCode;
  const secondaryAmount = isDefaultCurrency ? foreignAmount : foreignAmount;
  const secondaryCode = isDefaultCurrency ? foreignCurrencyCode : currencyCode;
  const hasAmount = primaryAmount > 0;
  const dutyLabel = cleanApiText(duty.duty_display_name || duty.duty_short_name || duty.display_note || duty.duty_name || '');
  const specialBadgeLabel = cleanApiText(duty.display_note || duty.duty_short_name || duty.duty_display_name || '');
  const rateRaw = duty.local_display_rate || duty.display_duty_rate;
  const rate = typeof rateRaw === 'number' ? `${rateRaw}%` : String(rateRaw || '0');

  return (
    <>
      <TableRow
        className={`cursor-pointer hover:bg-muted/30 transition-colors ${isAntiDumping ? 'bg-destructive/5' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="font-medium py-4">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm md:text-base ${isAntiDumping ? 'text-destructive' : 'text-foreground'}`}>
              {dutyLabel}
            </span>
            {isAntiDumping && specialBadgeLabel && (
              <Badge variant="destructive" className="text-[10px] md:text-xs py-0.5 px-2 whitespace-nowrap">
                {specialBadgeLabel}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-center py-4">
          <span className="text-sm md:text-base font-bold">{rate}</span>
        </TableCell>
        <TableCell className="text-right font-semibold py-4">
          <div className={`text-sm md:text-base font-bold ${hasAmount ? 'text-primary' : 'text-muted-foreground'}`}>
            {fmtAmt(primaryAmount)} <span className="font-medium text-muted-foreground text-xs md:text-sm">({primaryCode})</span>
          </div>
          {!isDefaultCurrency && (
            <div className="text-muted-foreground font-medium text-xs md:text-sm">
              {fmtAmt(secondaryAmount)} ({secondaryCode})
            </div>
          )}
        </TableCell>
        <TableCell className="w-10 py-4">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
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
                <div className="p-4 bg-muted/20 border-t space-y-2 text-xs md:text-sm text-muted-foreground">
                  <p>{duty.duty_description}</p>
                  {duty.master_notification_number && (
                    <div className="flex items-start gap-2 pt-2">
                      <FileText className="lucide lucide-file-text mt-0.5 flex-shrink-0 h-4 w-4" />
                      <span className="font-semibold text-xs md:text-sm">{duty.master_notification_number}</span>
                    </div>
                  )}
                  {duty.master_footnote && (
                    <p className="italic opacity-75 pt-1 text-xs md:text-sm">{duty.master_footnote}</p>
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

export function CalculatorResults({ result, calculationRequest, selectedCurrencyCode }: CalculatorResultsProps) {
  const { duty_calculations, shipment_summary } = result;
  const [isDutySaverActive, setIsDutySaverActive] = useState(false);
  const { data: saveDutyResult, isLoading: saveDutyLoading, error: saveDutyError } = useSaveDuty(calculationRequest || null, isDutySaverActive);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { data: countries } = useCountries();
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [comparisonOpenTrigger, setComparisonOpenTrigger] = useState(0);

  const importCurrencyCode =
    countries?.find((c) => c.name === shipment_summary.import_country)?.currency || 'INR';
  // Use the passed currency code; fall back to import currency if not provided or same
  const foreignCurrencyCode = selectedCurrencyCode || importCurrencyCode;
  const currencySymbol = getCurrencySymbol(importCurrencyCode);
  const foreignCurrencySymbol = getCurrencySymbol(foreignCurrencyCode);

  // Determine if user selected the importing country's default currency
  const isDefaultCurrency = foreignCurrencyCode === importCurrencyCode;

  const cifValue = parseFormattedNumber(shipment_summary.cif_value_import_country_currency);
  const cifValueForeign = parseFormattedNumber(shipment_summary.cif_value_foreign_currency);
  const totalDuty = duty_calculations.total_calculated_duty_import_country_currency;
  const totalDutyForeign = duty_calculations.total_calculated_duty_foreign_currency;
  const totalLandedCost = parseFormattedNumber(shipment_summary.total_landed_cost_import_country_currency);
  const totalLandedCostForeign = parseFormattedNumber(shipment_summary.total_landed_cost_foreign_currency);
  const fxRate = Number(shipment_summary.selected_currency_rate);

  const specialDutyRegex = /anti\s*-?dump/i;
  const isSpecialDuty = (d: DutyItem) =>
    specialDutyRegex.test(d.duty_name || '') ||
    specialDutyRegex.test(d.duty_display_name || '') ||
    specialDutyRegex.test(d.duty_short_name || '') ||
    specialDutyRegex.test(d.display_note || '');

  const allDuties = [...duty_calculations.local_duties.duties, ...duty_calculations.antidumping.duties];
  const activeDuties = allDuties.filter((d) => d.calculated_duty_import_country_currency > 0);
  const transportMode = shipment_summary.mode_of_transport.toLowerCase();
  const TransportIcon = transportIcons[transportMode] || Ship;
  const hasAntiDumping = duty_calculations.antidumping.count > 0;
  const totalDutyCount = duty_calculations.local_duties.count + duty_calculations.antidumping.count;

  // Duty Impact calculation
  const productValue = cifValue || 1;
  const dutyPercent = Math.min((totalDuty / productValue) * 100, 100);
  const impactColor = dutyPercent <= 10 ? 'text-green-500' : dutyPercent <= 25 ? 'text-amber-500' : 'text-destructive';
  const impactLabel = dutyPercent <= 10 ? 'Low Impact' : dutyPercent <= 25 ? 'Moderate' : 'High Impact';

  // Best FTA preferential data for real-time updates
  const bestFta = saveDutyResult?.fta?.reduce((best: SaveDutyFtaOption | null, fta: SaveDutyFtaOption) => {
    const saving = Math.max(0, totalDuty - (fta.total_calculated_duty_import_country_currency ?? 0));
    const bestSaving = best ? Math.max(0, totalDuty - (best.total_calculated_duty_import_country_currency ?? 0)) : 0;
    return saving > bestSaving ? fta : best;
  }, null as SaveDutyFtaOption | null) || null;

  const prefTotalDuty = bestFta?.total_calculated_duty_import_country_currency ?? 0;
  const prefTotalDutyForeign = bestFta?.total_calculated_duty_foreign_currency ?? 0;
  const dutySaving = Math.max(0, totalDuty - prefTotalDuty);
  const dutySavingForeign = Math.max(0, totalDutyForeign - prefTotalDutyForeign);
  const hasFtaSavings = bestFta !== null && dutySaving > 0;

  const prefLandedCostStr = bestFta?.shipment_summary?.total_landed_cost_import_country_currency;
  const prefLandedCost = prefLandedCostStr ? parseFormattedNumber(prefLandedCostStr) : totalLandedCost;
  const prefLandedCostForeignStr = bestFta?.shipment_summary?.total_landed_cost_foreign_currency;
  const prefLandedCostForeign = prefLandedCostForeignStr ? parseFormattedNumber(prefLandedCostForeignStr) : totalLandedCostForeign;

  const activeLandedCost = isDutySaverActive && hasFtaSavings ? prefLandedCost : totalLandedCost;
  const activeLandedCostForeign = isDutySaverActive && hasFtaSavings ? prefLandedCostForeign : totalLandedCostForeign;
  const activeTotalDuty = isDutySaverActive && hasFtaSavings ? prefTotalDuty : totalDuty;
  const activeTotalDutyForeign = isDutySaverActive && hasFtaSavings ? prefTotalDutyForeign : totalDutyForeign;

  // Primary = user's selected currency, Secondary = the other
  // API: _import_country_currency = selected currency, _foreign_currency = native/importing currency
  const primaryLandedCost = isDefaultCurrency ? activeLandedCost : activeLandedCost;
  const secondaryLandedCost = isDefaultCurrency ? activeLandedCostForeign : activeLandedCostForeign;
  const primaryTotalDuty = isDefaultCurrency ? activeTotalDuty : activeTotalDuty;
  const secondaryTotalDuty = isDefaultCurrency ? activeTotalDutyForeign : activeTotalDutyForeign;
  const primaryDutySaving = isDefaultCurrency ? dutySaving : dutySaving;
  const secondaryDutySaving = isDefaultCurrency ? dutySavingForeign : dutySavingForeign;
  const primaryCurrencyCode = isDefaultCurrency ? importCurrencyCode : foreignCurrencyCode;
  const secondaryCurrencyCode = isDefaultCurrency ? foreignCurrencyCode : importCurrencyCode;

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = 25;

      const checkPageBreak = (requiredSpace: number) => {
        if (y + requiredSpace > pageHeight - 20) {
          doc.addPage();
          y = 25;
          return true;
        }
        return false;
      };

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Import Duty Calculation', margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

      // Route info
      y += 12;
      doc.setTextColor(0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Shipment Details', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      const details = [
        ['Route:', `${shipment_summary.export_country} → ${shipment_summary.import_country}`],
        ['HS Code:', shipment_summary.import_hsn],
        ['Incoterm:', shipment_summary.inco_term],
        ['Transport:', transportMode.charAt(0).toUpperCase() + transportMode.slice(1)],
        ['Currency:', importCurrencyCode !== foreignCurrencyCode ? `${importCurrencyCode} / ${foreignCurrencyCode}` : importCurrencyCode],
      ];

      details.forEach(([label, value]) => {
        doc.setTextColor(100);
        doc.text(label, margin, y);
        doc.setTextColor(0);
        doc.text(value, margin + 35, y);
        y += 6;
      });

      // Duty Breakdown Table
      y += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Standard Tariff Breakdown', margin, y);
      y += 8;

      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text('Duty Type', margin + 2, y);
      doc.text('Rate', margin + 90, y);
      doc.text('Amount', pageWidth - margin - 2, y, { align: 'right' });
      y += 8;
      doc.setTextColor(0);

      const allDutiesForPDF = [...duty_calculations.local_duties.duties, ...duty_calculations.antidumping.duties];

      allDutiesForPDF.forEach((duty) => {
        checkPageBreak(12);
        const name = String(duty.duty_display_name || duty.duty_short_name || duty.display_note || duty.duty_name || 'Duty');
        const rateRaw = duty.display_duty_rate;
        const rate = typeof rateRaw === 'number' ? `${rateRaw}%` : String(rateRaw || '0%');
        const amt = Number(duty.calculated_duty_import_country_currency ?? 0);
        const maxNameLen = 50;
        const displayName = name.length > maxNameLen ? name.slice(0, maxNameLen) + '...' : name;

        doc.setFontSize(9);
        doc.text(displayName, margin + 2, y);
        doc.text(rate, margin + 90, y);
        doc.text(`${currencySymbol}${fmtAmt(amt)}`, pageWidth - margin - 2, y, { align: 'right' });
        y += 2;
        doc.setDrawColor(230);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      });

      // Total row
      y += 4;
      doc.setFillColor(255, 237, 213);
      doc.rect(margin, y - 4, pageWidth - margin * 2, 10, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Duties (Standard)', margin + 2, y + 2);
      doc.text(`${currencySymbol}${fmtAmt(totalDuty)}`, pageWidth - margin - 2, y + 2, { align: 'right' });

      // Landed Cost
      y += 18;
      doc.setFillColor(14, 116, 144);
      doc.rect(margin, y - 6, pageWidth - margin * 2, 14, 'F');
      doc.setTextColor(255);
      doc.setFontSize(10);
      doc.text('Total Landed Cost', margin + 4, y);
      doc.setFontSize(14);
      doc.text(`${currencySymbol}${fmtAmt(totalLandedCost)}`, pageWidth - margin - 4, y, { align: 'right' });

      if (foreignCurrencyCode !== importCurrencyCode) {
        y += 16;
        doc.setTextColor(100);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Foreign currency: ${foreignCurrencySymbol}${fmtAmt(totalDutyForeign)} duties • ${foreignCurrencySymbol}${fmtAmt(totalLandedCostForeign)} landed cost`,
          margin, y
        );
      }

      // DutySaver Pro Analysis Section
      if (saveDutyResult && saveDutyResult.fta && saveDutyResult.fta.length > 0) {
        const getBestFta = (): SaveDutyFtaOption | null => {
          let best: SaveDutyFtaOption | null = null;
          let maxSaving = 0;
          for (const fta of saveDutyResult.fta) {
            const prefTotal = fta.total_calculated_duty_import_country_currency ?? 0;
            const saving = Math.max(0, totalDuty - prefTotal);
            if (saving > maxSaving) { maxSaving = saving; best = fta; }
          }
          return best;
        };
        const bestFta = getBestFta();

        doc.addPage();
        y = 25;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('DutySaver Pro Analysis', margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`${saveDutyResult.total_fta_count || saveDutyResult.fta.length} FTA option(s) analyzed`, margin, y);

        y += 14;
        const cardWidth = (pageWidth - margin * 2 - 10) / 2;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, cardWidth, 24, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text('Standard Tariff Total', margin + 4, y + 8);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(`${currencySymbol}${fmtAmt(totalDuty)}`, margin + 4, y + 18);

        if (bestFta) {
          const prefTotal = bestFta.total_calculated_duty_import_country_currency ?? 0;
          const saving = Math.max(0, totalDuty - prefTotal);
          const hasSaving = saving > 0;
          doc.setFillColor(hasSaving ? 236 : 254, hasSaving ? 253 : 242, hasSaving ? 245 : 242);
          doc.roundedRect(margin + cardWidth + 10, y, cardWidth, 24, 2, 2, 'F');
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text('Best Preferential Total', margin + cardWidth + 14, y + 8);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(hasSaving ? 22 : 220, hasSaving ? 163 : 38, hasSaving ? 74 : 38);
          doc.text(`${currencySymbol}${fmtAmt(prefTotal)}`, margin + cardWidth + 14, y + 18);
        }
        y += 32;

        if (bestFta) {
          const prefTotal = bestFta.total_calculated_duty_import_country_currency ?? 0;
          const saving = Math.max(0, totalDuty - prefTotal);
          const hasSaving = saving > 0;
          if (hasSaving) {
            doc.setFillColor(220, 252, 231);
            doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 2, 2, 'F');
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(22, 163, 74);
            doc.text('Potential Savings with Preferential Tariff', margin + 4, y + 8);
            doc.setFontSize(14);
            doc.text(`${currencySymbol}${fmtAmt(saving)}`, pageWidth - margin - 4, y + 11, { align: 'right' });
            y += 26;
          } else {
            doc.setFillColor(254, 242, 242);
            doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38);
            doc.text('No savings available with preferential tariffs', margin + 4, y + 9);
            y += 22;
          }
        }

        checkPageBreak(40);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('Available FTA Options', margin, y);
        y += 8;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.text('FTA Name', margin + 2, y);
        doc.text('Total Duty', margin + 90, y);
        doc.text('Saving', pageWidth - margin - 2, y, { align: 'right' });
        y += 8;

        const sortedFtas = [...saveDutyResult.fta].sort((a, b) => {
          const aSaving = Math.max(0, totalDuty - (a.total_calculated_duty_import_country_currency ?? 0));
          const bSaving = Math.max(0, totalDuty - (b.total_calculated_duty_import_country_currency ?? 0));
          return bSaving - aSaving;
        });

        sortedFtas.forEach((fta) => {
          checkPageBreak(12);
          const name = cleanApiText(fta.fta_duty_short_name || fta.fta_duty_name || 'FTA');
          const prefTotal = fta.total_calculated_duty_import_country_currency ?? 0;
          const saving = Math.max(0, totalDuty - prefTotal);
          const hasSaving = saving > 0;
          const maxNameLen = 45;
          const displayName = name.length > maxNameLen ? name.slice(0, maxNameLen) + '...' : name;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0);
          doc.text(displayName, margin + 2, y);
          doc.text(`${currencySymbol}${fmtAmt(prefTotal)}`, margin + 90, y);
          if (hasSaving) {
            doc.setTextColor(22, 163, 74);
            doc.text(`-${currencySymbol}${fmtAmt(saving)}`, pageWidth - margin - 2, y, { align: 'right' });
          } else {
            doc.setTextColor(150);
            doc.text('No saving', pageWidth - margin - 2, y, { align: 'right' });
          }
          y += 2;
          doc.setDrawColor(230);
          doc.line(margin, y, pageWidth - margin, y);
          y += 6;
        });

        if (bestFta) {
          const prefTotal = bestFta.total_calculated_duty_import_country_currency ?? 0;
          const saving = Math.max(0, totalDuty - prefTotal);
          if (saving > 0) {
            checkPageBreak(50);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0);
            doc.text('Best Option: Preferential Tariff Breakdown', margin, y);
            y += 8;
            doc.setFillColor(220, 252, 231);
            doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
            doc.setFontSize(9);
            doc.setTextColor(80);
            doc.text('Duty Type', margin + 2, y);
            doc.text('Rate', margin + 90, y);
            doc.text('Amount', pageWidth - margin - 2, y, { align: 'right' });
            y += 8;

            const ftaRate = parseFloat(bestFta.fta_display_duty_rate) || 0;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0);
            doc.text(cleanApiText(bestFta.fta_duty_short_name || 'Customs Duty (FTA)'), margin + 2, y);
            doc.text(`${ftaRate}%`, margin + 90, y);
            doc.text(`${currencySymbol}${fmtAmt(bestFta.calculated_duty_import_country_currency ?? 0)}`, pageWidth - margin - 2, y, { align: 'right' });
            y += 2;
            doc.setDrawColor(230);
            doc.line(margin, y, pageWidth - margin, y);
            y += 6;

            const prefDuties = [...(bestFta.local_duties?.duties || []), ...(bestFta.antidumping?.duties || [])];
            prefDuties.forEach((duty) => {
              checkPageBreak(12);
              const dName = cleanApiText(duty.duty_display_name || duty.duty_short_name || duty.duty_name || 'Duty');
              const rateRaw = duty.display_duty_rate;
              const rate = typeof rateRaw === 'number' ? `${rateRaw}%` : String(rateRaw || '0%');
              const amt = duty.calculated_duty_import_country_currency ?? 0;
              const maxNameLen = 45;
              const displayName = dName.length > maxNameLen ? dName.slice(0, maxNameLen) + '...' : dName;
              doc.setFontSize(9);
              doc.text(displayName, margin + 2, y);
              doc.text(rate, margin + 90, y);
              doc.text(`${currencySymbol}${fmtAmt(amt)}`, pageWidth - margin - 2, y, { align: 'right' });
              y += 2;
              doc.setDrawColor(230);
              doc.line(margin, y, pageWidth - margin, y);
              y += 6;
            });

            y += 4;
            doc.setFillColor(220, 252, 231);
            doc.rect(margin, y - 4, pageWidth - margin * 2, 10, 'F');
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(22, 163, 74);
            doc.text('Total Duties (Preferential)', margin + 2, y + 2);
            doc.text(`${currencySymbol}${fmtAmt(prefTotal)}`, pageWidth - margin - 2, y + 2, { align: 'right' });
          }
        }
      }

      const filename = `duty-calculation-${shipment_summary.import_hsn}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportPolicyHsCode = calculationRequest?.hscode || shipment_summary?.import_hsn;
  const showExportPolicy = !!(isIndiaExport(calculationRequest?.exp, calculationRequest?.org) && exportPolicyHsCode);
  const showImportPolicy = !!(calculationRequest?.imp && isIndiaImport(calculationRequest.imp) && exportPolicyHsCode);


  return (
    <div ref={resultsRef} className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 print:animate-none">
      <div className="flex justify-end"><UpdatedAsOn /></div>

      {/* ═══════════════════════════════════════════════════════════
          COMPACT SUMMARY STRIPE — Key metrics at a glance
         ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="rounded-xl bg-gradient-to-r from-card via-muted to-muted border border-border px-3 py-3 md:px-4">
          <div className="flex items-center gap-3 md:gap-5 flex-wrap">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="rounded-full bg-primary/15 flex items-center justify-center h-9 w-9 md:h-10 md:w-10">
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <Badge variant="outline" className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono border-border text-muted-foreground text-xs md:text-sm">
                {shipment_summary.import_hsn}
              </Badge>
            </div>

            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0 flex-wrap">
              <div className="flex-shrink-0">
                <p className="uppercase tracking-wider text-muted-foreground text-[10px] md:text-xs">Landed Cost</p>
                <motion.p key={`lc-${primaryLandedCost}`} initial={{ scale: 0.95, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="font-bold text-foreground leading-tight text-base md:text-lg">
                  {fmtAmt(primaryLandedCost)} <span className="font-normal text-muted-foreground text-[10px] md:text-xs">{primaryCurrencyCode}</span>
                </motion.p>
                {!isDefaultCurrency && (
                  <p className="text-muted-foreground leading-tight text-[10px] md:text-xs">{fmtAmt(secondaryLandedCost)} {secondaryCurrencyCode}</p>
                )}
              </div>
              <div className="hidden md:block h-6 w-px bg-border" />
              <div className="flex-shrink-0">
                <p className="uppercase tracking-wider text-muted-foreground text-[10px] md:text-xs">Total Duty</p>
                <motion.p key={`td-${primaryTotalDuty}`} initial={{ scale: 0.95, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="font-bold text-primary leading-tight text-base md:text-lg">
                  {fmtAmt(primaryTotalDuty)} <span className="font-normal text-muted-foreground text-[10px] md:text-xs">{primaryCurrencyCode}</span>
                </motion.p>
                {!isDefaultCurrency && (
                  <p className="text-muted-foreground leading-tight text-[10px] md:text-xs">
                    {fmtAmt(secondaryTotalDuty)} {secondaryCurrencyCode}
                  </p>
                )}
              </div>
              <div className="hidden md:block h-6 w-px bg-border" />
              <div className="flex-shrink-0">
                <p className="uppercase tracking-wider text-muted-foreground text-[10px] md:text-xs">Impact</p>
                <p className={`font-bold leading-tight text-base md:text-lg ${impactColor}`}>
                  {dutyPercent < 0.01 ? '0' : dutyPercent.toFixed(1)}%
                </p>
              </div>
              <AnimatePresence>
                {isDutySaverActive && hasFtaSavings && (
                  <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-3 overflow-hidden">
                    <div className="hidden md:block h-6 w-px bg-emerald-500/30" />
                    <div className="flex-shrink-0">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-500">Saving</p>
                      <p className="text-sm md:text-base font-bold text-emerald-500 leading-tight">{fmtAmt(primaryDutySaving)} <span className="text-[10px] font-normal text-emerald-500/70">{primaryCurrencyCode}</span></p>
                      {!isDefaultCurrency && (
                        <p className="text-[10px] text-emerald-500/50 leading-tight">{fmtAmt(secondaryDutySaving)} {secondaryCurrencyCode}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {activeDuties.length > 0 && (
                <div className="flex items-center bg-muted rounded-lg p-0.5 border border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDutySaverActive(false)}
                    className={`relative gap-1.5 text-xs h-8 px-3 rounded-md transition-all duration-300 ${
                      !isDutySaverActive
                        ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    Standard Tariff
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsDutySaverActive(true);
                      setComparisonOpenTrigger(prev => prev + 1);
                    }}
                    className={`relative gap-1.5 text-xs h-8 px-3 rounded-md transition-all duration-300 group ${
                      isDutySaverActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-700'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Sparkles className={`h-3.5 w-3.5 transition-transform duration-300 ${isDutySaverActive ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    DutySaver Pro
                    {hasFtaSavings && !isDutySaverActive && (
                      <motion.span
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-0.5 text-[9px] font-bold text-emerald-500"
                      >
                        ↑ Save
                      </motion.span>
                    )}
                    {isDutySaverActive && hasFtaSavings && (
                      <motion.span
                        key="saving-badge"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="ml-0.5 text-emerald-200 font-bold text-base"
                      >
                        −{fmtAmt(primaryDutySaving)}
                      </motion.span>
                    )}
                  </Button>
                </div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handlePrint}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" size="sm" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground relative gap-1.5 h-8 px-3 rounded-md transition-all duration-300 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 text-xs md:text-sm border-border" onClick={handleExportPDF} disabled={isExporting}>
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setHeroExpanded(!heroExpanded)}>
                {heroExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          EXPANDABLE FULL HERO — Detailed view with all metrics
         ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {heroExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-muted to-muted border border-border p-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
              <div className="relative text-center mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">Total Landed Cost</p>
                <motion.h2 key={`hero-lc-${primaryLandedCost}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-3xl md:text-4xl font-bold tracking-tight calc-serif text-foreground mb-1">
                  {fmtAmt(primaryLandedCost)}
                  <span className="text-lg font-normal text-muted-foreground ml-2">{primaryCurrencyCode}</span>
                </motion.h2>
                {!isDefaultCurrency && (
                  <p className="text-sm text-muted-foreground">{fmtAmt(secondaryLandedCost)} {secondaryCurrencyCode}</p>
                )}
              </div>
              <div className="relative grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-muted border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{shipment_summary.inco_term} Value</p>
                  <p className="text-lg font-bold text-foreground">{fmtAmt(isDefaultCurrency ? cifValue : cifValue)}</p>
                  <p className="text-xs text-muted-foreground">{primaryCurrencyCode}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted border border-primary/20">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total Duty</p>
                  <motion.p key={`hero-td-${primaryTotalDuty}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-lg font-bold text-primary">
                    {fmtAmt(primaryTotalDuty)}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">{primaryCurrencyCode}</p>
                </div>
                <div className={`text-center p-3 rounded-xl bg-muted border ${isDutySaverActive && hasFtaSavings ? 'border-emerald-500/30' : 'border-border'}`}>
                  {isDutySaverActive && hasFtaSavings ? (
                    <>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-500 mb-1">Duty Saving</p>
                      <p className="text-lg font-bold text-emerald-500">{fmtAmt(primaryDutySaving)}</p>
                      <p className="text-xs text-emerald-500/70">{primaryCurrencyCode}</p>
                      {!isDefaultCurrency && (
                        <p className="text-[9px] text-emerald-500/50">{fmtAmt(secondaryDutySaving)} {secondaryCurrencyCode}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Duty Impact</p>
                      <p className={`text-lg font-bold ${impactColor}`}>{dutyPercent < 0.01 ? '0' : dutyPercent.toFixed(1)}%</p>
                      <p className={`text-xs ${impactColor}`}>{impactLabel}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          TABBED DETAIL SECTIONS — Clean, organized, not cluttered
         ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="w-full justify-start bg-muted border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="breakdown" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 data-[state=active]:bg-secondary rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm">
              <Receipt className="h-4 w-4" />
              Duty Breakdown
            </TabsTrigger>
            <TabsTrigger value="details" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 data-[state=active]:bg-secondary rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm">
              <FileText className="h-4 w-4" />
              Shipment Details
            </TabsTrigger>
            {showExportPolicy && (
              <TabsTrigger value="export-policy" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 data-[state=active]:bg-secondary rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm">
                <ScrollText className="h-4 w-4" />
                Export Policy
              </TabsTrigger>
            )}
            {showImportPolicy && (
              <TabsTrigger value="import-policy" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 data-[state=active]:bg-secondary rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm">
                <ScrollText className="h-4 w-4" />
                Import Policy
              </TabsTrigger>
            )}
          </TabsList>

          {/* ── Duty Breakdown Tab ── */}
          <TabsContent value="breakdown" className="mt-4">
            <AnimatePresence mode="wait">
              {!isDutySaverActive ? (
                <motion.div key="standard-view" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
            <Card className="overflow-hidden border border-border bg-card rounded-xl">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl md:text-2xl calc-serif text-foreground">Standard Tariff</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalDutyCount} components
                    {hasAntiDumping && ` · ${duty_calculations.antidumping.count} special`}
                    {!isDefaultCurrency && Number.isFinite(fxRate) && fxRate > 0 && (
                      <span> · FX: 1 {importCurrencyCode} = {fxRate.toFixed(4)} {foreignCurrencyCode}</span>
                    )}
                  </p>
                </div>
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border">
                      <TableHead className="h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] md:text-xs">Duty Type</TableHead>
                      <TableHead className="h-12 px-4 text-center align-middle [&:has([role=checkbox])]:pr-0 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] md:text-xs">Rate</TableHead>
                      <TableHead className="h-12 px-4 text-right align-middle [&:has([role=checkbox])]:pr-0 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] md:text-xs">Amount</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duty_calculations.local_duties.duties.map((duty, index) => (
                      <DutyTableRow
                        key={`local-${duty.duty_name}-${index}`}
                        duty={duty}
                        currencyCode={importCurrencyCode}
                        currencySymbol={currencySymbol}
                        foreignCurrencyCode={foreignCurrencyCode}
                        foreignCurrencySymbol={foreignCurrencySymbol}
                        isAntiDumping={isSpecialDuty(duty)}
                      />
                    ))}
                    {duty_calculations.antidumping.duties.map((duty, index) => (
                      <DutyTableRow
                        key={`antidumping-${duty.duty_name}-${index}`}
                        duty={duty}
                        currencyCode={importCurrencyCode}
                        currencySymbol={currencySymbol}
                        foreignCurrencyCode={foreignCurrencyCode}
                        foreignCurrencySymbol={foreignCurrencySymbol}
                        isAntiDumping
                      />
                    ))}
                    {/* Total Row */}
                    <TableRow className="bg-gradient-to-r from-accent/15 via-accent/10 to-accent/5 border-t-2 border-accent/30">
                      <TableCell className="font-bold text-sm md:text-base py-5">
                        <span className="text-foreground">Total Duties</span>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right py-5">
                        <div className="text-xl md:text-2xl font-bold text-accent">
                          {fmtAmt(isDefaultCurrency ? totalDuty : totalDuty)}
                          <span className="text-xs md:text-sm font-medium text-muted-foreground ml-1">({primaryCurrencyCode})</span>
                        </div>
                        {!isDefaultCurrency && (
                          <div className="text-xs md:text-sm text-muted-foreground font-medium">
                            {fmtAmt(totalDutyForeign)} ({secondaryCurrencyCode})
                          </div>
                        )}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Duty Impact Visual */}
            {(() => {
              // Preferential impact calculation
              const bestFta = saveDutyResult?.fta?.reduce((best: SaveDutyFtaOption | null, fta: SaveDutyFtaOption) => {
                const saving = Math.max(0, totalDuty - (fta.total_calculated_duty_import_country_currency ?? 0));
                const bestSaving = best ? Math.max(0, totalDuty - (best.total_calculated_duty_import_country_currency ?? 0)) : 0;
                return saving > bestSaving ? fta : best;
              }, null as SaveDutyFtaOption | null) || null;
              const prefTotalDuty = bestFta?.total_calculated_duty_import_country_currency ?? 0;
              const prefTotalDutyLocal = bestFta?.total_calculated_duty_foreign_currency ?? 0;
              const prefDutyPercent = Math.min((prefTotalDuty / productValue) * 100, 100);
              const prefImpactColor = prefDutyPercent <= 10 ? 'text-green-500' : prefDutyPercent <= 25 ? 'text-amber-500' : 'text-destructive';
              const prefImpactLabel = prefDutyPercent <= 10 ? 'Low Impact' : prefDutyPercent <= 25 ? 'Moderate' : 'High Impact';
              const prefBarColor = prefDutyPercent <= 10 ? 'bg-green-500' : prefDutyPercent <= 25 ? 'bg-amber-500' : 'bg-destructive';
              const hasPrefSaving = bestFta !== null && Math.max(0, totalDuty - prefTotalDuty) > 0;
              const showComparison = hasPrefSaving;

              return (
                <Card className="overflow-hidden border border-border bg-card rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Duty Impact Analysis</span>
                      {showComparison && (
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 ml-auto">
                          FTA Comparison
                        </Badge>
                      )}
                    </div>

                    <div className={`grid ${showComparison ? 'grid-cols-2 gap-6' : 'grid-cols-1'}`}>
                      {/* Standard Impact */}
                      <div className={`flex flex-col items-center gap-4 ${showComparison ? 'border-r border-border pr-6' : ''}`}>
                        {showComparison && (
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Standard Tariff</p>
                        )}
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                            <circle
                              cx="60" cy="60" r="54"
                              fill="none"
                              className={impactColor}
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 54}
                              strokeDashoffset={(2 * Math.PI * 54) - (dutyPercent / 100) * (2 * Math.PI * 54)}
                              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-lg font-bold ${impactColor}`}>
                              {dutyPercent < 0.01 ? '0' : dutyPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full space-y-2">
                          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                dutyPercent <= 10 ? 'bg-green-500' : dutyPercent <= 25 ? 'bg-amber-500' : 'bg-destructive'
                              }`}
                              style={{ width: `${Math.max(dutyPercent, 1)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Duty</span>
                            <span className="font-semibold">{fmtAmt(totalDuty)} {primaryCurrencyCode}</span>
                          </div>
                          <p className={`text-xs text-center font-medium ${impactColor}`}>{impactLabel}</p>
                        </div>
                      </div>

                      {/* Preferential Impact (only when savings exist) */}
                      {showComparison && (
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-medium">Preferential Tariff</p>
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                              <circle
                                cx="60" cy="60" r="54"
                                fill="none"
                                className={prefImpactColor}
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 54}
                                strokeDashoffset={(2 * Math.PI * 54) - (prefDutyPercent / 100) * (2 * Math.PI * 54)}
                                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-lg font-bold ${prefImpactColor}`}>
                                {prefDutyPercent < 0.01 ? '0' : prefDutyPercent.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full space-y-2">
                            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${prefBarColor}`}
                                style={{ width: `${Math.max(prefDutyPercent, 1)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Duty</span>
                              <span className="font-semibold text-emerald-500">{fmtAmt(prefTotalDuty)} {primaryCurrencyCode}</span>
                            </div>
                            <p className={`text-xs text-center font-medium ${prefImpactColor}`}>{prefImpactLabel}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Savings summary bar */}
                    {showComparison && (
                      <div className="mt-5 pt-4 border-t border-border">
                        <div className="flex items-center justify-between bg-emerald-500/10 rounded-lg px-4 py-2.5">
                          <span className="text-xs text-muted-foreground font-medium">Impact Reduction</span>
                          <span className="text-sm font-bold text-emerald-500">
                            {(dutyPercent - prefDutyPercent).toFixed(1)}% lower with FTA
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
                </motion.div>
              ) : (
                <motion.div key="dutysaver-view" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.25 }}>
                  <DutySaverComparison
                    result={result}
                    calculationRequest={calculationRequest}
                    openTrigger={comparisonOpenTrigger}
                    selectedCurrencyCode={selectedCurrencyCode}
                    inline
                    saveDutyData={saveDutyResult}
                    saveDutyLoading={saveDutyLoading}
                    saveDutyError={saveDutyError as Error | null}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── Shipment Details Tab ── */}
          <TabsContent value="details" className="mt-6">
            <Card className="overflow-hidden border border-border bg-card rounded-xl">
              <CardContent className="p-0">
                {/* Key route info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-secondary">
                  {[
                    { icon: <Globe className="h-4 w-4 text-blue-400" />, label: 'Export', value: shipment_summary.export_country },
                    { icon: <Landmark className="h-4 w-4 text-green-400" />, label: 'Import', value: shipment_summary.import_country },
                    { icon: <TransportIcon className="h-4 w-4 text-purple-400" />, label: 'Transport', value: transportMode.charAt(0).toUpperCase() + transportMode.slice(1) },
                    { icon: <Scale className="h-4 w-4 text-amber-400" />, label: 'Incoterm', value: shipment_summary.inco_term },
                  ].map((item, i) => (
                    <div key={i} className="bg-card p-4 flex flex-col items-center text-center">
                      <div className="h-9 w-9 rounded-lg bg-muted/30 flex items-center justify-center mb-2">
                        {item.icon}
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-sm mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Detail rows */}
                <div className="p-5 space-y-0">
                  {[
                    { icon: <Hash className="h-3.5 w-3.5" />, label: 'HS Code', value: shipment_summary.import_hsn, mono: true },
                    { icon: <Banknote className="h-3.5 w-3.5" />, label: 'Currency', value: importCurrencyCode !== foreignCurrencyCode ? `${importCurrencyCode} / ${foreignCurrencyCode}` : importCurrencyCode },
                    { icon: <Repeat className="h-3.5 w-3.5" />, label: 'Exchange Rate', value: shipment_summary.selected_currency_rate },
                    ...(parseFormattedNumber(shipment_summary.international_freight) > 0
                      ? [{ icon: <Ship className="h-3.5 w-3.5" />, label: "Int'l Freight", value: `${shipment_summary.international_freight} (${primaryCurrencyCode})` }]
                      : []),
                    ...(parseFormattedNumber(shipment_summary.insurance_charges) > 0
                      ? [{ icon: <Building2 className="h-3.5 w-3.5" />, label: 'Insurance', value: `${shipment_summary.insurance_charges} (${primaryCurrencyCode})` }]
                      : []),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className={`font-semibold text-sm ${(item as any).mono ? 'font-mono' : ''}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Applied Selections */}
                {shipment_summary.dynamic_inputs.length > 0 && (
                  <div className="border-t border-border p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Applied Selections</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {shipment_summary.dynamic_inputs
                        .filter((input) => {
                          const label = input.user_input_selection_label || input.value || '';
                          return !/^\d+[_\-]\d+$/.test(label.trim());
                        })
                        .map((input, index) => (
                          <div key={index} className="bg-muted/20 rounded-lg p-3 border border-border">
                            <p className="uppercase tracking-wider text-muted-foreground text-[10px] md:text-xs">{input.user_input_label}</p>
                            <p className="font-medium mt-0.5 text-sm"> {input.user_input_selection_label}</p>
                            {!input.user_input_selection_label && input.value && (
                              <p className="font-medium mt-0.5 text-sm">{input.value}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* ── India Export Policy Tab (only when Exporting Country = India) ── */}
          {showExportPolicy && (
            <TabsContent value="export-policy" className="mt-6 space-y-4">
              <ExportPolicyInfo hsCode={exportPolicyHsCode} />
            </TabsContent>
          )}

          {/* ── India Import Policy Tab (only when Importing Country = India) ── */}
          {showImportPolicy && (
            <TabsContent value="import-policy" className="mt-6 space-y-4">
              <ImportPolicyInfo hsCode={exportPolicyHsCode} />
            </TabsContent>
          )}
        </Tabs>
      </motion.div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block p-4 border-b mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Import Duty Calculation</h1>
            <p className="text-sm text-muted-foreground">HS Code: {shipment_summary.import_hsn}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>{shipment_summary.export_country} → {shipment_summary.import_country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
