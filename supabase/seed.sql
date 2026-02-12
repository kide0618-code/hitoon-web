-- HITOON Seed Data
-- For development and testing

-- ============================================
-- AUTH USERS (for local dev)
-- Password: "password123" for both accounts
-- ============================================
-- INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) VALUES
--   ('d1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hidenariyuda@gmail.com', '$2a$10$PznUGhVGBpHsiOiLCHVSfuWCfCDCCMVl9Vo/JJNmka2dFBlGPFJFe', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}'),
--   ('d1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'k.ide0618@gmail.com', '$2a$10$PznUGhVGBpHsiOiLCHVSfuWCfCDCCMVl9Vo/JJNmka2dFBlGPFJFe', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}')
-- ON CONFLICT (id) DO NOTHING;

-- -- Auth identities (required for Supabase Auth to work)
-- INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at) VALUES
--   (gen_random_uuid(), 'd1000000-0000-0000-0000-000000000001', '{"sub":"d1000000-0000-0000-0000-000000000001","email":"hidenariyuda@gmail.com"}', 'email', 'd1000000-0000-0000-0000-000000000001', NOW(), NOW(), NOW()),
--   (gen_random_uuid(), 'd1000000-0000-0000-0000-000000000002', '{"sub":"d1000000-0000-0000-0000-000000000002","email":"k.ide0618@gmail.com"}', 'email', 'd1000000-0000-0000-0000-000000000002', NOW(), NOW(), NOW())
-- ON CONFLICT DO NOTHING;

-- -- ============================================
-- -- PROFILES
-- -- ============================================
-- INSERT INTO public.profiles (id, display_name, avatar_url) VALUES
--   ('d1000000-0000-0000-0000-000000000001', 'Hidenari Yuda', NULL),
--   ('d1000000-0000-0000-0000-000000000002', 'K. Ide', NULL)
-- ON CONFLICT (id) DO NOTHING;

-- -- ============================================
-- -- OPERATORS (admin access)
-- -- ============================================
-- INSERT INTO public.operators (id, user_id, role) VALUES
--   (gen_random_uuid(), 'd1000000-0000-0000-0000-000000000001', 'super_admin'),
--   (gen_random_uuid(), 'd1000000-0000-0000-0000-000000000002', 'admin')
-- ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE ARTISTS
-- ============================================
INSERT INTO public.artists (id, name, description, image_url, member_count, is_featured, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Aurora Nights', 'エレクトロニカとJ-POPを融合させた新世代アーティスト。幻想的なサウンドスケープで聴く者を夢の世界へ誘う。', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 1250, true, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Stellar Echo', 'ボーカルユニット。透明感のある歌声とエモーショナルな楽曲で若い世代を中心に人気急上昇中。', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', 890, true, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Neon Pulse', 'サイバーパンクをテーマにしたビジュアル系ロックバンド。激しいサウンドと独特の世界観が魅力。', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', 2100, true, 3),
  ('a1000000-0000-0000-0000-000000000004', 'Sakura Dreams', 'アコースティックを基調とした女性シンガーソングライター。心に染みるメロディと詩的な歌詞が特徴。', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 650, false, 0),
  ('a1000000-0000-0000-0000-000000000005', 'Digital Horizon', 'プログレッシブハウスとテクノを融合させたDJデュオ。クラブシーンで絶大な支持を得ている。', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 1800, true, 4);

-- ============================================
-- SAMPLE CARDS (card_image_url, song_title, subtitle, frame_template_id on cards directly)
-- ============================================
-- Aurora Nights - 1st Single (Midnight Glow)
INSERT INTO public.cards (id, artist_id, name, description, card_image_url, song_title, subtitle, frame_template_id, rarity, price, total_supply, current_supply, max_purchase_per_user, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Midnight Glow [N]', 'ファースト・シングル「Midnight Glow」のノーマルカード', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'Midnight Glow', 'Digital Single 2026', 'classic-normal', 'NORMAL', 1500, NULL, 42, NULL, true),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Midnight Glow [R]', 'ファースト・シングル「Midnight Glow」のレアカード', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'Midnight Glow', 'Digital Single 2026', 'classic-rare', 'RARE', 3000, 100, 67, 3, true),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Midnight Glow [SR]', 'ファースト・シングル「Midnight Glow」のスーパーレアカード', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'Midnight Glow', 'Digital Single 2026', 'classic-super-rare', 'SUPER_RARE', 8000, 30, 12, 1, true),

-- Aurora Nights - 2nd Single (Electric Dreams)
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Electric Dreams [N]', 'セカンド・シングル「Electric Dreams」のノーマルカード', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Electric Dreams', 'Summer Edition', 'carbon-normal', 'NORMAL', 1500, NULL, 28, NULL, true),
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Electric Dreams [R]', 'セカンド・シングル「Electric Dreams」のレアカード', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Electric Dreams', 'Summer Edition', 'cosmic-rare', 'RARE', 3500, 80, 45, 3, true),
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Electric Dreams [SR]', 'セカンド・シングル「Electric Dreams」のスーパーレアカード', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Electric Dreams', 'Summer Edition', 'prismatic-super-rare', 'SUPER_RARE', 10000, 20, 8, 1, true),

