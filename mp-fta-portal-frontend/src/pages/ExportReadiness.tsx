import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { readinessSections, readinessLevel, scoreOf, type Answer } from '@/data/readiness';
import { downloadPdfReport } from '@/lib/reports';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const opts: { v: Answer; label: string }[] = [{ v: 'yes', label: 'Yes' }, { v: 'partial', label: 'Partly' }, { v: 'no', label: 'No' }];

const ExportReadiness = () => {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [company, setCompany] = useState('');
  const allQ = readinessSections.flatMap((s) => s.questions);
  const answered = Object.keys(answers).length;

  const report = useMemo(() => {
    const max = allQ.length * 2;
    const got = allQ.reduce((s, q) => s + scoreOf(answers[q.id]), 0);
    const pct = Math.round((got / max) * 100);
    const sections = readinessSections.map((s) => {
      const m = s.questions.length * 2;
      const g = s.questions.reduce((a, q) => a + scoreOf(answers[q.id]), 0);
      const missing = s.questions.filter((q) => answers[q.id] !== 'yes');
      return { ...s, pct: Math.round((g / m) * 100), missing };
    });
    return { pct, level: readinessLevel(pct), sections };
  }, [answers, allQ]);

  const complete = answered === allQ.length;


  return (
    <PortalLayout>
      <PageHeader eyebrow="Free Trade Agreements · Readiness" title="Export Readiness Assessment" description="Answer short questions across ten areas to see how ready your business is to export and claim Free Trade Agreement benefits, and what to do next." />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2 max-w-sm"><Label htmlFor="co">Business name (for your report)</Label><Input id="co" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          {readinessSections.map((s, i) => (
            <Card key={s.id}>
              <CardHeader className="pb-2"><CardTitle className="text-base font-sans"><span className="font-mono text-xs text-muted-foreground mr-2">{String(i + 1).padStart(2, '0')}</span>{s.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {s.questions.map((q) => (
                  <div key={q.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">{q.text}</p>
                    <div className="flex gap-1 shrink-0" role="radiogroup" aria-label={q.text}>
                      {opts.map((o) => (
                        <Button key={o.v} type="button" size="sm" role="radio" aria-checked={answers[q.id] === o.v} variant={answers[q.id] === o.v ? 'default' : 'outline'} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.v }))}>{o.label}</Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 h-fit">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Readiness report</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setAnswers({})}><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-end justify-between">
                  <p className={cn('font-display text-5xl font-semibold', report.level.tone === 'ok' ? 'text-accent' : 'text-warning')}>{report.pct}%</p>
                  <p className="font-semibold">{report.level.label}</p>
                </div>
                <Progress value={report.pct} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">{answered} of {allQ.length} questions answered{!complete && ' — unanswered questions count as “No”'}</p>
              </div>
              <ul className="space-y-2">
                {report.sections.map((s) => (
                  <li key={s.id} className="text-sm">
                    <div className="flex justify-between"><span>{s.title}</span><span className="font-mono text-xs">{s.pct}%</span></div>
                    <div className="mt-1 h-1.5 rounded bg-border"><div className={cn('h-1.5 rounded', s.pct >= 75 ? 'bg-accent' : s.pct >= 40 ? 'bg-primary' : 'bg-warning')} style={{ width: `${s.pct}%` }} /></div>
                  </li>
                ))}
              </ul>
              {report.sections.some((s) => s.missing.length > 0) && (
                <div>
                  <p className="text-sm font-semibold mb-2">Missing requirements and recommended actions</p>
                  <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
                    {report.sections.filter((s) => s.missing.length > 0).map((s) => (
                      <div key={s.id} className="rounded-md border p-3 text-sm">
                        <p className="font-medium">{s.title}</p>
                        <ul className="mt-1 list-disc pl-5 text-muted-foreground space-y-1">
                          {s.missing.map((q) => <li key={q.id}>{q.action}</li>)}
                        </ul>
                        <p className="mt-2 text-xs"><span className="font-semibold">Support:</span> {s.support}</p>
                        <p className="text-xs"><span className="font-semibold">Learn:</span> {s.learn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-sm">
                <Link to="/compliance-navigator" className="text-primary underline">Compliance Navigator</Link>
                <Link to="/rules-of-origin" className="text-primary underline">Rules of Origin Advisor</Link>
                <Link to="/knowledge-support" className="text-primary underline">Guides & support</Link>
              </div>
            </CardContent>
          </Card>
          <DataNotice variant="advisory">This score is an advisory assessment, not a statutory approval.</DataNotice>
        </aside>
      </div>
    </PortalLayout>
  );
};

export default ExportReadiness;
