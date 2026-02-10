# Stripe設定ガイド

HITOON プロジェクトにおけるStripe決済の設定手順をまとめています。

## 目次

1. [概要](#概要)
2. [Stripeアカウント設定](#stripeアカウント設定)
3. [環境変数](#環境変数)
4. [Webhook設定](#webhook設定)
5. [テスト方法](#テスト方法)
6. [本番デプロイ](#本番デプロイ)

---

## 概要

### 決済方式

| 項目               | 仕様                                          |
| ------------------ | --------------------------------------------- |
| 決済タイプ         | 都度課金（単発購入）のみ                      |
| 決済手段           | クレジットカード、Link、Apple Pay、Google Pay |
| 通貨               | JPY（日本円）                                 |
| カード保存         | 次回決済をスムーズにするため保存可            |
| サブスクリプション | 無し                                          |

### 使用するStripe機能

- **Checkout Session**: 決済画面への誘導
- **Payment Intent**: 決済処理の追跡
- **Customer**: ユーザーとカード情報の紐付け
- **Webhook**: 決済完了通知の受信

---

## Stripeアカウント設定

### 1. アカウント作成

1. [Stripe Dashboard](https://dashboard.stripe.com/) にアクセス
2. 新規アカウントを作成（または既存アカウントでログイン）
3. ビジネス情報を入力して本人確認を完了

### 2. APIキーの取得

Stripe Dashboardの **[Developers] → [API keys]** から取得:

| キー                | 用途                             | 環境変数名          |
| ------------------- | -------------------------------- | ------------------- |
| **Secret key**      | サーバーサイドでの決済処理       | `STRIPE_SECRET_KEY` |
| **Publishable key** | クライアントサイド（現在未使用） | -                   |

> ⚠️ Secret keyは絶対に公開しないでください

### 3. テストモードと本番モード

- **テストモード**: `sk_test_xxx` で始まるキー
- **本番モード**: `sk_live_xxx` で始まるキー

開発中は必ずテストモードを使用してください。

---

## 環境変数

### 必要な環境変数

```env
# .env.local (開発環境)

# Stripe Secret Key (テストモード)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Stripe Webhook Secret (後述のWebhook設定後に取得)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# アプリケーションURL (Checkoutのリダイレクト先)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 本番環境

```env
# .env.production

STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Webhook設定

### ローカル開発環境

#### 1. Stripe CLIのインストール

```bash
# macOS
brew install stripe/stripe-cli/stripe

# その他のOS
# https://stripe.com/docs/stripe-cli#install
```

#### 2. Stripe CLIにログイン

```bash
stripe login
```

ブラウザが開くので、Stripeアカウントで認証してください。

#### 3. Webhookのフォワーディング開始

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

出力例:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxx (^C to quit)
```

この `whsec_xxxxxxxx` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定してください。

#### 4. 開発中のWebhookテスト

別ターミナルで以下を実行すると、テストイベントを送信できます:

```bash
# checkout.session.completed イベントをトリガー
stripe trigger checkout.session.completed

# payment_intent.payment_failed イベントをトリガー
stripe trigger payment_intent.payment_failed
```

### 本番環境 (Vercel)

#### 1. Stripe Dashboardでエンドポイント作成

1. [Stripe Dashboard] → [Developers] → [Webhooks] → [Add endpoint]
2. 以下を設定:
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - **Events to send**: 以下のイベントを選択
     - `checkout.session.completed`
     - `payment_intent.payment_failed`

3. エンドポイント作成後、**Signing secret** を取得

#### 2. Vercelの環境変数に設定

Vercel Dashboard → Settings → Environment Variables:

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 処理されるイベント

| イベント                        | 処理内容                                       |
| ------------------------------- | ---------------------------------------------- |
| `checkout.session.completed`    | 購入完了処理（purchaseレコード作成、在庫更新） |
| `payment_intent.payment_failed` | 決済失敗のログ記録                             |

---

## テスト方法

### テストカード

| カード番号            | 説明           |
| --------------------- | -------------- |
| `4242 4242 4242 4242` | 成功           |
| `4000 0000 0000 0002` | カード拒否     |
| `4000 0000 0000 3220` | 3Dセキュア認証 |
| `4000 0000 0000 9995` | 残高不足       |

> すべてのテストカードで有効期限は将来の日付、CVCは任意の3桁

### テストフロー

1. 開発サーバー起動: `pnpm dev`
2. Stripe CLIでWebhookリッスン: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. アプリでカード購入フローを実行
4. テストカードで決済
5. コレクションページで購入確認

---

## 本番デプロイ

### チェックリスト

- [ ] Stripeアカウントの本人確認完了
- [ ] 本番モードのAPIキーを取得
- [ ] 本番用Webhookエンドポイントを作成
- [ ] Vercelに本番環境変数を設定
- [ ] テスト購入を実施して動作確認

### 重要な注意事項

1. **APIキーの管理**
   - Secret keyは絶対にGitにコミットしない
   - `.env.local` は `.gitignore` に含まれている

2. **Webhookの冪等性**
   - 同一のcheckout sessionからの重複処理を防ぐため、`stripe_checkout_session_id`に一意制約あり

3. **エラーハンドリング**
   - Webhook処理失敗時、Stripeは最大3日間リトライ
   - エラーログはVercelのFunctionsログで確認可能

---

## 決済フロー図

```
[ユーザー] カード購入クリック
     ↓
[/api/checkout] Checkout Session作成
     ↓
[Stripe Checkout] 決済画面でカード情報入力
     ↓
[Stripe] 決済処理
     ↓
[Webhook] checkout.session.completed 受信
     ↓
[/api/webhooks/stripe]
  - purchaseレコード作成
  - カード在庫更新
  - アーティストメンバー数更新
  - カート削除
     ↓
[ユーザー] 成功ページにリダイレクト (/activity?success=true)
```

---

## トラブルシューティング

### 「Webhook signature verification failed」エラー

- `STRIPE_WEBHOOK_SECRET` が正しく設定されているか確認
- ローカル開発では `stripe listen` コマンドを再実行してsecretを更新

### 購入完了してもコレクションに反映されない

1. Stripe CLIが起動しているか確認
2. Webhookのログを確認: `stripe listen` の出力
3. Vercelの場合: Functions ログを確認

### 本番でWebhookが届かない

1. Stripe Dashboardの [Webhooks] でエンドポイントのステータスを確認
2. 「Recent events」で送信履歴とレスポンスを確認
3. URLが正しいか（HTTPSか）確認

---

## 関連ファイル

| ファイル                           | 説明                                     |
| ---------------------------------- | ---------------------------------------- |
| `lib/stripe/client.ts`             | Stripeクライアント、Checkout Session作成 |
| `app/api/checkout/route.ts`        | 購入API（セッション作成）                |
| `app/api/webhooks/stripe/route.ts` | Webhook処理（購入完了、決済失敗）        |
| `.claude/rules/payments.md`        | 決済関連の開発ルール                     |

---

## 参考リンク

- [Stripe Checkout ドキュメント](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks ドキュメント](https://stripe.com/docs/webhooks)
- [Stripe CLI ドキュメント](https://stripe.com/docs/stripe-cli)
- [Stripe テストカード一覧](https://stripe.com/docs/testing#cards)
