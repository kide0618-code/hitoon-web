-- Migration: Remove card_visuals table, move content fields to cards
-- Cards now own their own image/song content directly + frame_template_id

-- 1. Add new columns to cards
ALTER TABLE public.cards
  ADD COLUMN card_image_url TEXT,
  ADD COLUMN song_title TEXT,
  ADD COLUMN subtitle TEXT,
  ADD COLUMN frame_template_id TEXT NOT NULL DEFAULT 'classic-normal';

-- 2. Migrate data from card_visuals
UPDATE public.cards c SET
  card_image_url = cv.artist_image_url,
  song_title = cv.song_title,
  subtitle = cv.subtitle
FROM public.card_visuals cv WHERE c.visual_id = cv.id;

-- 3. Set frame_template_id by rarity
UPDATE public.cards SET frame_template_id = 'classic-normal' WHERE rarity = 'NORMAL';
UPDATE public.cards SET frame_template_id = 'classic-rare' WHERE rarity = 'RARE';
UPDATE public.cards SET frame_template_id = 'classic-super-rare' WHERE rarity = 'SUPER_RARE';

-- 4. Make card_image_url NOT NULL after migration
ALTER TABLE public.cards ALTER COLUMN card_image_url SET NOT NULL;

-- 5. Drop visual constraints and columns
ALTER TABLE public.cards DROP CONSTRAINT IF EXISTS unique_visual_rarity;
ALTER TABLE public.cards DROP COLUMN visual_id;

-- 6. Drop card_visuals table and related objects
DROP TABLE public.card_visuals;

-- 7. Add new index
CREATE INDEX idx_cards_frame_template ON public.cards(frame_template_id);
