import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Bot, User as UserIcon, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { streamChat, type MemoryRecord } from '@/lib/stream-chat';
import { supabase } from '@/integrations/supabase/client';
import { MemoryIndicator } from '@/components/chat/MemoryIndicator';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  memories?: MemoryRecord[];
  referencedMemoryIds?: string[];
}

// Extract <!-- memory:MEM-uuid --> references from AI response
function extractMemoryReferences(content: string): string[] {
  const regex = /<!-- memory:MEM-([a-f0-9-]+) -->/g;
  const ids: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

// Strip memory comment tags from display content
function stripMemoryTags(content: string): string {
  return content.replace(/<!-- memory:MEM-[a-f0-9-]+ -->/g, '').trim();
}

export default function Chat() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Track memories for the current streaming message
  const pendingMemoriesRef = useRef<MemoryRecord[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDeleteMemory = useCallback(async (memory: MemoryRecord) => {
    if (memory.scope !== 'personal') return;
    const { error } = await supabase.from('user_memories').delete().eq('id', memory.id);
    if (error) {
      toast({ title: 'Delete failed', description: 'Could not delete memory.', variant: 'destructive' });
    } else {
      toast({ title: 'Memory deleted' });
      // Remove from all messages
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          memories: m.memories?.filter((mem) => mem.id !== memory.id),
        }))
      );
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const assistantId = crypto.randomUUID();
    let assistantContent = '';
    pendingMemoriesRef.current = [];

    const controller = new AbortController();
    abortRef.current = controller;

    await streamChat({
      message: userMessage.content,
      conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
      accessToken: session?.access_token,
      signal: controller.signal,
      onMemories: (memories) => {
        pendingMemoriesRef.current = memories;
      },
      onDelta: (chunk) => {
        assistantContent += chunk;
        const referencedMemoryIds = extractMemoryReferences(assistantContent);

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          const msgData: Message = {
            id: assistantId,
            role: 'assistant',
            content: assistantContent,
            memories: pendingMemoriesRef.current,
            referencedMemoryIds,
          };
          if (last?.role === 'assistant' && last.id === assistantId) {
            return prev.map((m) => (m.id === assistantId ? msgData : m));
          }
          return [...prev, msgData];
        });
      },
      onDone: () => {
        // Final pass to extract all referenced IDs
        const finalIds = extractMemoryReferences(assistantContent);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: assistantContent, referencedMemoryIds: finalIds }
              : m
          )
        );
        setLoading(false);
        abortRef.current = null;
      },
      onError: (error) => {
        setLoading(false);
        abortRef.current = null;
        toast({ title: 'Error', description: error, variant: 'destructive' });
      },
    });
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
    abortRef.current = null;
  };

  const handleNewChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ChatSidebar onNewChat={handleNewChat} />

      <main className="flex-1 flex flex-col md:ml-64">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center h-full min-h-[60vh]">
                <div className="text-center max-w-md">
                  <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Ask your sign industry question</h2>
                  <p className="text-muted-foreground">
                    Get answers about materials and signage — informed by your saved knowledge.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-4 py-3',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <>
                          <div className="prose prose-sm dark:prose-invert max-w-none text-secondary-foreground">
                            <ReactMarkdown>{stripMemoryTags(message.content)}</ReactMarkdown>
                          </div>
                          {message.memories && message.memories.length > 0 && (
                            <MemoryIndicator
                              memories={message.memories}
                              referencedIds={message.referencedMemoryIds || []}
                              onDelete={handleDeleteMemory}
                            />
                          )}
                        </>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-secondary rounded-lg px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your sign industry question..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                disabled={loading}
              />
              {loading ? (
                <Button type="button" variant="outline" onClick={handleStop} size="icon">
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>
            <p className="text-xs text-muted-foreground text-center mt-3">
              SignMaker.ai provides general guidance — always verify codes with local authorities.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
