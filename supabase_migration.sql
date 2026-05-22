-- Supabase Migration: Add Analytics Columns to Articles

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS saves_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count integer DEFAULT 0;

-- Optional: Create an RPC function for atomic increments (safer than doing it client-side)
-- We will use this in the future if high traffic causes race conditions.
CREATE OR REPLACE FUNCTION increment_interaction(article_id UUID, column_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF column_name = 'likes_count' THEN
    UPDATE public.articles SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = article_id;
  ELSIF column_name = 'saves_count' THEN
    UPDATE public.articles SET saves_count = COALESCE(saves_count, 0) + 1 WHERE id = article_id;
  ELSIF column_name = 'shares_count' THEN
    UPDATE public.articles SET shares_count = COALESCE(shares_count, 0) + 1 WHERE id = article_id;
  END IF;
END;
$$;
