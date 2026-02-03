-- HITOON Cart Schema Migration
-- Version: 1.0.0
-- Description: Shopping cart table for Amazon-like cart functionality

-- ============================================
-- CARTS (Shopping cart items)
-- ============================================
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_card UNIQUE (user_id, card_id),
  CONSTRAINT valid_quantity CHECK (quantity >= 1 AND quantity <= 10)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_carts_user ON public.carts(user_id);
CREATE INDEX idx_carts_card ON public.carts(card_id);
CREATE INDEX idx_carts_added_at ON public.carts(added_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own cart items
CREATE POLICY "Users can view own cart"
  ON public.carts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON public.carts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON public.carts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON public.carts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to clear user's cart (used after successful checkout)
CREATE OR REPLACE FUNCTION public.clear_user_cart(p_user_id UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM public.carts WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to merge guest cart into user cart (used after login)
-- Takes JSON array of {card_id, quantity} objects
CREATE OR REPLACE FUNCTION public.merge_cart(
  p_user_id UUID,
  p_items JSONB
) RETURNS void AS $$
DECLARE
  item JSONB;
  v_card_id UUID;
  v_quantity INT;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_card_id := (item->>'card_id')::UUID;
    v_quantity := COALESCE((item->>'quantity')::INT, 1);

    -- Clamp quantity to valid range
    v_quantity := GREATEST(1, LEAST(10, v_quantity));

    -- Upsert cart item (add quantities if exists, cap at 10)
    INSERT INTO public.carts (user_id, card_id, quantity)
    VALUES (p_user_id, v_card_id, v_quantity)
    ON CONFLICT (user_id, card_id) DO UPDATE
    SET quantity = LEAST(10, public.carts.quantity + EXCLUDED.quantity),
        added_at = NOW();
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
