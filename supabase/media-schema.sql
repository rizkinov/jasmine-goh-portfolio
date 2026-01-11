-- =============================================
-- Media Storage Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Create media table to track uploaded files
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on media"
  ON media FOR SELECT
  USING (true);

-- Authenticated user policies
CREATE POLICY "Allow authenticated users to insert media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete media"
  ON media FOR DELETE
  TO authenticated
  USING (true);

-- Updated at trigger
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Storage Bucket Setup (run in SQL or via Dashboard)
-- =============================================
-- Go to Supabase Dashboard > Storage > Create new bucket
-- Name: "media"
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
