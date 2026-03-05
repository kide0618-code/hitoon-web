-- Artist Social Links table
-- Stores social media links for each artist
-- SNS platforms: 1 artist per platform. Website: multiple allowed.
CREATE TABLE public.artist_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_platform CHECK (platform IN (
    'spotify', 'youtube', 'twitter', 'instagram', 'tiktok', 'website', 'apple_music', 'line'
  ))
);

-- Unique constraint: 1 artist per platform, except website (multiple allowed)
CREATE UNIQUE INDEX unique_artist_platform_non_website
  ON public.artist_social_links(artist_id, platform)
  WHERE platform != 'website';

-- Index for fast lookup by artist
CREATE INDEX idx_artist_social_links_artist ON public.artist_social_links(artist_id);

-- Enable RLS
ALTER TABLE public.artist_social_links ENABLE ROW LEVEL SECURITY;

-- Social links are publicly viewable
CREATE POLICY "Social links are viewable by everyone"
  ON public.artist_social_links FOR SELECT USING (true);
