-- Add 'text' type to exclusive_contents and make url nullable
ALTER TABLE public.exclusive_contents DROP CONSTRAINT valid_type;
ALTER TABLE public.exclusive_contents ADD CONSTRAINT valid_type CHECK (type IN ('video', 'music', 'image', 'text'));
ALTER TABLE public.exclusive_contents ALTER COLUMN url DROP NOT NULL;
