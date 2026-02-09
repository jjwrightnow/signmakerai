import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Pencil, Trash2, Building2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MemoryRecord } from '@/lib/stream-chat';

interface MemoryIndicatorProps {
  memories: MemoryRecord[];
  referencedIds: string[];
  onEdit?: (memory: MemoryRecord) => void;
  onDelete?: (memory: MemoryRecord) => void;
}

export function MemoryIndicator({ memories, referencedIds, onEdit, onDelete }: MemoryIndicatorProps) {
  const [open, setOpen] = useState(false);

  // Show only memories that were actually referenced, or all if none specifically referenced
  const relevantMemories = referencedIds.length > 0
    ? memories.filter((m) => referencedIds.includes(m.id))
    : [];

  // If no specific memories were referenced, show the indicator but with general context
  const displayMemories = relevantMemories.length > 0 ? relevantMemories : memories;
  const wasReferenced = relevantMemories.length > 0;

  if (memories.length === 0) return null;

  const personalCount = displayMemories.filter((m) => m.scope === 'personal').length;
  const companyCount = displayMemories.filter((m) => m.scope === 'company').length;

  const label = wasReferenced
    ? `${displayMemories.length} saved ${displayMemories.length === 1 ? 'memory' : 'memories'} informed this response`
    : `${memories.length} ${memories.length === 1 ? 'memory' : 'memories'} available as context`;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 group">
          <BookOpen className="h-3 w-3" />
          <span>{label}</span>
          {open ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {displayMemories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {!wasReferenced && memories.length > 0 && (
          <p className="text-[11px] text-muted-foreground italic px-1">
            These memories were available but not directly cited.
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function MemoryCard({
  memory,
  onEdit,
  onDelete,
}: {
  memory: MemoryRecord;
  onEdit?: (memory: MemoryRecord) => void;
  onDelete?: (memory: MemoryRecord) => void;
}) {
  const isPersonal = memory.scope === 'personal';
  const confidenceColor = {
    strict: 'text-destructive',
    standard: 'text-primary',
    tentative: 'text-muted-foreground',
  }[memory.confidence] || 'text-muted-foreground';

  return (
    <div className="rounded-md border border-border bg-card p-2.5 text-xs space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-foreground leading-relaxed flex-1">{memory.content}</p>
        {isPersonal && (
          <div className="flex items-center gap-0.5 shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onEdit(memory)}
                title="Edit memory"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(memory)}
                title="Delete memory"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
      <Separator className="bg-border" />
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] h-5 gap-1 font-normal">
          {isPersonal ? <UserIcon className="h-2.5 w-2.5" /> : <Building2 className="h-2.5 w-2.5" />}
          {isPersonal ? 'Personal' : 'Company'}
        </Badge>
        <Badge variant="outline" className="text-[10px] h-5 font-normal">
          {memory.memory_type.replace(/_/g, ' ')}
        </Badge>
        <span className={`text-[10px] font-medium ${confidenceColor}`}>
          {memory.confidence}
        </span>
      </div>
    </div>
  );
}
