import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHsCodeSearch, HsCode } from "@/hooks/useHsCodeSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cleanApiText } from '@/lib/utils';
import { cleanSearchQuery, formToQuery, suggestProducts } from '@/lib/productSuggest';
import { ProductSuggestions } from '@/components/portal/ProductSuggestions';

interface HsCodeSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (hsCode: HsCode) => void;
  importingCountryCode: string;
  initialQuery?: string;
}

export function HsCodeSearchDialog({
  open,
  onOpenChange,
  onSelect,
  importingCountryCode,
  initialQuery = "",
}: HsCodeSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: results = [], isLoading } = useHsCodeSearch(cleanSearchQuery(debouncedQuery), importingCountryCode);
  const suggestions = useMemo(
    () => (/^\d{6,}$/.test(searchQuery.replace(/[\s.]/g, '')) ? [] : suggestProducts(searchQuery, 4)),
    [searchQuery],
  );

  useEffect(() => {
    if (open) {
      // Carry forward the initial query when dialog opens
      setSearchQuery(initialQuery);
      setSelectedCode("");
    }
  }, [open, initialQuery]);

  const handleSelect = () => {
    const selected = results.find((r) => r.code === selectedCode);
    if (selected) {
      onSelect(selected);
      onOpenChange(false);
      setSelectedCode("");
      setSearchQuery("");
    }
  };

  const formatDescription = (description: string) => {
    const lastColonIndex = description.lastIndexOf(":");
    if (lastColonIndex === -1) {
      return <span className="font-semibold">{description}</span>;
    }
    const beforeColon = description.substring(0, lastColonIndex + 1);
    const afterColon = description.substring(lastColonIndex + 1);
    return (
      <>
        <span className="text-muted-foreground">{beforeColon}</span>
        <span className="font-semibold">{afterColon}</span>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col gap-4 p-6" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl">Search HS Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Enter HS Code or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base h-12"
              autoFocus
            />
          </div>

          {suggestions.length > 0 && (
            <ProductSuggestions
              suggestions={suggestions}
              className="max-h-48 overflow-y-auto rounded-lg border"
              onPickCode={(hs) => setSearchQuery(hs)}
              onPickForm={(f) => setSearchQuery(formToQuery(f))}
            />
          )}

          {/* Column Headers */}
          <div className="grid grid-cols-[auto_120px_1fr] gap-4 px-4 py-2 bg-muted/50 rounded-t-lg border-b font-semibold text-muted-foreground text-base">
            <div className="w-5"></div>
            <div>Code</div>
            <div>Description</div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[350px] border rounded-lg -mt-4 rounded-t-none">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-base">
                {debouncedQuery.length < 2
                  ? "Enter at least 2 characters to search"
                  : "No HS codes found"}
              </div>
            ) : (
              <RadioGroup
                value={selectedCode}
                onValueChange={setSelectedCode}
                className="p-2 space-y-1"
              >
                {results.map((result) => (
                  <div
                    key={result.code}
                    className={`grid grid-cols-[auto_120px_1fr] gap-4 items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCode === result.code
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedCode(result.code)}
                  >
                    <RadioGroupItem value={result.code} id={result.code} className="mt-1" />
                    <Label htmlFor={result.code} className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-mono cursor-pointer text-base">
                      {result.code}
                    </Label>
                    <Label htmlFor={result.code} className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer leading-relaxed text-base">
                      {formatDescription(cleanApiText(result.description))}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedCode}>
              Select HS Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
