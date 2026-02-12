# Database Rules (Supabase / PostgreSQL)

## Applies to: Database schema, queries, RLS policies

## Schema Design

### Core Tables

```sql
-- ユーザー (Supabase Auth連携)
-- auth.users は Supabase が管理。拡張情報のみ保存
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 管理者（operators）
-- user_idで管理者を判定。profilesとは別に管理
CREATE TABLE public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',  -- admin, super_admin（将来拡張用）
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_operator_user UNIQUE (user_id),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'super_admin'))
);

-- アーティスト
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  member_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,   -- おすすめ表示フラグ
  display_order INT DEFAULT 0,         -- おすすめ表示順
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- カード（デジタルトレカ）
-- 各カードが独自の画像・楽曲情報を持つ
-- フレーム（枠・エフェクト）は config/frame-templates.ts で管理、frame_template_id で参照
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,

  -- カード基本情報
  name TEXT NOT NULL,
  description TEXT,

  -- カードコンテンツ（旧card_visualsから移行）
  card_image_url TEXT NOT NULL,          -- アーティスト画像URL
  song_title TEXT,                       -- 楽曲名（任意）
  subtitle TEXT,                         -- サブタイトル（任意）
  frame_template_id TEXT NOT NULL DEFAULT 'classic-normal', -- フレームテンプレートID

  -- レアリティ（3パターン固定）
  rarity TEXT NOT NULL DEFAULT 'NORMAL', -- NORMAL, RARE, SUPER_RARE

  -- 価格・在庫
  price INT NOT NULL,                    -- 円単位
  total_supply INT,                      -- NULL = 無制限
  current_supply INT DEFAULT 0,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_rarity CHECK (rarity IN ('NORMAL', 'RARE', 'SUPER_RARE'))
);

-- 限定コンテンツ（レアリティ別のボーナスコンテンツ）
-- card_id単位で紐付け → SR専用コンテンツなどを設定可能
-- 外部URL（YouTube限定公開等）を想定
CREATE TABLE public.exclusive_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,           -- video, music, image
  url TEXT NOT NULL,            -- 外部URL（YouTube, Vimeo等）
  title TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,  -- 複数コンテンツの表示順
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('video', 'music', 'image'))
);

-- 購入履歴
-- 数量選択時は複数レコード作成（quantity=3なら3レコード、各シリアルNo.付与）
-- 同一ユーザーが同じカードを無制限に購入可能
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  serial_number INT NOT NULL,            -- カードのシリアルNo.（レアリティ別採番）
  price_paid INT NOT NULL,               -- 購入時の価格
  quantity_in_order INT DEFAULT 1,       -- この注文での購入枚数（グルーピング用）
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT NOT NULL,  -- Webhook冪等性のため必須
  status TEXT DEFAULT 'pending',         -- pending, completed, refunded
  purchased_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'refunded'))
);

-- シリアルNo.採番用シーケンス（card_id別）は使用しない
-- 代わりにアトミックなカウンター更新で対応（後述）

-- インデックス
CREATE INDEX idx_operators_user ON public.operators(user_id);
CREATE INDEX idx_artists_featured ON public.artists(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_cards_artist ON public.cards(artist_id);
CREATE INDEX idx_cards_frame_template ON public.cards(frame_template_id);
CREATE INDEX idx_cards_rarity ON public.cards(rarity);
CREATE INDEX idx_exclusive_contents_card ON public.exclusive_contents(card_id);
CREATE INDEX idx_purchases_user ON public.purchases(user_id);
CREATE INDEX idx_purchases_card ON public.purchases(card_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
CREATE INDEX idx_purchases_purchased_at ON public.purchases(purchased_at);

-- Webhook冪等性チェック用のユニーク制約
-- 同一checkout_session + serial_numberの重複を防止
CREATE UNIQUE INDEX idx_purchases_idempotency
  ON public.purchases(stripe_checkout_session_id, card_id, serial_number)
  WHERE status = 'completed';
```

### 将来拡張: C2C 2次流通

```sql
-- 出品（将来用）
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id),
  purchase_id UUID REFERENCES public.purchases(id),  -- 所有権の証明
  price INT NOT NULL,
  status TEXT DEFAULT 'active',  -- active, sold, cancelled
  listed_at TIMESTAMPTZ DEFAULT NOW(),
  sold_at TIMESTAMPTZ
);

-- 取引履歴（将来用）
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id),
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  price INT NOT NULL,
  platform_fee INT,              -- プラットフォーム手数料
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS)

```sql
-- 全テーブルでRLS有効化
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exclusive_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- ヘルパー関数: 管理者かどうかを判定
CREATE OR REPLACE FUNCTION public.is_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.operators
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Operators: 管理者自身のみ閲覧可（他管理者の存在は非公開）
CREATE POLICY "Operators can view own record"
  ON public.operators FOR SELECT USING (auth.uid() = user_id);

-- Profiles: 自分のプロフィールのみ編集可、閲覧は全員可
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Artists: 全員閲覧可（管理者のみ編集 - service_role使用）
CREATE POLICY "Artists are viewable by everyone"
  ON public.artists FOR SELECT USING (true);

-- Cards: アクティブなカードは全員閲覧可
CREATE POLICY "Active cards are viewable by everyone"
  ON public.cards FOR SELECT USING (is_active = true);

-- Exclusive Contents: 購入者のみ閲覧可
CREATE POLICY "Buyers can view exclusive content"
  ON public.exclusive_contents FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.purchases
      WHERE purchases.card_id = exclusive_contents.card_id
        AND purchases.user_id = auth.uid()
        AND purchases.status = 'completed'
    )
  );

