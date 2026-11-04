import { useState, useMemo, useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { transportModes } from "@/data/mockData";
import { useCountries, Country } from "@/hooks/useCountries";
import { useCurrencies, Currency } from "@/hooks/useCurrencies";
import { HsCodeSearchDialog } from "./HsCodeSearchDialog";
import { DynamicUserInputs, DynamicUserInputsRef } from "./DynamicUserInputs";
import { UserInputValue } from "@/hooks/useUserInputs";
import { Ship, Plane, Truck, Calculator, Loader2, Search, RotateCcw, PenLine, AlertCircle, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type Incoterm = "EXW" | "FOB" | "CIF";

export interface CalculatorFormData {
  originCountry: Country;
  exportingCountry: Country;
  importingCountry: Country;
  currency: Currency;
  productValue: number;
  hsCode: string;
  hsCodeDescription?: string;
  transportMode: string;
  incoterm: Incoterm;
  originCharges?: number;
  originFreight?: number;
  internationalFreight?: number;
  insuranceCharges?: number;
  userInputs?: UserInputValue[];
}

export interface CalculatorFormProps {
  onCalculate: (data: CalculatorFormData) => void;
  isLoading?: boolean;
  initialValues?: Partial<CalculatorFormData>;
  isEditMode?: boolean;
  isAuthenticated?: boolean;
}

const transportIcons = {
  sea: Ship,
  air: Plane,
  road: Truck,
};

const incoterms: { value: Incoterm; label: string; description: string }[] = [
  { value: "EXW", label: "EXW", description: "Ex Works" },
  { value: "FOB", label: "FOB", description: "Free on Board" },
  { value: "CIF", label: "CIF", description: "Cost, Insurance & Freight" },
];

// Helper component for modified field indicator
function ModifiedIndicator() {
  return (
    <Badge variant="outline" className="ml-2 px-1.5 py-0 h-4 bg-accent/20 text-accent border-accent/30 text-xs">
      <PenLine className="h-2.5 w-2.5 mr-0.5" />
      Modified
    </Badge>
  );
}

export function CalculatorForm({ onCalculate, isLoading, initialValues, isEditMode, isAuthenticated = true }: CalculatorFormProps) {
  const [originCountry, setOriginCountry] = useState<string>(initialValues?.originCountry?.code || "");
  const [exportingCountry, setExportingCountry] = useState<string>(initialValues?.exportingCountry?.code || "");
  const [importingCountry, setImportingCountry] = useState<string>(initialValues?.importingCountry?.code || "");
  const [currency, setCurrency] = useState<string>(initialValues?.currency?.code || "");

  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies(importingCountry);

  // Filter countries based on is_import and is_export
  const importCountries = useMemo(() => countries.filter((c) => c.isImport).sort((a, b) => a.name.localeCompare(b.name)), [countries]);
  
  // Exclude the selected importing country from origin and exporting country lists
  const exportCountries = useMemo(() => 
    countries
      .filter((c) => c.isExport && c.code !== importingCountry)
      .sort((a, b) => a.name.localeCompare(b.name)), 
    [countries, importingCountry]
  );

  // Deduplicate currencies by code
  const uniqueCurrencies = useMemo(() => {
    const seen = new Set<string>();
    return currencies.filter((c) => {
      if (seen.has(c.code)) return false;
      seen.add(c.code);
      return true;
    });
  }, [currencies]);

  // Set default currency to importing country's native currency when currencies load
  useMemo(() => {
    if (uniqueCurrencies.length > 0 && !currency && !initialValues?.currency) {
      // Try to find the importing country's default currency first
      const importObj = countries.find((c) => c.code === importingCountry);
      const importDefault = importObj?.currency;
      const match = importDefault
        ? uniqueCurrencies.find((c) => c.code.toUpperCase() === importDefault.toUpperCase())
        : null;
      setCurrency(match ? match.code : uniqueCurrencies[0].code);
    }
  }, [uniqueCurrencies, currency, initialValues?.currency, countries, importingCountry]);

  const [productValue, setProductValue] = useState<string>(initialValues?.productValue?.toString() || "");
  const [hsCode, setHsCode] = useState<string>(initialValues?.hsCode || "");
  const [hsCodeDescription, setHsCodeDescription] = useState<string>(initialValues?.hsCodeDescription || "");
  const [hsCodeConfirmed, setHsCodeConfirmed] = useState<boolean>(!!initialValues?.hsCode);
  const [hsDialogOpen, setHsDialogOpen] = useState(false);
  const [hsSearchQuery, setHsSearchQuery] = useState<string>("");
  const [transportMode, setTransportMode] = useState<string>(initialValues?.transportMode || "sea");
  const [incoterm, setIncoterm] = useState<Incoterm>(initialValues?.incoterm || "CIF");

  // Conditional fields based on incoterm
  const [originCharges, setOriginCharges] = useState<string>(initialValues?.originCharges?.toString() || "");
  const [originFreight, setOriginFreight] = useState<string>(initialValues?.originFreight?.toString() || "");
  const [internationalFreight, setInternationalFreight] = useState<string>(initialValues?.internationalFreight?.toString() || "");
  const [insuranceCharges, setInsuranceCharges] = useState<string>(initialValues?.insuranceCharges?.toString() || "");
  
  // Checkbox for unknown additional charges
  const [unknownCharges, setUnknownCharges] = useState<boolean>(false);

  // Dynamic user inputs
  const [userInputs, setUserInputs] = useState<UserInputValue[]>(initialValues?.userInputs || []);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  // Ref for dynamic input validation
  const dynamicInputsRef = useRef<DynamicUserInputsRef>(null);

  // Track modified fields in edit mode
  const modifiedFields = useMemo(() => {
    if (!isEditMode || !initialValues) return new Set<string>();

    const modified = new Set<string>();

    if (originCountry !== (initialValues.originCountry?.code || "")) modified.add("originCountry");
    if (exportingCountry !== (initialValues.exportingCountry?.code || "")) modified.add("exportingCountry");
    if (importingCountry !== (initialValues.importingCountry?.code || "")) modified.add("importingCountry");
    if (currency !== (initialValues.currency?.code || "")) modified.add("currency");
    if (productValue !== (initialValues.productValue?.toString() || "")) modified.add("productValue");
    if (hsCode !== (initialValues.hsCode || "")) modified.add("hsCode");
    if (transportMode !== (initialValues.transportMode || "sea")) modified.add("transportMode");
    if (incoterm !== (initialValues.incoterm || "CIF")) modified.add("incoterm");
    if (originCharges !== (initialValues.originCharges?.toString() || "")) modified.add("originCharges");
    if (originFreight !== (initialValues.originFreight?.toString() || "")) modified.add("originFreight");
    if (internationalFreight !== (initialValues.internationalFreight?.toString() || "")) modified.add("internationalFreight");
    if (insuranceCharges !== (initialValues.insuranceCharges?.toString() || "")) modified.add("insuranceCharges");

    return modified;
  }, [
    isEditMode, initialValues, originCountry, exportingCountry, importingCountry,
    currency, productValue, hsCode, transportMode, incoterm,
    originCharges, originFreight, internationalFreight, insuranceCharges
  ]);

  const modifiedCount = modifiedFields.size;

  //callback for dynamic user inputs multiple times 
  const handleUserInputsChange = useCallback((inputs: UserInputValue[]) => {
    // if key already exists, update it, else add it
    console.log(inputs);
    setUserInputs((prev) => {
      let updated = [...prev];
      inputs.forEach((input) => {
        const index = updated.findIndex((i) => i.field === input.field);
        if (index !== -1) {
          updated[index].value = input.value;
        } else {
          updated.push(input);
        }
      });
      return updated;
    });

  }, []);



  const handleReset = () => {
    setOriginCountry("");
    setExportingCountry("");
    setImportingCountry("");
    setCurrency("");
    setProductValue("");
    setHsCode("");
    setHsCodeDescription("");
    setHsCodeConfirmed(false);
    setHsSearchQuery("");
    setTransportMode("sea");
    setIncoterm("CIF");
    setOriginCharges("");
    setOriginFreight("");
    setInternationalFreight("");
    setInsuranceCharges("");
    setUnknownCharges(false);
    setUserInputs([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors = new Set<string>();

    // Required base fields
    if (!importingCountry) errors.add("importingCountry");
    if (!originCountry) errors.add("originCountry");
    if (!exportingCountry) errors.add("exportingCountry");
    if (!hsCode || !hsCodeConfirmed) errors.add("hsCode");
    if (!currency) errors.add("currency");
    if (!productValue) errors.add("productValue");
    
    // Validate additional charges if checkbox is not checked
    if (!unknownCharges) {
      if (incoterm === "EXW") {
        if (!originCharges) errors.add("originCharges");
        if (!originFreight) errors.add("originFreight");
        if (!internationalFreight) errors.add("internationalFreight");
        if (!insuranceCharges) errors.add("insuranceCharges");
      } else if (incoterm === "FOB" || incoterm === "CIF") {
        if (!internationalFreight) errors.add("internationalFreight");
        if (!insuranceCharges) errors.add("insuranceCharges");
      }
    }

    // Validate dynamic inputs
    const dynamicErrors = dynamicInputsRef.current?.getValidationErrors() || [];
    dynamicErrors.forEach(fieldId => errors.add(`dynamic_${fieldId}`));

    if (errors.size > 0) {
      setValidationErrors(errors);
      setShowValidationErrors(true);
      toast.error("Please fill in all required fields", {
        description: `${errors.size} field${errors.size !== 1 ? 's' : ''} need${errors.size === 1 ? 's' : ''} attention`,
      });
      return;
    }

    // Clear validation state
    setValidationErrors(new Set());
    setShowValidationErrors(false);

    const origin = countries.find((c) => c.code === originCountry);
    const exporting = countries.find((c) => c.code === exportingCountry);
    const importing = countries.find((c) => c.code === importingCountry);
    const curr = uniqueCurrencies.find((c) => c.code === currency);

    if (!origin || !exporting || !importing || !curr || !productValue || !hsCode) {
      return;
    }

    // When unknownCharges is checked, treat empty values as 0
    const getChargeValue = (value: string) => {
      if (unknownCharges && !value) return 0;
      return value ? parseFloat(value) : undefined;
    };

    onCalculate({
      originCountry: origin,
      exportingCountry: exporting,
      importingCountry: importing,
      currency: curr,
      productValue: parseFloat(productValue),
      hsCode,
      transportMode,
      incoterm,
      userInputs: userInputs.length > 0 ? userInputs : undefined,
      ...(incoterm === "EXW" && {
        originCharges: getChargeValue(originCharges),
        originFreight: getChargeValue(originFreight),
        internationalFreight: getChargeValue(internationalFreight),
        insuranceCharges: getChargeValue(insuranceCharges),
      }),
      ...(incoterm === "FOB" && {
        internationalFreight: getChargeValue(internationalFreight),
        insuranceCharges: getChargeValue(insuranceCharges),
      }),
      ...(incoterm === "CIF" && {
        internationalFreight: getChargeValue(internationalFreight),
        insuranceCharges: getChargeValue(insuranceCharges),
      }),
    });
  };

  // Helper to check if field has error
  const hasError = (fieldName: string) => showValidationErrors && validationErrors.has(fieldName);

  // Sync exporting country with origin country by default
  const handleOriginChange = (value: string) => {
    setOriginCountry(value);
    if (!exportingCountry) {
      setExportingCountry(value);
    }
  };

  const handleHsCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHsSearchQuery(value);
    // Clear confirmed state when user manually edits
    setHsCode("");
    setHsCodeDescription("");
    setHsCodeConfirmed(false);
    if (value.length >= 2) {
      setHsDialogOpen(true);
    }
  };

  const handleHsCodeSelect = (selected: { code: string; description: string }) => {
    setHsCode(selected.code);
    setHsCodeDescription(selected.description);
    setHsCodeConfirmed(true);
    setHsSearchQuery("");
  };

  const handleHsDialogOpenChange = (open: boolean) => {
    setHsDialogOpen(open);
    // If dialog is closed without selection and we had a previously confirmed code, restore it
    if (!open && !hsCodeConfirmed && hsCode) {
      setHsCodeConfirmed(true);
      setHsSearchQuery("");
    }
  };

  const dataLoading = countriesLoading || currenciesLoading;

  // Get the selected currency object
  const selectedCurrencyObj = uniqueCurrencies.find((c) => c.code === currency);
  const currencyLabel = selectedCurrencyObj ? `${selectedCurrencyObj.code}` : '';

  // Get importing country's default currency
  const importingCountryObj = useMemo(() => countries.find((c) => c.code === importingCountry), [countries, importingCountry]);
  const importCountryCurrency = importingCountryObj?.currency || '';
  const isNativeCurrency = currency && importCountryCurrency && currency.toUpperCase() === importCountryCurrency.toUpperCase();

  // Get incoterm label for value field
  const getValueLabel = () => {
    const selectedIncoterm = incoterms.find((t) => t.value === incoterm);
    const base = `${selectedIncoterm?.value || "Product"} Value`;
    return currencyLabel ? `${base} (${currencyLabel})` : base;
  };

  return (
    <Card className="calc-card">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight flex items-center gap-2 calc-serif text-2xl md:text-3xl">
          <Calculator className="text-primary w-7 h-7 md:w-8 md:h-8" />
          {isEditMode ? "Edit Calculation" : "Shipment Details"}
          {isEditMode && modifiedCount > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs bg-accent/20 text-accent">
              {modifiedCount} field{modifiedCount !== 1 ? 's' : ''} modified
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {isEditMode
            ? "Modify the fields below and recalculate. Modified fields are highlighted."
            : "Enter your import details to calculate duties"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Importing Country */}
          <div className="space-y-2">
            <Label htmlFor="importing" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("importingCountry") && "text-destructive")}>
              Importing Country (Destination)
              <span className="text-destructive ml-0.5">*</span>
              {modifiedFields.has("importingCountry") && <ModifiedIndicator />}
              {hasError("importingCountry") && <span className="ml-2 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
            </Label>
            <Select
              value={importingCountry}
              onValueChange={(value) => {
                setImportingCountry(value);
                setCurrency(""); // Reset currency when country changes
                // Reset origin and exporting countries if they match the new importing country
                if (originCountry === value) setOriginCountry("");
                if (exportingCountry === value) setExportingCountry("");
              }}
              disabled={dataLoading}
            >
              <SelectTrigger id="importing" className={cn(
                modifiedFields.has("importingCountry") && "ring-2 ring-accent/50",
                hasError("importingCountry") && "border-destructive ring-2 ring-destructive/20"
              )}>
                <SelectValue placeholder={dataLoading ? "Loading..." : "Select importing country"} />
              </SelectTrigger>
              <SelectContent>
                {importCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <img src={country.flag} alt="" className="w-5 h-4 object-cover rounded-sm" />
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Origin Country */}
          <div className="space-y-2">
            <Label htmlFor="origin" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("originCountry") && "text-destructive")}>
              Origin Country (Manufacturing)
              <span className="text-destructive ml-0.5">*</span>
              {modifiedFields.has("originCountry") && <ModifiedIndicator />}
              {hasError("originCountry") && <span className="ml-2 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
            </Label>
            <Select value={originCountry} onValueChange={handleOriginChange} disabled={dataLoading}>
              <SelectTrigger id="origin" className={cn(
                modifiedFields.has("originCountry") && "ring-2 ring-accent/50",
                hasError("originCountry") && "border-destructive ring-2 ring-destructive/20"
              )}>
                <SelectValue placeholder={dataLoading ? "Loading..." : "Select origin country"} />
              </SelectTrigger>
              <SelectContent>
                {exportCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <img src={country.flag} alt="" className="w-5 h-4 object-cover rounded-sm" />
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exporting Country */}
          <div className="space-y-2">
            <Label htmlFor="exporting" className={cn("flex items-center", hasError("exportingCountry") && "text-destructive")}>
              Exporting Country (Shipping or Exporters Country)
              <span className="text-destructive ml-0.5">*</span>
              {modifiedFields.has("exportingCountry") && <ModifiedIndicator />}
              {hasError("exportingCountry") && <span className="ml-2 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
            </Label>
            <Select value={exportingCountry} onValueChange={setExportingCountry} disabled={dataLoading}>
              <SelectTrigger id="exporting" className={cn(
                modifiedFields.has("exportingCountry") && "ring-2 ring-accent/50",
                hasError("exportingCountry") && "border-destructive ring-2 ring-destructive/20"
              )}>
                <SelectValue placeholder={dataLoading ? "Loading..." : "Select exporting country"} />
              </SelectTrigger>
              <SelectContent>
                {exportCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <img src={country.flag} alt="" className="w-5 h-4 object-cover rounded-sm" />
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* HS Code - moved before currency */}
          <div className="space-y-2">
            <Label htmlFor="hsCode" className={cn("flex items-center", hasError("hsCode") && "text-destructive")}>
              HS Code
              <span className="text-destructive ml-0.5">*</span>
              {modifiedFields.has("hsCode") && <ModifiedIndicator />}
              {hasError("hsCode") && (
                <span className="ml-2 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {hsSearchQuery && !hsCodeConfirmed ? "Must be selected from search" : "Required"}
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="hsCode"
                placeholder={importingCountry ? "Search HS Code or product name..." : "Select importing country first"}
                value={hsCodeConfirmed ? hsCode : hsSearchQuery}
                onChange={handleHsCodeInputChange}
                onClick={() => {
                  if (hsCodeConfirmed && hsCode) {
                    setHsSearchQuery(hsCode);
                    setHsDialogOpen(true);
                  }
                }}
                disabled={!importingCountry}
                className={cn(
                  hsCodeConfirmed && "pr-10",
                  modifiedFields.has("hsCode") && "ring-2 ring-accent/50",
                  hasError("hsCode") && "border-destructive ring-2 ring-destructive/20",
                  !importingCountry && "opacity-60 cursor-not-allowed"
                )}
              />
              {hsCodeConfirmed ? (
                <button
                  type="button"
                  onClick={() => {
                    setHsCode("");
                    setHsCodeDescription("");
                    setHsCodeConfirmed(false);
                    setHsSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear HS Code"
                >
                  ✕
                </button>
              ) : (
                <Search
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    importingCountry ? "text-muted-foreground cursor-pointer hover:text-foreground" : "text-muted-foreground/40 cursor-not-allowed"
                  )}
                  onClick={() => importingCountry && setHsDialogOpen(true)}
                />
              )}
            </div>
            {/* Status indicator */}
            {hsCodeConfirmed && hsCode ? (
              <div className="flex items-center gap-2 text-xs text-primary">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-mono font-semibold">{hsCode}</span>
                <span className="text-muted-foreground">— confirmed from search</span>
              </div>
            ) : hsSearchQuery && !hsCodeConfirmed ? (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-md">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                <p className="text-xs text-destructive">
                  Please <button type="button" className="underline font-medium" onClick={() => setHsDialogOpen(true)}>select an HS code from the search results</button>. Typing alone is not accepted.
                </p>
              </div>
            ) : hsCodeDescription ? (
              <p className="text-xs text-muted-foreground">{hsCodeDescription}</p>
            ) : null}
          </div>

          {/* Incoterm Selection - moved before value */}
          <div className="space-y-2">
            <Label className="flex items-center">
              Incoterm
              {modifiedFields.has("incoterm") && <ModifiedIndicator />}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {incoterms.map((term) => (
                <button
                  key={term.value}
                  type="button"
                  onClick={() => setIncoterm(term.value)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                    incoterm === term.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    modifiedFields.has("incoterm") && incoterm === term.value && "ring-2 ring-accent/50"
                  )}
                >
                  <span className={`font-bold text-lg ${incoterm === term.value ? "text-primary" : "text-foreground"}`}>
                    {term.label}
                  </span>
                  <span className="text-muted-foreground text-xs">{term.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Currency and Value */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="currency" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("currency") && "text-destructive")}>
                Currency
                <span className="text-destructive ml-0.5">*</span>
                {modifiedFields.has("currency") && <ModifiedIndicator />}
              </Label>
              <Select value={currency} onValueChange={setCurrency} disabled={dataLoading || !importingCountry}>
                <SelectTrigger id="currency" className={cn(
                  modifiedFields.has("currency") && "ring-2 ring-accent/50",
                  hasError("currency") && "border-destructive ring-2 ring-destructive/20"
                )}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCurrencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError("currency") && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="value" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("productValue") && "text-destructive")}>
                {getValueLabel()}
                <span className="text-destructive ml-0.5">*</span>
                {modifiedFields.has("productValue") && <ModifiedIndicator />}
              </Label>
              <Input
                id="value"
                type="number"
                placeholder={currencyLabel ? `Enter ${incoterm} value in ${currencyLabel}` : `Enter ${incoterm} value`}
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                min="0"
                step="0.01"
                className={cn(
                  modifiedFields.has("productValue") && "ring-2 ring-accent/50",
                  hasError("productValue") && "border-destructive ring-2 ring-destructive/20"
                )}
              />
              {hasError("productValue") && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
              {currency && !isNativeCurrency && importCountryCurrency && (
                <p className="text-muted-foreground text-sm">
                  Value entered in <span className="font-semibold">{currencyLabel}</span> (foreign currency). Results will also show in <span className="font-semibold">{importCountryCurrency}</span> (importing country currency).
                </p>
              )}
              {currency && isNativeCurrency && (
                <p className="text-muted-foreground text-sm">
                  Value entered in <span className="font-semibold">{currencyLabel}</span> (importing country currency).
                </p>
              )}
            </div>
          </div>

          {/* Dynamic User Inputs - All sections combined */}
          {hsCodeConfirmed && hsCode && importingCountry && (
            <DynamicUserInputs
              ref={dynamicInputsRef}
              hsCode={hsCode}
              importingCountryCode={importingCountry}
              originCountryCode={originCountry}
              exportingCountryCode={exportingCountry}
              onInputsChange={handleUserInputsChange}
              renderSection="all"
              showValidationErrors={showValidationErrors}
            />
          )}

          {/* Conditional fields based on Incoterm */}
          {incoterm === "EXW" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-muted-foreground text-base">Additional Charges <span className="text-destructive">*</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="originCharges" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("originCharges") && !unknownCharges && "text-destructive")}>
                    Origin Charges
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("originCharges") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="originCharges"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={originCharges}
                    onChange={(e) => setOriginCharges(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("originCharges") && "ring-2 ring-accent/50",
                      hasError("originCharges") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("originCharges") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originFreight" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("originFreight") && !unknownCharges && "text-destructive")}>
                    Origin Freight
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("originFreight") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="originFreight"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={originFreight}
                    onChange={(e) => setOriginFreight(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("originFreight") && "ring-2 ring-accent/50",
                      hasError("originFreight") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("originFreight") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internationalFreight" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("internationalFreight") && !unknownCharges && "text-destructive")}>
                    International Freight
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("internationalFreight") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="internationalFreight"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={internationalFreight}
                    onChange={(e) => setInternationalFreight(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("internationalFreight") && "ring-2 ring-accent/50",
                      hasError("internationalFreight") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("internationalFreight") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceCharges" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("insuranceCharges") && !unknownCharges && "text-destructive")}>
                    Insurance Charges
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("insuranceCharges") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="insuranceCharges"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={insuranceCharges}
                    onChange={(e) => setInsuranceCharges(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("insuranceCharges") && "ring-2 ring-accent/50",
                      hasError("insuranceCharges") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("insuranceCharges") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-2 border-t border-border/50">
                <Checkbox
                  id="unknownChargesEXW"
                  checked={unknownCharges}
                  onCheckedChange={(checked) => setUnknownCharges(checked === true)}
                />
                <Label htmlFor="unknownChargesEXW" className="text-muted-foreground leading-tight cursor-pointer text-sm">
                  I don't know the additional charges. Treat values as zero and calculate taxes on provided values only.
                </Label>
              </div>
            </div>
          )}

          {incoterm === "FOB" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-muted-foreground text-base">Additional Charges <span className="text-destructive">*</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="internationalFreight" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("internationalFreight") && !unknownCharges && "text-destructive")}>
                    International Freight
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("internationalFreight") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="internationalFreight"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={internationalFreight}
                    onChange={(e) => setInternationalFreight(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("internationalFreight") && "ring-2 ring-accent/50",
                      hasError("internationalFreight") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("internationalFreight") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceCharges" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("insuranceCharges") && !unknownCharges && "text-destructive")}>
                    Insurance Charges
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("insuranceCharges") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="insuranceCharges"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={insuranceCharges}
                    onChange={(e) => setInsuranceCharges(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("insuranceCharges") && "ring-2 ring-accent/50",
                      hasError("insuranceCharges") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("insuranceCharges") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-2 border-t border-border/50">
                <Checkbox
                  id="unknownChargesFOB"
                  checked={unknownCharges}
                  onCheckedChange={(checked) => setUnknownCharges(checked === true)}
                />
                <Label htmlFor="unknownChargesFOB" className="text-muted-foreground leading-tight cursor-pointer text-sm">
                  I don't know the additional charges. Treat values as zero and calculate taxes on provided values only.
                </Label>
              </div>
            </div>
          )}

          {incoterm === "CIF" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-muted-foreground text-base">Additional Charges <span className="text-destructive">*</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="internationalFreight" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("internationalFreight") && !unknownCharges && "text-destructive")}>
                    International Freight
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("internationalFreight") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="internationalFreight"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={internationalFreight}
                    onChange={(e) => setInternationalFreight(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("internationalFreight") && "ring-2 ring-accent/50",
                      hasError("internationalFreight") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("internationalFreight") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceCharges" className={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-sm md:text-base", hasError("insuranceCharges") && !unknownCharges && "text-destructive")}>
                    Insurance Charges
                    {!unknownCharges && <span className="text-destructive ml-0.5">*</span>}
                    {modifiedFields.has("insuranceCharges") && <ModifiedIndicator />}
                  </Label>
                  <Input
                    id="insuranceCharges"
                    type="number"
                    placeholder={currencyLabel ? `0.00 (${currencyLabel})` : "0.00"}
                    value={insuranceCharges}
                    onChange={(e) => setInsuranceCharges(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={unknownCharges}
                    className={cn(
                      modifiedFields.has("insuranceCharges") && "ring-2 ring-accent/50",
                      hasError("insuranceCharges") && !unknownCharges && "border-destructive ring-2 ring-destructive/20",
                      unknownCharges && "bg-muted text-muted-foreground"
                    )}
                  />
                  {hasError("insuranceCharges") && !unknownCharges && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Required</span>}
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-2 border-t border-border/50">
                <Checkbox
                  id="unknownChargesCIF"
                  checked={unknownCharges}
                  onCheckedChange={(checked) => setUnknownCharges(checked === true)}
                />
                <Label htmlFor="unknownChargesCIF" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  I don't know the additional charges. Treat values as zero and calculate taxes on provided values only.
                </Label>
              </div>
            </div>
          )}

          {/* Transport Mode */}
          <div className="space-y-2">
            <Label className="flex items-center">
              Mode of Transport
              {modifiedFields.has("transportMode") && <ModifiedIndicator />}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {transportModes.map((mode) => {
                const Icon = transportIcons[mode.id as keyof typeof transportIcons];
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                      transportMode === mode.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      modifiedFields.has("transportMode") && transportMode === mode.id && "ring-2 ring-accent/50"
                    )}
                  >
                    <Icon
                      className={`h-6 w-6 mb-1 ${transportMode === mode.id ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-medium ${transportMode === mode.id ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      {mode.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button type="submit" className="flex-[2]" size="lg" disabled={isLoading || dataLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Duties
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* HS Code Search Dialog */}
      <HsCodeSearchDialog
        open={hsDialogOpen}
        onOpenChange={handleHsDialogOpenChange}
        onSelect={handleHsCodeSelect}
        importingCountryCode={importingCountry}
        initialQuery={hsSearchQuery}
      />
    </Card>
  );
}
