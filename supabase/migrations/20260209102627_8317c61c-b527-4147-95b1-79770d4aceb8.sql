-- Messages should be immutable (no editing), but users should be able to delete
-- their own messages within their own conversations.

-- Explicit DELETE policy for messages
CREATE POLICY "Users can delete messages in own conversations"
  ON public.messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id AND user_id = auth.uid()
    )
  );
