-- HITOON Storage Migration
-- Description: Create images bucket and RLS policies for file uploads

-- ============================================
-- STORAGE BUCKET
-- ============================================

-- Create images bucket (public for read access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  TRUE,  -- public bucket (publicly readable)
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================
-- Note: RLS is already enabled on storage.objects by Supabase

-- Public read access for images bucket
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Operators can upload images
CREATE POLICY "Operators can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.operators
    WHERE user_id = auth.uid()
  )
);

-- Operators can update their uploaded images
CREATE POLICY "Operators can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.operators
    WHERE user_id = auth.uid()
  )
);

-- Operators can delete images
CREATE POLICY "Operators can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.operators
    WHERE user_id = auth.uid()
  )
);