-- Stellar Echo - Debut Album (Starlight Symphony)
  ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'Stellar Echo - Starlight Symphony [N]', 'デビューアルバム「Starlight Symphony」のノーマルカード', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', 'Starlight Symphony', '1st Album Collection', 'minimal-normal', 'NORMAL', 1200, NULL, 156, NULL, true),
  ('c1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'Stellar Echo - Starlight Symphony [R]', 'デビューアルバム「Starlight Symphony」のレアカード', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', 'Starlight Symphony', '1st Album Collection', 'emerald-rare', 'RARE', 2500, 200, 89, 3, true),
  ('c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000002', 'Stellar Echo - Starlight Symphony [SR]', 'デビューアルバム「Starlight Symphony」のスーパーレアカード', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', 'Starlight Symphony', '1st Album Collection', 'diamond-super-rare', 'SUPER_RARE', 6000, 50, 23, 1, true),

-- Neon Pulse - Live Tour (Cyber Rebellion)
  ('c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003', 'Neon Pulse - Cyber Rebellion [N]', 'ライブツアー2026記念ノーマルカード', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600', 'Cyber Rebellion', 'Tour Memorial Card', 'classic-normal', 'NORMAL', 1800, NULL, 312, NULL, true),
  ('c1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003', 'Neon Pulse - Cyber Rebellion [R]', 'ライブツアー2026記念レアカード', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600', 'Cyber Rebellion', 'Tour Memorial Card', 'classic-rare', 'RARE', 4000, 150, 98, 3, true),
  ('c1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000003', 'Neon Pulse - Cyber Rebellion [SR]', 'ライブツアー2026記念スーパーレアカード', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600', 'Cyber Rebellion', 'Tour Memorial Card', 'classic-super-rare', 'SUPER_RARE', 12000, 30, 15, 1, true),

-- Digital Horizon - Club Edition (Future Bass)
  ('c1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000005', 'Digital Horizon - Future Bass [N]', 'クラブエディションのノーマルカード', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600', 'Future Bass', 'DJ Set Collection', 'carbon-normal', 'NORMAL', 1000, NULL, 89, NULL, true),
  ('c1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 'Digital Horizon - Future Bass [R]', 'クラブエディションのレアカード', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600', 'Future Bass', 'DJ Set Collection', 'cosmic-rare', 'RARE', 2000, 300, 134, 3, true),
  ('c1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000005', 'Digital Horizon - Future Bass [SR]', 'クラブエディションのスーパーレアカード', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600', 'Future Bass', 'DJ Set Collection', 'prismatic-super-rare', 'SUPER_RARE', 5000, 100, 42, 1, true);

-- ============================================
-- SAMPLE EXCLUSIVE CONTENTS
-- ============================================
INSERT INTO public.exclusive_contents (card_id, type, url, title, description, display_order) VALUES
  -- SR cards get exclusive content
  ('c1000000-0000-0000-0000-000000000003', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Midnight Glow - Behind The Scenes', 'MV撮影の舞台裏映像', 1),
  ('c1000000-0000-0000-0000-000000000003', 'music', 'https://soundcloud.com/example/midnight-glow-acoustic', 'Midnight Glow - Acoustic Version', 'アコースティックバージョン限定配信', 2),
  ('c1000000-0000-0000-0000-000000000006', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Electric Dreams - Making Of', 'レコーディング風景', 1),
  ('c1000000-0000-0000-0000-000000000009', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Starlight Symphony - Live Performance', 'デビューライブ映像', 1),
  ('c1000000-0000-0000-0000-000000000012', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Cyber Rebellion Tour - Documentary', 'ツアードキュメンタリー', 1),
  ('c1000000-0000-0000-0000-000000000015', 'music', 'https://soundcloud.com/example/future-bass-extended', 'Future Bass - Extended Mix', '10分超えのエクステンデッドミックス', 1),
  -- R cards also get some content
  ('c1000000-0000-0000-0000-000000000002', 'image', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200', 'Midnight Glow - Jacket Photo', '高画質ジャケット写真', 1),
  ('c1000000-0000-0000-0000-000000000008', 'image', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200', 'Starlight Symphony - Promo Photo', 'プロモーション写真', 1);
