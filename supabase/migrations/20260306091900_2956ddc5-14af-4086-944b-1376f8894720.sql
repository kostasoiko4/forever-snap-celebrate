
-- Create rsvps table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL DEFAULT true,
  guest_count INTEGER NOT NULL DEFAULT 1,
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow anonymous inserts (public wedding form, no auth needed)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert rsvps"
  ON public.rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read rsvps"
  ON public.rsvps FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create wedding-photos storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true);

-- Allow public read access to wedding photos
CREATE POLICY "Public read access for wedding photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'wedding-photos');
