export interface MemoryRecord {
  id: string;
  content: string;
  memory_type: string;
  confidence: string;
  tags: string[];
  scope: 'personal' | 'company';
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface StreamChatOptions {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  accessToken?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
  onMemories?: (memories: MemoryRecord[]) => void;
  signal?: AbortSignal;
}

export async function streamChat({
  message,
  conversationHistory,
  accessToken,
  onDelta,
  onDone,
  onError,
  onMemories,
  signal,
}: StreamChatOptions) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let resp: Response;
  try {
    resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, conversationHistory }),
      signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
    onError('Network error. Please check your connection.');
    return;
  }

  if (!resp.ok) {
    try {
      const errorData = await resp.json();
      onError(errorData.error || `Request failed (${resp.status})`);
    } catch {
      onError(`Request failed (${resp.status})`);
    }
    return;
  }

  if (!resp.body) {
    onError('No response body received.');
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = '';
  let streamDone = false;

  const processLine = (line: string): boolean => {
    if (line.endsWith('\r')) line = line.slice(0, -1);
    if (line.startsWith(':') || line.trim() === '') return false;
    if (!line.startsWith('data: ')) return false;

    const jsonStr = line.slice(6).trim();
    if (jsonStr === '[DONE]') return true; // signal done

    try {
      const parsed = JSON.parse(jsonStr);

      // Check for our custom memory metadata event
      if (parsed.type === 'memory_context' && parsed.memories) {
        onMemories?.(parsed.memories);
        return false;
      }

      // Standard SSE delta
      const content = parsed.choices?.[0]?.delta?.content as string | undefined;
      if (content) onDelta(content);
    } catch {
      // Re-buffer incomplete JSON
      textBuffer = line + '\n' + textBuffer;
    }
    return false;
  };

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
      const line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (processLine(line)) {
        streamDone = true;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (const raw of textBuffer.split('\n')) {
      if (raw) processLine(raw);
    }
  }

  onDone();
}
