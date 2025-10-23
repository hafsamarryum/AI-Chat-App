-- Create table for user messages
CREATE TABLE IF NOT EXISTS public.user_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for assistant responses
CREATE TABLE IF NOT EXISTS public.assistant_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message_id UUID REFERENCES public.user_messages(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_responses ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Users can view their own messages"
  ON public.user_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON public.user_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update or delete their own last message"
  ON public.user_messages FOR UPDATE USING (
    auth.uid() = user_id
    AND id = (
      SELECT id FROM public.user_messages
      WHERE user_id = auth.uid()
      ORDER BY created_at DESC
      LIMIT 1
    )
  )
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own last message"
  ON public.user_messages FOR DELETE USING (
    auth.uid() = user_id
    AND id = (
      SELECT id FROM public.user_messages
      WHERE user_id = auth.uid()
      ORDER BY created_at DESC
      LIMIT 1
    )
  );

CREATE POLICY "Users can view their own responses"
  ON public.assistant_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON public.assistant_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
