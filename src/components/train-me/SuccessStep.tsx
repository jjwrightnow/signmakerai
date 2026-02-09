import { Check, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type MemoryFormData, MEMORY_TYPES, CONFIDENCE_LEVELS } from './types';

interface SuccessStepProps {
  data: MemoryFormData;
  onPromote: () => void;
  onClose: () => void;
  promoting: boolean;
  promoted: boolean;
}

export function SuccessStep({ data, onPromote, onClose, promoting, promoted }: SuccessStepProps) {
  const typeLabel = MEMORY_TYPES.find((t) => t.value === data.memory_type)?.label ?? data.memory_type;
  const confLabel = CONFIDENCE_LEVELS.find((c) => c.value === data.confidence)?.label ?? data.confidence;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
        <Check className="h-6 w-6 text-primary shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Memory saved</p>
          <p className="text-xs text-muted-foreground">
            {typeLabel} · {confLabel} confidence
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 italic">
        "{data.content}"
      </p>

      {!promoted && (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <p className="text-sm text-foreground font-medium">Share with your team?</p>
          <p className="text-xs text-muted-foreground">
            Promote this memory to company knowledge. An admin will review it before it's shared.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onPromote}
            disabled={promoting}
            className="gap-2"
          >
            <ArrowUpCircle className="h-4 w-4" />
            {promoting ? 'Submitting…' : 'Suggest to Company'}
          </Button>
        </div>
      )}

      {promoted && (
        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
          <Check className="h-4 w-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            Submitted for admin review
          </p>
        </div>
      )}
    </div>
  );
}
