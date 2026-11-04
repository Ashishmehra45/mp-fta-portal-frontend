import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown, Check } from 'lucide-react';
import { cn, cleanApiText } from '@/lib/utils';

interface SelectionOption {
  value: string;
  label: string;
}

interface SelectionPopupProps {
  options: SelectionOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  className?: string;
  hasError?: boolean;
}

export function SelectionPopup({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  title = 'Select Option',
  className,
  hasError = false,
}: SelectionPopupProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const handleConfirm = () => {
    onValueChange(selectedValue);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedValue(value); // Reset to current value when opening
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          'w-full justify-between font-normal bg-background',
          !value && 'text-muted-foreground',
          hasError && 'border-destructive ring-2 ring-destructive/20',
          className
        )}
      >
        <span className="truncate">{selectedLabel ? cleanApiText(selectedLabel) : placeholder}</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0" aria-describedby={undefined}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>{cleanApiText(title)}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 h-[50vh] overflow-auto px-6 py-4">
            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              className="space-y-2"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedValue === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => setSelectedValue(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer leading-relaxed text-lg"
                  >
                    {cleanApiText(option.label)}
                  </Label>
                  {selectedValue === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedValue}>
              Confirm Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
