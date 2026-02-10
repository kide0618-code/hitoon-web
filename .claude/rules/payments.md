# Payments Rules (Stripe Integration)

## Applies to: Stripe決済、購入フロー

## Overview

| 項目 | 仕様 |
|------|------|
| 決済方式 | 都度課金（単発購入）のみ |
| 決済手段 | クレカ、Link、Apple Pay、Google Pay |
| カード保存 | 次回決済をスムーズにするため保存可 |
| サブスク | 無し |

## Stripe Products

### 使用するStripe機能
1. **Checkout Session**: 決済画面への誘導
2. **Payment Intent**: 決済処理の追跡
3. **Customer**: ユーザーとカード情報の紐付け
4. **Webhook**: 決済完了通知の受信

## Implementation Pattern

### 1. Checkout Session作成（サーバーサイド）

```typescript
// app/api/checkout/route.ts
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { cardId } = await req.json();

  // ユーザー認証確認
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // カード情報取得
  const { data: card } = await supabase
    .from('cards')
    .select('*, artist:artists(name)')
    .eq('id', cardId)
    .single();

  if (!card) {
    return Response.json({ error: 'Card not found' }, { status: 404 });
  }

  // 在庫確認
  if (card.total_supply && card.current_supply >= card.total_supply) {
    return Response.json({ error: 'Sold out' }, { status: 400 });
  }

  // Stripe Customer取得または作成
  let customerId = await getOrCreateStripeCustomer(user.id, user.email);

  // Checkout Session作成
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'jpy',
        product_data: {
          name: `${card.artist.name} - ${card.name}`,
          images: card.image_url ? [card.image_url] : [],
          metadata: {
            card_id: cardId,
            rarity: card.rarity,
          },
        },
        unit_amount: card.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/activity?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/artists/${card.artist_id}`,
    metadata: {
      user_id: user.id,
      card_id: cardId,
    },
    // カード情報を保存するオプション
    payment_intent_data: {
      setup_future_usage: 'on_session',
    },
  });

  return Response.json({ url: session.url });
}
```

### 2. Webhook処理

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(paymentIntent);
      break;
    }
  }

  return Response.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { user_id, card_id } = session.metadata!;

  // カードの現在供給数を取得
  const { data: card } = await supabaseAdmin
    .from('cards')
    .select('current_supply')
    .eq('id', card_id)
    .single();

  // 購入レコード作成
  await supabaseAdmin
    .from('purchases')
    .insert({
      user_id,
      card_id,
      serial_number: (card?.current_supply || 0) + 1,
      price_paid: session.amount_total!,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'completed',
    });

  // 供給数を更新
  await supabaseAdmin
    .from('cards')
    .update({ current_supply: (card?.current_supply || 0) + 1 })
    .eq('id', card_id);

  // アーティストのメンバー数を更新（ユニークユーザーの場合のみ）
  // ...
}
```

### 3. フロントエンド呼び出し

```typescript
// components/PurchaseButton.tsx
'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function PurchaseButton({ cardId, price }: { cardId: string; price: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });

      const { url, error } = await res.json();

      if (error) {
        alert(error);
        return;
      }

      // Stripe Checkoutへリダイレクト
      window.location.href = url;
    } catch (err) {
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className="w-full bg-blue-600 font-bold py-4 rounded-full flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <><Loader2 className="animate-spin" /> 準備中...</>
      ) : (
        `¥${price.toLocaleString()}で購入`
      )}
    </button>
  );
}
```

## Environment Variables

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

### Stripe CLIでWebhookテスト
```bash
# Stripe CLI インストール後
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# テスト決済
stripe trigger checkout.session.completed
```

### テストカード
| カード番号 | 説明 |
|-----------|------|
| 4242 4242 4242 4242 | 成功 |
| 4000 0000 0000 0002 | 拒否 |
| 4000 0000 0000 3220 | 3Dセキュア |

## Security Checklist

- [ ] Webhook署名を必ず検証する
- [ ] 金額はサーバー側で取得（クライアントからの金額を信用しない）
- [ ] 購入前に在庫・所有権を再確認
- [ ] service_roleキーはサーバーサイドのみで使用
- [ ] 本番ではHTTPSを必須に

## Error Handling

| エラー | 対応 |
|--------|------|
| 在庫切れ | 購入不可メッセージ表示 |
| 決済失敗 | リトライ案内 |
| 二重購入 | 既存の購入を案内 |
| Webhook失敗 | Stripeが自動リトライ（最大3日間） |
