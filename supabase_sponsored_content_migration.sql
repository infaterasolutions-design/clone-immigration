-- Supabase Migration: Create Sponsored Content Table

CREATE TABLE IF NOT EXISTS public.sponsored_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  sponsor_name TEXT NOT NULL,
  description TEXT,
  destination_url TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Optional: Enable Row Level Security (RLS) but allow public read access
ALTER TABLE public.sponsored_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sponsored content"
ON public.sponsored_content FOR SELECT
USING (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Allow authenticated full access to sponsored content"
ON public.sponsored_content FOR ALL
USING (auth.role() = 'authenticated');
