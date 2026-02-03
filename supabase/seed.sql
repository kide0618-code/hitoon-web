-- HITOON Seed Data
-- For development and testing

-- ============================================
-- SAMPLE ARTISTS
-- ============================================
INSERT INTO public.artists (id, name, description, image_url, member_count, is_featured, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Aurora Nights', 'エレクトロニカとJ-POPを融合させた新世代アーティスト。幻想的なサウンドスケープで聴く者を夢の世界へ誘う。', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 1250, true, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Stellar Echo', 'ボーカルユニット。透明感のある歌声とエモーショナルな楽曲で若い世代を中心に人気急上昇中。', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', 890, true, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Neon Pulse', 'サイバーパンクをテーマにしたビジュアル系ロックバンド。激しいサウンドと独特の世界観が魅力。', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', 2100, true, 3),
  ('a1000000-0000-0000-0000-000000000004', 'Sakura Dreams', 'アコースティックを基調とした女性シンガーソングライター。心に染みるメロディと詩的な歌詞が特徴。', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 650, false, 0),
  ('a1000000-0000-0000-0000-000000000005', 'Digital Horizon', 'プログレッシブハウスとテクノを融合させたDJデュオ。クラブシーンで絶大な支持を得ている。', 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400', 1800, true, 4);

-- ============================================
-- SAMPLE CARD VISUALS
-- ============================================
INSERT INTO public.card_visuals (id, artist_id, name, artist_image_url, song_title, subtitle, is_active) VALUES
  -- Aurora Nights
  ('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '1st Single', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'Midnight Glow', 'Digital Single 2026', true),
  ('e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', '2nd Single', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Electric Dreams', 'Summer Edition', true),
  -- Stellar Echo
  ('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Debut Album', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', 'Starlight Symphony', '1st Album Collection', true),
  -- Neon Pulse
  ('e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Live Tour 2026', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600', 'Cyber Rebellion', 'Tour Memorial Card', true),
  -- Digital Horizon
  ('e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'Club Edition', 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600', 'Future Bass', 'DJ Set Collection', true);

-- ============================================
-- SAMPLE CARDS (3 per visual)
-- ============================================
-- Aurora Nights - 1st Single
INSERT INTO public.cards (id, visual_id, artist_id, name, description, rarity, price, total_supply, current_supply, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Midnight Glow [N]', 'ファースト・シングル「Midnight Glow」のノーマルカード', 'NORMAL', 1500, NULL, 42, true),
  ('c1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Midnight Glow [R]', 'ファースト・シングル「Midnight Glow」のレアカード', 'RARE', 3000, 100, 67, true),
  ('c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Midnight Glow [SR]', 'ファースト・シングル「Midnight Glow」のスーパーレアカード', 'SUPER_RARE', 8000, 30, 12, true),

-- Aurora Nights - 2nd Single
  ('c1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Electric Dreams [N]', 'セカンド・シングル「Electric Dreams」のノーマルカード', 'NORMAL', 1500, NULL, 28, true),
  ('c1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Electric Dreams [R]', 'セカンド・シングル「Electric Dreams」のレアカード', 'RARE', 3500, 80, 45, true),
  ('c1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Aurora Nights - Electric Dreams [SR]', 'セカンド・シングル「Electric Dreams」のスーパーレアカード', 'SUPER_RARE', 10000, 20, 8, true),

-- Stellar Echo - Debut Album
  ('c1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Stellar Echo - Starlight Symphony [N]', 'デビューアルバム「Starlight Symphony」のノーマルカード', 'NORMAL', 1200, NULL, 156, true),
  ('c1000000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Stellar Echo - Starlight Symphony [R]', 'デビューアルバム「Starlight Symphony」のレアカード', 'RARE', 2500, 200, 89, true),
  ('c1000000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Stellar Echo - Starlight Symphony [SR]', 'デビューアルバム「Starlight Symphony」のスーパーレアカード', 'SUPER_RARE', 6000, 50, 23, true),

-- Neon Pulse - Live Tour
  ('c1000000-0000-0000-0000-000000000010', 'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Neon Pulse - Cyber Rebellion [N]', 'ライブツアー2026記念ノーマルカード', 'NORMAL', 1800, NULL, 312, true),
  ('c1000000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Neon Pulse - Cyber Rebellion [R]', 'ライブツアー2026記念レアカード', 'RARE', 4000, 150, 98, true),
  ('c1000000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Neon Pulse - Cyber Rebellion [SR]', 'ライブツアー2026記念スーパーレアカード', 'SUPER_RARE', 12000, 30, 15, true),

-- Digital Horizon - Club Edition
  ('c1000000-0000-0000-0000-000000000013', 'e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'Digital Horizon - Future Bass [N]', 'クラブエディションのノーマルカード', 'NORMAL', 1000, NULL, 89, true),
  ('c1000000-0000-0000-0000-000000000014', 'e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'Digital Horizon - Future Bass [R]', 'クラブエディションのレアカード', 'RARE', 2000, 300, 134, true),
  ('c1000000-0000-0000-0000-000000000015', 'e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'Digital Horizon - Future Bass [SR]', 'クラブエディションのスーパーレアカード', 'SUPER_RARE', 5000, 100, 42, true);

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
