-- ============================================
-- Migration: Rename card_templates to card_visuals
-- ============================================
-- This migration renames the card_templates table to card_visuals
-- to clarify the concept separation:
-- - CardVisual: Content (artist image, song title) stored in DB
-- - FrameTemplate: Frame/effects defined in TypeScript config
-- ============================================

-- 1. Rename the table
ALTER TABLE public.card_templates RENAME TO card_visuals;

-- 2. Rename the foreign key column in cards table
ALTER TABLE public.cards RENAME COLUMN template_id TO visual_id;

-- 3. Rename indexes
ALTER INDEX idx_card_templates_artist RENAME TO idx_card_visuals_artist;
ALTER INDEX idx_cards_template RENAME TO idx_cards_visual;

-- 4. Update the unique constraint name (if exists)
-- Note: PostgreSQL automatically renames constraints when table is renamed,
-- but we explicitly rename for clarity
ALTER TABLE public.cards
  DROP CONSTRAINT IF EXISTS unique_template_rarity;
ALTER TABLE public.cards
  ADD CONSTRAINT unique_visual_rarity UNIQUE (visual_id, rarity);

-- 5. Update RLS policies (need to drop and recreate with new names)
DROP POLICY IF EXISTS "Card templates are viewable by everyone" ON public.card_visuals;
CREATE POLICY "Card visuals are viewable by everyone"
  ON public.card_visuals FOR SELECT USING (true);

-- 6. Add comment for documentation
COMMENT ON TABLE public.card_visuals IS 'Card visual content (artist image, song title) - managed via admin. Frame templates are defined in TypeScript config.';
COMMENT ON COLUMN public.cards.visual_id IS 'Reference to card_visuals table (visual content, not frame template)';
