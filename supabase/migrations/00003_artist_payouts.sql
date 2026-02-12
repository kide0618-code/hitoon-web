-- Artist Payouts table
-- Tracks monthly payout status and notes for each artist
CREATE TABLE public.artist_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL,           -- 1-12
  payout_status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,                    -- 請求情報・担当者・配分など
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_payout_status CHECK (payout_status IN ('pending', 'transferred', 'confirmed')),
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12),
  CONSTRAINT valid_year CHECK (year >= 2020),
  CONSTRAINT unique_artist_month UNIQUE (artist_id, year, month)
);

-- Add operator-only note column to artists table
ALTER TABLE public.artists ADD COLUMN note TEXT;

-- Indexes
CREATE INDEX idx_artist_payouts_artist ON public.artist_payouts(artist_id);
CREATE INDEX idx_artist_payouts_year_month ON public.artist_payouts(year, month);

-- Enable RLS
ALTER TABLE public.artist_payouts ENABLE ROW LEVEL SECURITY;

-- Only operators can read/write payouts
CREATE POLICY "Operators can view payouts"
  ON public.artist_payouts FOR SELECT USING (public.is_operator());

CREATE POLICY "Operators can insert payouts"
  ON public.artist_payouts FOR INSERT WITH CHECK (public.is_operator());

CREATE POLICY "Operators can update payouts"
  ON public.artist_payouts FOR UPDATE USING (public.is_operator());

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_artist_payouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artist_payouts_updated_at
  BEFORE UPDATE ON public.artist_payouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_artist_payouts_updated_at();
