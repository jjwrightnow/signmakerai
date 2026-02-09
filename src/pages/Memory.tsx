import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MEMORY_TYPES, CONFIDENCE_LEVELS } from '@/components/train-me/types';
import {
  Loader2,
  Edit3,
  Trash2,
  Check,
  X,
  Brain,
  Calendar,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Memory {
  id: string;
  content: string;
  memory_type: string;
  confidence: string;
  memory_scope: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const confidenceIcon = {
  tentative: Shield,
  standard: ShieldCheck,
  strict: ShieldAlert,
};

export default function Memory() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, [session]);

  const fetchMemories = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('user_memories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Fetch memories error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load memories.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditContent(memory.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (memoryId: string) => {
    if (!session) return;
    setActionLoading(true);

    try {
      const { error } = await supabase
        .from('user_memories')
        .update({ content: editContent })
        .eq('id', memoryId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setMemories((prev) =>
        prev.map((m) => (m.id === memoryId ? { ...m, content: editContent } : m))
      );
      setEditingId(null);
      setEditContent('');

      toast({ title: 'Memory updated' });
    } catch (error) {
      console.error('Update memory error:', error);
      toast({ title: 'Error', description: 'Failed to update memory.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMemory = async () => {
    if (!session || !deleteId) return;
    setActionLoading(true);

    try {
      const { error } = await supabase
        .from('user_memories')
        .delete()
        .eq('id', deleteId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setMemories((prev) => prev.filter((m) => m.id !== deleteId));
      toast({ title: 'Memory deleted' });
    } catch (error) {
      console.error('Delete memory error:', error);
      toast({ title: 'Error', description: 'Failed to delete memory.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeLabel = (type: string) =>
    MEMORY_TYPES.find((t) => t.value === type)?.label ?? type.replace(/_/g, ' ');

  const getConfidenceLabel = (conf: string) =>
    CONFIDENCE_LEVELS.find((c) => c.value === conf)?.label ?? conf;

  const ConfIcon = (conf: string) => confidenceIcon[conf as keyof typeof confidenceIcon] || Shield;

  return (
    <div className="flex min-h-screen bg-background">
      <ChatSidebar />

      <main className="flex-1 p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">My Memory</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Your saved decisions, preferences, and rules. The AI references these when answering your questions.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : memories.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No memories yet</p>
                <p className="text-sm text-muted-foreground">
                  Use "Train Me" to save your sign industry knowledge.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {memories.map((memory) => {
                const Icon = ConfIcon(memory.confidence);
                return (
                  <Card key={memory.id} className="bg-card border-border">
                    <CardContent className="pt-6">
                      {editingId === memory.id ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] bg-secondary border-border"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEdit(memory.id)} disabled={actionLoading}>
                              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              <span className="ml-2">Save</span>
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit} disabled={actionLoading}>
                              <X className="h-4 w-4" />
                              <span className="ml-2">Cancel</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-foreground mb-4">{memory.content}</p>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="outline" className="text-xs font-normal gap-1">
                                {getTypeLabel(memory.memory_type)}
                              </Badge>
                              <Badge variant="outline" className="text-xs font-normal gap-1">
                                <Icon className="h-3 w-3" />
                                {getConfidenceLabel(memory.confidence)}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(memory.updated_at)}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => startEdit(memory)}>
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteId(memory.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Memory</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this memory? The AI will no longer reference it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteMemory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