-- Purchases: 自分の購入履歴のみ閲覧可
CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT USING (auth.uid() = user_id);

-- ※ INSERT/UPDATE/DELETE はすべて service_role (サーバーサイド) で実行
-- クライアントからの直接変更は不可
```

## Query Patterns

### 基本クエリ

```typescript
// おすすめアーティスト（ホーム画面）
const { data: featuredArtists } = await supabase
  .from('artists')
  .select('*')
  .eq('is_featured', true)
  .order('display_order', { ascending: true });

// アーティスト一覧（マーケット）
const { data: artists } = await supabase
  .from('artists')
  .select('*')
  .order('member_count', { ascending: false });

// 管理者判定
const { data: operator } = await supabase
  .from('operators')
  .select('role')
  .eq('user_id', userId)
  .single();
const isAdmin = !!operator;

// Marketplace: カード一覧（アーティスト情報付き）
const { data: cards } = await supabase
  .from('cards')
  .select(
    `
    *,
    artist:artists(id, name)
  `,
  )
  .eq('is_active', true)
  .order('created_at', { ascending: false });

// 特定アーティストのカード取得
const { data: artistCards } = await supabase
  .from('cards')
  .select('*')
  .eq('artist_id', artistId)
  .eq('is_active', true)
  .order('rarity', { ascending: true }); // NORMAL → RARE → SUPER_RARE

// ユーザーのコレクション
const { data: collection } = await supabase
  .from('purchases')
  .select(
    `
    *,
    card:cards(
      *,
      artist:artists(*)
    )
  `,
  )
  .eq('user_id', userId)
  .eq('status', 'completed')
  .order('purchased_at', { ascending: false });
```

### 管理画面: カード作成

```typescript
// カードを直接作成（画像URL、楽曲名、フレームテンプレートを指定）
const { data: card } = await supabaseAdmin
  .from('cards')
  .insert({
    artist_id: artistId,
    name: cardName,
    card_image_url: uploadedImageUrl,
    song_title: songTitle,
    subtitle: subtitle,
    frame_template_id: 'classic-normal', // config/frame-templates.ts のID
    rarity: 'NORMAL',
    price: 1500,
    total_supply: null,
  })
  .select()
  .single();
```

### 購入処理（サーバーサイド）

```typescript
// Webhook処理: 数量分のpurchaseレコードを作成
// ※過剰販売は許容し、手動対応する方針

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { user_id, card_id, quantity } = session.metadata!;
  const qty = parseInt(quantity, 10);

  // 1. 冪等性チェック: 既に処理済みか確認
  const { data: existing } = await supabaseAdmin
    .from('purchases')
    .select('id')
    .eq('stripe_checkout_session_id', session.id)
    .eq('status', 'completed')
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('Already processed:', session.id);
    return; // 既に処理済み
  }

  // 2. アトミックにcurrent_supplyをインクリメントして新しい値を取得
  // PostgreSQL: UPDATE ... RETURNING で競合を防止
  const { data: updatedCard, error } = await supabaseAdmin.rpc('increment_card_supply', {
    p_card_id: card_id,
    p_quantity: qty,
  });

  if (error) throw error;

  // updatedCard = { new_supply: 103, old_supply: 100, price: 3000 }
  const startSerial = updatedCard.old_supply + 1;

  // 3. 数量分のpurchaseレコードを作成
  const purchases = Array.from({ length: qty }, (_, i) => ({
    user_id,
    card_id,
    serial_number: startSerial + i,
    price_paid: updatedCard.price,
    quantity_in_order: qty,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent as string,
    status: 'completed',
  }));

  // ユニーク制約で重複挿入を防止
  await supabaseAdmin.from('purchases').insert(purchases);

  // 4. メンバー数更新（初回購入ユーザーの場合のみ）
  await updateMemberCountIfNewUser(user_id, card_id);
}
```

### シリアルNo.採番用のアトミック関数

````sql
-- PostgreSQL Function: 競合を防ぐアトミックなカウンター更新
CREATE OR REPLACE FUNCTION increment_card_supply(
  p_card_id UUID,
  p_quantity INT
) RETURNS TABLE(new_supply INT, old_supply INT, price INT) AS $$
DECLARE
  v_old_supply INT;
  v_new_supply INT;
  v_price INT;
BEGIN
  -- FOR UPDATE でロックを取得し、競合を防止
  SELECT current_supply, cards.price INTO v_old_supply, v_price
  FROM public.cards
  WHERE id = p_card_id
  FOR UPDATE;

  v_new_supply := v_old_supply + p_quantity;

  UPDATE public.cards
  SET current_supply = v_new_supply,
      updated_at = NOW()
  WHERE id = p_card_id;

  RETURN QUERY SELECT v_new_supply, v_old_supply, v_price;
END;
$$ LANGUAGE plpgsql;

### レアリティ別コンテンツ取得
```typescript
// 購入者のみアクセス可能な限定コンテンツ
const { data: contents } = await supabase
  .from('exclusive_contents')
  .select('*')
  .eq('card_id', cardId)
  .order('display_order', { ascending: true });
````

## Supabase Functions (Edge Functions)

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12?target=deno';

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
  });

  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
  );

  // Handle event...
});
```

## Best Practices

1. **RLS必須**: 全テーブルでRow Level Securityを有効化
2. **service_role分離**: 管理操作はサーバーサイドでservice_roleを使用
3. **インデックス**: 頻繁にWHEREで使用するカラムにはインデックス作成
4. **Soft Delete**: 本番では物理削除より`deleted_at`カラムを検討
5. **監査ログ**: 重要な操作は`audit_logs`テーブルに記録
