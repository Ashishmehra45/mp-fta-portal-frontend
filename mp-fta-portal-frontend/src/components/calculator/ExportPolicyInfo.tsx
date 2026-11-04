import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useExportPolicy, ExportPolicyRecord } from '@/hooks/useExportPolicy';
import {
  ScrollText,
  AlertCircle,
  Info,
  ChevronDown,
  Hash,
  FileWarning,
  Ban,
  CircleCheck,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cleanApiText } from '@/lib/utils';

interface ExportPolicyInfoProps {
  hsCode?: string;
}

function policyStyle(policy?: string | null): {
  badgeClass: string;
  Icon: typeof CircleCheck;
} {
  const p = (policy || '').trim().toLowerCase();
  if (p === 'free') {
    return { badgeClass: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30', Icon: CircleCheck };
  }
  if (p === 'restricted') {
    return { badgeClass: 'bg-amber-500/15 text-amber-600 border border-amber-500/30', Icon: ShieldAlert };
  }
  if (p === 'prohibited') {
    return { badgeClass: 'bg-destructive/15 text-destructive border border-destructive/30', Icon: Ban };
  }
  if (p === 'ste' || p.includes('state trading')) {
    return { badgeClass: 'bg-blue-500/15 text-blue-600 border border-blue-500/30', Icon: FileWarning };
  }
  return { badgeClass: 'bg-muted text-muted-foreground border border-border', Icon: Info };
}

function PolicyBadge({ policy }: { policy?: string | null }) {
  const { badgeClass, Icon } = policyStyle(policy);
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold ${badgeClass}`}>
      <Icon className="h-3.5 w-3.5" />
      {policy || 'Unknown'}
    </span>
  );
}

function PolicyRow({ record }: { record: ExportPolicyRecord }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-mono font-semibold text-base">{record.itc_hs_code}</span>
        </div>
        <PolicyBadge policy={record.export_policy} />
      </div>

      {record.policy_description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-medium line-clamp-2 cursor-help">
                {cleanApiText(record.policy_description)}
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-md">
              <p>{cleanApiText(record.policy_description)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {record.policy_description_notes && (
        <p className="text-sm text-muted-foreground">{cleanApiText(record.policy_description_notes)}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
        {record.unit && (
          <span>
            Unit: <span className="text-foreground font-medium">{record.unit}</span>
          </span>
        )}
        {record.export_policy_notes && (
          <span>
            Note: <span className="text-foreground font-medium">{cleanApiText(record.export_policy_notes)}</span>
          </span>
        )}
      </div>

      {record.nature_of_restriction && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-md p-2.5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Nature of Restriction</p>
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanApiText(record.nature_of_restriction) }} />
          {record.nature_of_restriction_notes && (
            <div className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: cleanApiText(record.nature_of_restriction_notes) }} />
          )}
        </div>
      )}

      {record.last_update && (
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(record.last_update).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export function ExportPolicyInfo({ hsCode }: ExportPolicyInfoProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data, isLoading, error, isError } = useExportPolicy(hsCode, !!hsCode);

  const records = data?.data ?? [];
  const hasData = records.length > 0;
  const primaryPolicy = records[0]?.export_policy;
  const { badgeClass, Icon: HeaderIcon } = policyStyle(primaryPolicy);

  if (!hsCode) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Card className="overflow-hidden border shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-b p-3 cursor-pointer hover:bg-emerald-500/5 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <ScrollText className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    India Export Policy
                    {hasData && (
                      <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                        {records.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    ITC (HS) — DGFT, Govt. of India · {isExpanded ? 'Collapse' : 'Expand'}
                  </p>
                </div>

                {hasData && primaryPolicy && (
                  <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-semibold ${badgeClass}`}>
                    <HeaderIcon className="h-4 w-4" />
                    {primaryPolicy}
                  </span>
                )}

                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted/50 flex-shrink-0">
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="p-4">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                  </motion.div>
                )}

                {isError && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-3 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Failed to load export policy</p>
                        <p className="text-sm text-muted-foreground">
                          {error instanceof Error ? error.message : 'An error occurred'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isLoading && !isError && !hasData && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Info className="h-5 w-5" />
                      <div>
                        <p className="font-medium">No policy record found</p>
                        <p className="text-sm">
                          No India export policy entry matches this HS code.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isLoading && !isError && hasData && (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {data?.matched_hs_code && data.matched_hs_code !== hsCode.replace(/\D/g, '') && (
                      <p className="text-xs text-muted-foreground">
                        Matched at ITC (HS) level <span className="font-mono font-medium">{data.matched_hs_code}</span>
                      </p>
                    )}
                    {records.map((record, i) => (
                      <PolicyRow key={`${record.itc_hs_code}-${i}`} record={record} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
