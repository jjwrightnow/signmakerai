import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MemoryForm } from './train-me/MemoryForm';
import { SuccessStep } from './train-me/SuccessStep';
import type { MemoryFormData } from './train-me/types';

interface TrainMeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_FORM: MemoryFormData = {
  content: '',
  memory_type: 'rule_of_thumb',
  confidence: 'standard',
  tags: [],
};

export function TrainMeModal({ open, onOpenChange }: TrainMeModalProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'saving' | 'success'>('input');
  const [formData, setFormData] = useState<MemoryFormData>({ ...DEFAULT_FORM });
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [promoted, setPromoted] = useState(false);

  const handleSave = async () => {
    if (!session) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to save knowledge.', variant: 'destructive' });
      return;
    }
    if (!formData.content.trim()) {
      toast({ title: 'Enter some knowledge', description: 'Please share what you have learned.', variant: 'destructive' });
      return;
    }

    setStep('saving');
    setLoading(true);

    try {
      const { error } = await supabase.from('user_memories').insert({
        user_id: session.user.id,
        content: formData.content.trim(),
        memory_type: formData.memory_type,
        confidence: formData.confidence,
        memory_scope: 'personal',
        tags: formData.tags,
      });

      if (error) throw error;

      setStep('success');
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: 'Save failed', description: 'Could not save your knowledge. Please try again.', variant: 'destructive' });
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async () => {
    if (!session) return;

    setPromoting(true);
    try {
      // Get user's company membership
      const { data: membership, error: memberError } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle();

      if (memberError) throw memberError;

      if (!membership) {
        toast({ title: 'No company found', description: 'You need to be part of a company to share knowledge.', variant: 'destructive' });
        setPromoting(false);
        return;
      }

      const { error } = await supabase.from('company_knowledge').insert({
        company_id: membership.company_id,
        submitted_by: session.user.id,
        content: formData.content.trim(),
        memory_type: formData.memory_type,
        tags: formData.tags,
        status: 'pending',
      });

      if (error) throw error;

      setPromoted(true);
      toast({ title: 'Submitted for review', description: 'An admin will review your knowledge submission.' });
    } catch (error) {
      console.error('Promote error:', error);
      toast({ title: 'Submission failed', description: 'Could not submit to company knowledge.', variant: 'destructive' });
    } finally {
      setPromoting(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setFormData({ ...DEFAULT_FORM });
    setPromoting(false);
    setPromoted(false);
    onOpenChange(false);
  };

  const isFormValid = formData.content.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            {step === 'success' ? 'Knowledge Saved' : 'Train Me'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'input' && 'Capture a decision, rule, or lesson from your sign work.'}
            {step === 'saving' && 'Saving your knowledge...'}
            {step === 'success' && 'Your memory has been stored.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && (
          <MemoryForm data={formData} onChange={setFormData} />
        )}

        {step === 'saving' && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {step === 'success' && (
          <SuccessStep
            data={formData}
            onPromote={handlePromote}
            onClose={handleClose}
            promoting={promoting}
            promoted={promoted}
          />
        )}

        <DialogFooter>
          {step === 'input' && (
            <>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading || !isFormValid}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                Save Memory
              </Button>
            </>
          )}
          {step === 'success' && (
            <Button onClick={handleClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
