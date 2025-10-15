-- Create conversation_history table
CREATE TABLE IF NOT EXISTS public.conversation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pirate_chat', 'chat_translation', 'live_call')),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation_messages table
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversation_history(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  translated_text TEXT,
  source_lang TEXT,
  target_lang TEXT,
  role TEXT CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_history
CREATE POLICY "Users can view their own conversations"
  ON public.conversation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.conversation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.conversation_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.conversation_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for conversation_messages
CREATE POLICY "Users can view messages from their conversations"
  ON public.conversation_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_history
      WHERE id = conversation_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.conversation_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversation_history
      WHERE id = conversation_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their conversations"
  ON public.conversation_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_history
      WHERE id = conversation_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_conversation_history_user_id ON public.conversation_history(user_id);
CREATE INDEX idx_conversation_history_type ON public.conversation_history(type);
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);

-- Add trigger for automatic timestamp updates on conversation_history
CREATE TRIGGER update_conversation_history_updated_at
  BEFORE UPDATE ON public.conversation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();