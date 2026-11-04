import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataNotice } from '@/components/portal/DataNotice';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import assistantMark from '@/assets/trade-assistant-mark.png';
import { RotateCcw } from 'lucide-react';

const examples = [
  'Which FTA markets should I explore for my textile products?',
  'What customs duty applies to my product in the United Kingdom?',
  'What origin requirements apply to my product under the India–UAE CEPA?',
  'What certifications may I need to export food products to Australia?',
  'What information is required to estimate my preferential duty savings?',
];

const Assistant = () => {
  const [input, setInput] = useState('');
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trade-assistant`,
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      }),
    [],
  );
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    onError: (err) => {
      const m = err.message || '';
      if (/402|credit/i.test(m)) toast.error('AI credits are exhausted. Please try again later.');
      else if (/429|rate/i.test(m)) toast.error('The assistant is busy. Please wait a moment and try again.');
      else toast.error('The assistant could not respond. Check your connection and try again.');
    },
  });
  const busy = status === 'submitted' || status === 'streaming';

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput('');
  };

  return (
    <PortalLayout>
      <PageHeader eyebrow="Free Trade Agreements · Assistant" title="AI Trade Assistant" description="Ask questions about Free Trade Agreements (FTAs), tariffs, rules of origin and market requirements. Answers cite official sources and never guess tariff rates." />
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex h-[70vh] min-h-[520px] flex-col rounded-lg border bg-card shadow-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={assistantMark} alt="" className="h-8 w-8" />
                <div>
                  <p className="text-sm font-semibold">MP Trade Assistant</p>
                  <p className="text-xs text-muted-foreground">Powered by IntGrow · guidance only</p>
                </div>
              </div>
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => { stop(); setMessages([]); }}><RotateCcw className="mr-1 h-3.5 w-3.5" />New chat</Button>
              )}
            </div>
            <Conversation className="flex-1">
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    icon={<img src={assistantMark} alt="" className="h-16 w-16" />}
                    title="How can I help with your exports?"
                    description="Try one of the questions on the right, or ask your own. Include your product, HS code and destination for better answers."
                  />
                ) : (
                  messages.map((m) => (
                    <Message key={m.id} from={m.role}>
                      <MessageContent className={m.role === 'user' ? 'bg-primary text-primary-foreground' : ''}>
                        {m.parts.map((p, i) =>
                          p.type === 'text' ? (
                            m.role === 'assistant' ? <MessageResponse key={i}>{p.text}</MessageResponse> : <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                          ) : null,
                        )}
                      </MessageContent>
                    </Message>
                  ))
                )}
                {status === 'submitted' && (
                  <Message from="assistant"><MessageContent><Shimmer>Checking official guidance…</Shimmer></MessageContent></Message>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
            <div className="border-t p-3">
              <PromptInput onSubmit={(msg) => send(msg.text)}>
                <PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a product, market or agreement…" />
                <PromptInputFooter className="justify-end">
                  <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !input.trim()} />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </div>
        </div>
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3">Example questions</p>
            <div className="space-y-2">
              {examples.map((e) => (
                <button key={e} type="button" disabled={busy} onClick={() => send(e)} className="w-full rounded-md border px-3 py-2 text-left text-sm hover:border-primary hover:bg-muted disabled:opacity-50">{e}</button>
              ))}
            </div>
          </div>
          <DataNotice variant="advisory">
            The assistant distinguishes verified facts from preliminary assessments and does not give legal advice. For complex cases, <Link to="/knowledge-support#assist" className="text-primary underline">request an authorised trade expert</Link>. For exact duty rates use the <Link to="/tariff-savings-calculator" className="text-primary underline">Global Duty Calculator</Link>.
          </DataNotice>
          <p className="text-xs text-muted-foreground">Conversations are not saved; starting a new chat or leaving the page clears it.</p>
        </aside>
      </div>
    </PortalLayout>
  );
};

export default Assistant;
