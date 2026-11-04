import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ListFilter, Hash, Type, Loader2, AlertCircle } from 'lucide-react';
import { useUserInputs, useDynamicInputs, UserInputValue } from '@/hooks/useUserInputs';
import { UserInputField, UserInputSelection } from '@/services/intgrowApi';
import { SelectionPopup } from './SelectionPopup';
import { cn, cleanApiText } from '@/lib/utils';

// Check if a country code exists in a comma-separated list of country codes
const countryListContains = (list: string | undefined | null, code: string): boolean => {
  if (!list || list === '') return true; // empty means all countries
  return list.toLowerCase().split(',').map(s => s.trim()).includes(code.toLowerCase());
};

interface DynamicUserInputsProps {
  hsCode: string;
  importingCountryCode: string;
  originCountryCode: string;
  exportingCountryCode: string;
  onInputsChange: (inputs: UserInputValue[]) => void;
  renderSection?: 'adCv' | 'other' | 'all';
  showValidationErrors?: boolean;
}

export interface DynamicUserInputsRef {
  getValidationErrors: () => string[];
  getVisibleFieldCount: () => number;
}

export const DynamicUserInputs = forwardRef<DynamicUserInputsRef, DynamicUserInputsProps>(({
  hsCode,
  importingCountryCode,
  originCountryCode,
  exportingCountryCode,
  onInputsChange,
  renderSection = 'all',
  showValidationErrors = false,
}, ref) => {
  const [inputValues, setInputValues] = useState<Record<string, UserInputValue>>({});
  const [dynamicFields, setDynamicFields] = useState<UserInputField[]>([]);
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());

  const { data: userInputsData, isLoading, isFetching, isError } = useUserInputs(
    hsCode,
    importingCountryCode,
    exportingCountryCode,
    originCountryCode,
    !!hsCode && !!importingCountryCode
  );

  const dynamicInputsMutation = useDynamicInputs();

  // Get all fields (initial + dynamic)
  const allFields = [...(userInputsData?.inputs || []), ...dynamicFields];

  // Filter to show only root-level fields or fields whose parent has been selected
  const visibleFields = allFields.filter((field) => {
    if (!field.parent_hsn_uid) return true;
    // Check if parent field has a value selected
    return Object.values(inputValues).some(
      (val) => val.hsn_uid === field.parent_hsn_uid && val.value
    );
  });

  // Helper to categorize fields
  const isAntiDumpingField = (field: UserInputField) => 
    (field.field.toLowerCase().includes('anti') || field.field.toLowerCase().includes('dumping') ||
     field.label.toLowerCase().includes('anti') || field.label.toLowerCase().includes('dumping')) &&
    !field.field.toLowerCase().includes('countervail') && !field.label.toLowerCase().includes('countervail');
  
  const isCountervailField = (field: UserInputField) =>
    field.field.toLowerCase().includes('countervail') || field.label.toLowerCase().includes('countervail');
  
  const isSafeguardField = (field: UserInputField) =>
    field.field.toLowerCase().includes('safeguard') || field.label.toLowerCase().includes('safeguard');
  
  const isExporterField = (field: UserInputField) =>
    field.field.toLowerCase().includes('exporter') || field.label.toLowerCase().includes('exporter');

  const isAdCvField = (field: UserInputField) =>
    isAntiDumpingField(field) || isCountervailField(field) || isSafeguardField(field);

  // Check if a selection field has valid filtered options
  const hasValidFilteredOptions = (field: UserInputField) => {
    if (field.value_type !== 'selection' || !field.selections) return true;
    
    const filteredSelections = field.selections.filter((s) => {
      const impMatch = countryListContains(s.uis_imp_country, importingCountryCode);
      const orgMatch = countryListContains(s.uis_org_country, originCountryCode);
      const expMatch = countryListContains(s.uis_exp_country, exportingCountryCode);
      return impMatch && orgMatch && expMatch;
    });
    
    return filteredSelections.length > 0;
  };

  // Sort fields: AD Exporter → AD Declaration → CV Exporter → CV Declaration → Others
  const sortedVisibleFields = [...visibleFields].sort((a, b) => {
    const getPriority = (field: UserInputField) => {
      if (isAntiDumpingField(field) && isExporterField(field)) return 1;
      if (isAntiDumpingField(field)) return 2; // Declaration
      if (isCountervailField(field) && isExporterField(field)) return 3;
      if (isCountervailField(field)) return 4; // Declaration
      if (isSafeguardField(field)) return 5;
      return 6; // Others
    };
    return getPriority(a) - getPriority(b);
  });

  // Separate fields: AD/CV/Safeguard fields vs other fields (like quantity inputs)
  // Only include AD/CV fields that have valid filtered options
  const adCvFields = sortedVisibleFields.filter(f => isAdCvField(f) && hasValidFilteredOptions(f));
  const otherFields = sortedVisibleFields.filter(f => !isAdCvField(f));

  // Determine which fields to render based on renderSection prop
  const fieldsToRender = renderSection === 'adCv' 
    ? adCvFields 
    : renderSection === 'other' 
      ? otherFields 
      : sortedVisibleFields;

  // Expose validation methods via ref
  useImperativeHandle(ref, () => ({
    getValidationErrors: () => {
      const errors: string[] = [];
      fieldsToRender.forEach(field => {
        const value = inputValues[field.hsn_uid]?.value;
        if (!value || value.trim() === '') {
          errors.push(field.hsn_uid);
        }
      });
      return errors;
    },
    getVisibleFieldCount: () => fieldsToRender.length,
  }), [fieldsToRender, inputValues]);

  // Notify parent of input changes
  useEffect(() => {
    const values = Object.values(inputValues);
    onInputsChange(values);
  }, [inputValues, onInputsChange]);

  // Reset when HS code changes
  useEffect(() => {
    setInputValues({});
    setDynamicFields([]);
  }, [hsCode, importingCountryCode]);

  const handleInputChange = useCallback((field: UserInputField, value: string, selection?: UserInputSelection) => {
    const newValue: UserInputValue = {
      hsn_uid: field.hsn_uid,
      field: field.field,
      value,
      uis_hsn_uid_type: selection?.uis_hsn_uid_type,
    };

    setInputValues((prev) => ({
      ...prev,
      [field.hsn_uid]: newValue,
    }));

    // If this is a selection field, fetch dynamic inputs for cascading options
    if (field.value_type === 'selection' && selection) {
      setLoadingFields((prev) => new Set(prev).add(field.hsn_uid));

      dynamicInputsMutation.mutate(
        {
          hscode: hsCode,
          imp: importingCountryCode,
          org: originCountryCode,
          exp: exportingCountryCode,
          ui_hsn_uid: field.hsn_uid,
          uis_hsn_uid_type: selection.uis_hsn_uid_type || selection.uis_hsn_uid || selection.uis_label || '',
        },
        {
          onSuccess: (data) => {
            if (data.inputs && data.inputs.length > 0) {
              // Remove any existing dynamic fields that were children of this field
              setDynamicFields((prev) => {
                const filtered = prev.filter(
                  (f) => f.parent_hsn_uid !== field.hsn_uid
                );
                return [...filtered, ...data.inputs];
              });
            }
            setLoadingFields((prev) => {
              const next = new Set(prev);
              next.delete(field.hsn_uid);
              return next;
            });
          },
          onError: () => {
            setLoadingFields((prev) => {
              const next = new Set(prev);
              next.delete(field.hsn_uid);
              return next;
            });
          },
        }
      );
    }
  }, [hsCode, importingCountryCode, originCountryCode, exportingCountryCode, dynamicInputsMutation]);

  const getInputIcon = (valueType: string) => {
    switch (valueType) {
      case 'number':
        return <Hash className="h-4 w-4" />;
      case 'selection':
        return <ListFilter className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const renderField = (field: UserInputField, index: number, hasError: boolean = false) => {
    const isFieldLoading = loadingFields.has(field.hsn_uid);
    const level = parseInt(field.level) || 0;

    return (
      <motion.div
        key={field.hsn_uid}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.1 }}
        className="relative"
        style={{ marginLeft: level * 16 }}
      >
        {level > 0 && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-md",
              hasError ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}>
              {hasError ? <AlertCircle className="h-4 w-4" /> : getInputIcon(field.value_type)}
            </div>
            <Label htmlFor={field.hsn_uid} className={cn(
              "text-sm font-medium",
              hasError && "text-destructive"
            )}>
              {cleanApiText(field.label)}
              <span className="text-destructive ml-0.5">*</span>
            </Label>
            {field.conditional && (
              <Badge variant="outline" className="text-xs">
                Conditional
              </Badge>
            )}
            {hasError && (
              <span className="text-xs text-destructive">Required</span>
            )}
          </div>

          {field.value_type === 'number' && (
            <Input
              id={field.hsn_uid}
              type="number"
              placeholder="Enter value"
              value={inputValues[field.hsn_uid]?.value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={cn(
                "bg-background",
                hasError && "border-destructive ring-2 ring-destructive/20"
              )}
            />
          )}

          {field.value_type === 'string' && (
            <Input
              id={field.hsn_uid}
              type="text"
              placeholder="Enter value"
              value={inputValues[field.hsn_uid]?.value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={cn(
                "bg-background",
                hasError && "border-destructive ring-2 ring-destructive/20"
              )}
            />
          )}

          {field.value_type === 'selection' && (
            <div className="relative">
              <SelectionPopup
                options={
                  isAdCvField(field)
                    ? field.selections?.filter((s) => {
                        const impMatch = countryListContains(s.uis_imp_country, importingCountryCode);
                        const orgMatch = countryListContains(s.uis_org_country, originCountryCode);
                        const expMatch = countryListContains(s.uis_exp_country, exportingCountryCode);
                        return impMatch && orgMatch && expMatch;
                      }).map((s) => ({
                        value: s.uis_hsn_uid_type || s.uis_hsn_uid || s.uis_label,
                        label: s.uis_label,
                      })) || []
                    : field.selections?.map((s) => ({
                        value: s.uis_hsn_uid_type,
                        label: s.uis_label,
                      })) || []
                }
                value={inputValues[field.hsn_uid]?.value || ''}
                onValueChange={(value) => {
                  const selection = isAdCvField(field)
                    ? field.selections?.find((s) => (s.uis_hsn_uid_type || s.uis_hsn_uid || s.uis_label) === value)
                    : field.selections?.find((s) => s.uis_hsn_uid_type === value);
                  handleInputChange(field, value, selection);
                }}
                placeholder="Select an option"
                title={cleanApiText(field.label)}
                hasError={hasError}
              />
              {isFieldLoading && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (!hsCode || !importingCountryCode) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-accent/30 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="h-1 bg-accent/50 animate-pulse" />
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-accent/10 text-accent">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            Loading Product Details...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-10 w-full" />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !userInputsData?.inputs || userInputsData.inputs.length === 0) {
    return null;
  }

  if (fieldsToRender.length === 0) {
    return null;
  }

  const sectionTitle = renderSection === 'adCv' 
    ? 'Special Duty Selections' 
    : 'Additional Product Details';

  // Check if a field has validation error
  const hasFieldError = (fieldId: string) => {
    if (!showValidationErrors) return false;
    const value = inputValues[fieldId]?.value;
    return !value || value.trim() === '';
  };

  return (
    <Card className="border-accent/30 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="h-1 bg-accent" />
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent/10 text-accent">
            <ListFilter className="h-4 w-4" />
          </div>
          {sectionTitle}
          {isFetching && !isLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
          )}
          <Badge variant="secondary" className="ml-auto">
            {fieldsToRender.length} {fieldsToRender.length === 1 ? 'field' : 'fields'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {fieldsToRender.map((field, index) => renderField(field, index, hasFieldError(field.hsn_uid)))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

DynamicUserInputs.displayName = 'DynamicUserInputs';