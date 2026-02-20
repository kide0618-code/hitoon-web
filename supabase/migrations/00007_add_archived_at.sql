-- Add archived_at column to artists, cards, and exclusive_contents tables for soft delete

-- ============================================
-- ARTISTS: archived_at (contract termination)
-- ============================================
ALTER TABLE public.artists ADD COLUMN archived_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX idx_artists_archived ON public.artists(archived_at) WHERE archived_at IS NULL;

-- Update RLS: regular users only see non-archived artists, operators see all
DROP POLICY "Artists are viewable by everyone" ON public.artists;

CREATE POLICY "Active artists are viewable by everyone"
  ON public.artists FOR SELECT USING (
    archived_at IS NULL OR public.is_operator()
  );

-- ============================================
-- CARDS: archived_at
-- ============================================
ALTER TABLE public.cards ADD COLUMN archived_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX idx_cards_archived ON public.cards(archived_at) WHERE archived_at IS NULL;

-- Update RLS: add archived_at check alongside is_active
DROP POLICY "Cards are viewable by everyone" ON public.cards;

CREATE POLICY "Cards are viewable by everyone"
  ON public.cards FOR SELECT USING (
    (is_active = true AND archived_at IS NULL) OR public.is_operator()
  );

-- ============================================
-- EXCLUSIVE_CONTENTS: archived_at
-- ============================================
ALTER TABLE public.exclusive_contents ADD COLUMN archived_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX idx_exclusive_contents_archived ON public.exclusive_contents(archived_at) WHERE archived_at IS NULL;

-- Update RLS: buyers see non-archived content, operators see all
DROP POLICY "Buyers can view exclusive content" ON public.exclusive_contents;

CREATE POLICY "Buyers can view exclusive content"
  ON public.exclusive_contents FOR SELECT USING (
    (
      archived_at IS NULL
      AND EXISTS (
        SELECT 1 FROM public.purchases
        WHERE purchases.card_id = exclusive_contents.card_id
          AND purchases.user_id = auth.uid()
          AND purchases.status = 'completed'
      )
    )
    OR public.is_operator()
  );
