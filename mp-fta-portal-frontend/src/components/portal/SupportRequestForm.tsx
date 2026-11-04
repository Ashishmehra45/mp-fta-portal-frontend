import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { districts } from '@/data/districts';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';

type RequestType = 'assistance' | 'expert_referral' | 'buyer_report' | 'opportunity_submission' | 'data_correction';

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(120),
  email: z.string().trim().email('Enter a valid email').max(255),
  organisation: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, 'Please add a few more details').max(4000),
});

interface Props {
  types: { value: RequestType; label: string }[];
  topics?: string[];
  submitLabel?: string;
}

export function SupportRequestForm({ types, topics, submitLabel = 'Submit request' }: Props) {
  const [type, setType] = useState<RequestType>(types[0].value);
  const [topic, setTopic] = useState(topics?.[0] ?? '');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get('name'),
      email: fd.get('email'),
      organisation: (fd.get('organisation') as string) || undefined,
      message: fd.get('message'),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.from('support_requests').insert({
      request_type: type,
      name: parsed.data.name,
      email: parsed.data.email,
      organisation: parsed.data.organisation ?? null,
      district: district || null,
      topic: topic || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error('Could not submit your request. Please try again.');
      return;
    }
    setDone(true);
    toast.success('Request received');
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 rounded-md border border-accent/40 bg-accent-soft p-4 text-sm">
        <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
        <div>
          <p className="font-semibold">Thank you — your request has been recorded.</p>
          <p className="text-muted-foreground">An authorised officer or trade expert will follow up by email. Response times depend on the support desk once it is operational.</p>
          <Button variant="link" className="px-0" onClick={() => setDone(false)}>Submit another request</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      {types.length > 1 && (
        <div className="space-y-2">
          <Label>Request type</Label>
          <Select value={type} onValueChange={(v) => setType(v as RequestType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{types.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      )}
      {topics && (
        <div className="space-y-2">
          <Label>Topic</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="sr-name">Name</Label>
        <Input id="sr-name" name="name" maxLength={120} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sr-email">Email</Label>
        <Input id="sr-email" name="email" type="email" maxLength={255} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sr-org">Organisation <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input id="sr-org" name="organisation" maxLength={200} />
      </div>
      <div className="space-y-2">
        <Label>District <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
          <SelectContent className="max-h-64">{[...districts].sort((a, b) => a.name.localeCompare(b.name)).map((d) => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="sr-msg">Details</Label>
        <Textarea id="sr-msg" name="message" rows={4} maxLength={4000} aria-invalid={!!errors.message} placeholder="Product, HS code, destination and what you need help with" />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>
      <div className="sm:col-span-2 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Your details are used only to respond to this request.</p>
        <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitLabel}</Button>
      </div>
    </form>
  );
}
