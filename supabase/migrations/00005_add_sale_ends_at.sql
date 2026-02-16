-- Add sale deadline column to cards
-- NULL = unlimited (no deadline), default behavior
ALTER TABLE public.cards ADD COLUMN sale_ends_at TIMESTAMPTZ DEFAULT NULL;
