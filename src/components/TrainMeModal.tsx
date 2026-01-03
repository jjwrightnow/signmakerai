import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, Check, Edit3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrainMeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExtractedNote {
  content: string;
  type: string;
  tags: string[];
}

export function TrainMeModal({ open, onOpenChange }: TrainMeModalProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'review' | 'saving'>('input');
  const [input, setInput] = useState('');
  const [extractedNotes, setExtractedNotes] = useState<ExtractedNote[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!session) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to save knowledge.',
        variant: 'destructive',
      });
      return;
    }

    if (!input.trim()) {
      toast({
        title: 'Enter some knowledge',
        description: 'Please share what you\'ve learned.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/train-me`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'extract', input }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to extract notes');
      }

      const data = await response.json();
      setExtractedNotes(data.notes || [{ content: input, type: 'general', tags: [] }]);
      setStep('review');
    } catch (error) {
      console.error('Extract error:', error);
      toast({
        title: 'Extraction failed',
        description: 'Could not process your knowledge. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session) return;

    setStep('saving');
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-notes`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notes: extractedNotes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      toast({
        title: 'Knowledge saved!',
        description: 'Your insights have been stored successfully.',
      });
      
      handleClose();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save your knowledge. Please try again.',
        variant: 'destructive',
      });
      setStep('review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setInput('');
    setExtractedNotes([]);
    setEditingIndex(null);
    onOpenChange(false);
  };

  const updateNote = (index: number, content: string) => {
    setExtractedNotes(prev => 
      prev.map((note, i) => i === index ? { ...note, content } : note)
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            Train Me
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'input' && "What's something you've learned the hard way about signs?"}
            {step === 'review' && "Review and edit your extracted knowledge."}
            {step === 'saving' && "Saving your knowledge..."}
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="For example: Never install channel letters below 40°F — the acrylic faces become too brittle and crack during handling. Always let materials acclimate to room temperature overnight first."
              className="min-h-[150px] bg-secondary border-border"
            />
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {extractedNotes.map((note, index) => (
              <div key={index} className="p-3 bg-secondary rounded-lg border border-border">
                {editingIndex === index ? (
                  <Textarea
                    value={note.content}
                    onChange={(e) => updateNote(index, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    autoFocus
                    className="min-h-[80px] bg-muted border-border"
                  />
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground">{note.content}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIndex(index)}
                      className="shrink-0"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                    {note.type}
                  </span>
                  {note.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'saving' && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          {step === 'input' && (
            <Button onClick={handleExtract} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Extract Notes
            </Button>
          )}
          {step === 'review' && (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Save Knowledge
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
