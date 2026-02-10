-- Add max_purchase_per_user column to cards table
-- This allows setting a limit on how many cards a single user can purchase
-- NULL means no limit (unlimited purchases allowed)

ALTER TABLE public.cards
ADD COLUMN max_purchase_per_user INT DEFAULT NULL;

-- Add a constraint to ensure the value is positive when set
ALTER TABLE public.cards
ADD CONSTRAINT valid_max_purchase_per_user
CHECK (max_purchase_per_user IS NULL OR max_purchase_per_user > 0);

-- Comment for documentation
COMMENT ON COLUMN public.cards.max_purchase_per_user IS 'Maximum number of this card a single user can purchase. NULL means unlimited.';
