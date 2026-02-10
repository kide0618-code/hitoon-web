-- HITOON Initial Schema Migration
-- Version: 1.0.0
-- Description: Core tables for artist trading card marketplace

-- ============================================
-- PROFILES (User extension for auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update email_verified when confirmed
CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.profiles
    SET email_verified = TRUE, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_verified();

-- ============================================
-- OPERATORS (Admin users)
-- ============================================
CREATE TABLE public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_operator_user UNIQUE (user_id),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'super_admin'))
);

-- Helper function: Check if current user is operator
CREATE OR REPLACE FUNCTION public.is_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.operators
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ARTISTS
-- ============================================
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  member_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CARD TEMPLATES
-- ============================================
CREATE TABLE public.card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  artist_image_url TEXT NOT NULL,
  song_title TEXT,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CARDS (3 per template: NORMAL, RARE, SUPER_RARE)
-- ============================================
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.card_templates(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL DEFAULT 'NORMAL',
  price INT NOT NULL,
  total_supply INT, -- NULL = unlimited
  current_supply INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_rarity CHECK (rarity IN ('NORMAL', 'RARE', 'SUPER_RARE')),
  CONSTRAINT unique_template_rarity UNIQUE (template_id, rarity),
  CONSTRAINT valid_price CHECK (price > 0),
  CONSTRAINT valid_supply CHECK (current_supply >= 0)
);

-- ============================================
-- EXCLUSIVE CONTENTS (per card/rarity)
-- ============================================
CREATE TABLE public.exclusive_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('video', 'music', 'image'))
);

-- ============================================
-- PURCHASES
-- ============================================
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  serial_number INT NOT NULL,
  price_paid INT NOT NULL,
  quantity_in_order INT DEFAULT 1,
  stripe_checkout_session_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'refunded')),
  CONSTRAINT valid_price_paid CHECK (price_paid >= 0)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_email_verified ON public.profiles(email_verified);
CREATE INDEX idx_operators_user ON public.operators(user_id);
CREATE INDEX idx_artists_featured ON public.artists(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_artists_display_order ON public.artists(display_order) WHERE is_featured = TRUE;
CREATE INDEX idx_card_templates_artist ON public.card_templates(artist_id);
CREATE INDEX idx_card_templates_active ON public.card_templates(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_cards_template ON public.cards(template_id);
CREATE INDEX idx_cards_artist ON public.cards(artist_id);
CREATE INDEX idx_cards_rarity ON public.cards(rarity);
CREATE INDEX idx_cards_active ON public.cards(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_exclusive_contents_card ON public.exclusive_contents(card_id);
CREATE INDEX idx_purchases_user ON public.purchases(user_id);
CREATE INDEX idx_purchases_card ON public.purchases(card_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
CREATE INDEX idx_purchases_purchased_at ON public.purchases(purchased_at DESC);
CREATE INDEX idx_purchases_session ON public.purchases(stripe_checkout_session_id);

-- Idempotency constraint for webhook handling
CREATE UNIQUE INDEX idx_purchases_idempotency
  ON public.purchases(stripe_checkout_session_id, card_id, serial_number)
  WHERE status = 'completed';

-- ============================================
-- ATOMIC SERIAL NUMBER INCREMENT FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_card_supply(
  p_card_id UUID,
  p_quantity INT
) RETURNS TABLE(new_supply INT, old_supply INT, card_price INT) AS $$
DECLARE
  v_old_supply INT;
  v_new_supply INT;
  v_price INT;
BEGIN
  -- Lock row and get current values
  SELECT current_supply, price INTO v_old_supply, v_price
  FROM public.cards
  WHERE id = p_card_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found: %', p_card_id;
  END IF;

  v_new_supply := v_old_supply + p_quantity;

  -- Update supply
  UPDATE public.cards
  SET current_supply = v_new_supply,
      updated_at = NOW()
  WHERE id = p_card_id;

  RETURN QUERY SELECT v_new_supply, v_old_supply, v_price;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MEMBER COUNT UPDATE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_artist_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    -- Check if this is the user's first purchase for this artist
    IF NOT EXISTS (
      SELECT 1 FROM public.purchases p
      JOIN public.cards c ON p.card_id = c.id
      WHERE p.user_id = NEW.user_id
        AND c.artist_id = (SELECT artist_id FROM public.cards WHERE id = NEW.card_id)
        AND p.id != NEW.id
        AND p.status = 'completed'
    ) THEN
      UPDATE public.artists
      SET member_count = member_count + 1,
          updated_at = NOW()
      WHERE id = (SELECT artist_id FROM public.cards WHERE id = NEW.card_id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_purchase_completed
  AFTER INSERT ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_artist_member_count();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exclusive_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self-update
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Operators: Self-read only
CREATE POLICY "Operators can view own record"
  ON public.operators FOR SELECT USING (auth.uid() = user_id);

-- Artists: Public read
CREATE POLICY "Artists are viewable by everyone"
  ON public.artists FOR SELECT USING (true);

-- Card Templates: Public read (active only for non-admins)
CREATE POLICY "Card templates are viewable by everyone"
  ON public.card_templates FOR SELECT USING (
    is_active = true OR public.is_operator()
  );

-- Cards: Public read (active only for non-admins)
CREATE POLICY "Cards are viewable by everyone"
  ON public.cards FOR SELECT USING (
    is_active = true OR public.is_operator()
  );

-- Exclusive Contents: Owners only
CREATE POLICY "Buyers can view exclusive content"
  ON public.exclusive_contents FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.purchases
      WHERE purchases.card_id = exclusive_contents.card_id
        AND purchases.user_id = auth.uid()
        AND purchases.status = 'completed'
    )
    OR public.is_operator()
  );

-- Purchases: Self-read only
CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT USING (
    auth.uid() = user_id OR public.is_operator()
  );

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_card_templates_updated_at
  BEFORE UPDATE ON public.card_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
