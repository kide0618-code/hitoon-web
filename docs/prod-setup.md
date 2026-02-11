# 本番環境セットアップ (<https://hitoonstore.com>)

## 概要

本番環境では Stripe の **Live モード** と **Test モード** の2つの運用がある。

| モード  | キー prefix               | 実際の課金 | 用途         |
| ---- | ----------------------- | ----- | ---------- |
| Test | `sk_test_` / `pk_test_` | なし    | 本番環境での動作確認 |
| Live | `sk_live_` / `pk_live_` | あり    | 実際のサービス運用  |

## 1. Stripe ダッシュボード設定

### 1-1. Webhook エンドポイント登録

1. [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks) にアクセス
2. 「エンドポイントを追加」をクリック
3. 以下を設定:

| 項目          | 値                                                             |
| ----------- | ------------------------------------------------------------- |
| エンドポイント URL | `https://hitoonstore.com/api/webhooks/stripe`                 |
| リッスンするイベント  | `checkout.session.completed`, `payment_intent.payment_failed` |

1. 作成後、「署名シークレット」（`whsec_...`）をコピー

**重要**: Test モードと Live モードで別々の Webhook エンドポイントが必要。ダッシュボード右上のトグルでモードを切り替えて、それぞれ登録する。

### 1-2. API キーの取得

1. [Stripe Dashboard > Developers > API keys](https://dashboard.stripe.com/apikeys) にアクセス
2. 以下のキーをコピー:
   * **公開可能キー** (`pk_test_...` or `pk_live_...`)
   * **シークレットキー** (`sk_test_...` or `sk_live_...`)

## 2. Vercel 環境変数の設定

[Vercel Dashboard](https://vercel.com) > プロジェクト > Settings > Environment Variables

### 本番運用（Live モード）

| 変数名                     | 値                         | Environment |
| ----------------------- | ------------------------- | ----------- |
| `STRIPE_SECRET_KEY`     | `sk_live_xxx`             | Production  |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx`（Live 用）       | Production  |
| `NEXT_PUBLIC_APP_URL`   | `https://hitoonstore.com` | Production  |

### 本番環境テスト（Test モード）

本番環境で Test モードを使いたい場合は、Preview 環境を利用する。

| 変数名                     | 値                                | Environment |
| ----------------------- | -------------------------------- | ----------- |
| `STRIPE_SECRET_KEY`     | `sk_test_xxx`                    | Preview     |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx`（Test 用）              | Preview     |
| `NEXT_PUBLIC_APP_URL`   | `https://preview-xxx.vercel.app` | Preview     |

**共通**（全 Environment に設定）:

| 変数名                             | 値                         | Environment |
| ------------------------------- | ------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxx.supabase.co` | All         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxx...`               | All         |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJxxx...`               | All         |

設定後、Vercel で再デプロイする:

```Shell
# Vercel CLI でデプロイ（または GitHub push で自動デプロイ）
vercel --prod
```

## 3. 本番環境でのテスト手順

### 3-1. Test モードでの確認（課金なし）

Stripe ダッシュボードを **Test モード** にした状態で Webhook と API キーを設定すれば、本番 URL でもテスト決済ができる。

1. Vercel の環境変数に `sk_test_...` を設定してデプロイ
2. Stripe ダッシュボード（Test モード）で Webhook を `https://hitoonstore.com/api/webhooks/stripe` に設定
3. サイトで購入フローを実行
4. テストカード（`4242 4242 4242 4242`）で決済

確認ポイント:

* [ ] Stripe Checkout 画面が表示される（上部に「テストモード」バナーあり）
* [ ] 決済完了後にリダイレクトされる
* [ ] Stripe ダッシュボード > Payments にテスト決済が記録される
* [ ] Webhook イベントが配信される（Stripe ダッシュボード > Webhooks > エンドポイント > イベントログ）
* [ ] Supabase の `purchases` テーブルにレコードが作成される

### 3-2. Live モードへの切り替え（実際の課金）

1. Stripe ダッシュボードを **Live モード** に切り替え
2. Webhook エンドポイントを登録（Live モード用）
3. Vercel 環境変数を Live キーに更新:
   * `STRIPE_SECRET_KEY` → `sk_live_xxx`
   * `STRIPE_WEBHOOK_SECRET` → `whsec_xxx`（Live 用）
4. 再デプロイ

### 3-3. Live モードでの少額テスト

Live モードでは実際に課金されるため、自分のカードで少額テストを行う。

1. テスト用に最低価格のカード（¥800 等）を用意
2. 自分のカードで購入
3. 確認後、Stripe ダッシュボードから返金:
   * Payments > 該当の決済 > 「返金」ボタン

## 4. Webhook のデバッグ

### Stripe ダッシュボードでの確認

1. [Webhooks](https://dashboard.stripe.com/webhooks) > エンドポイントを選択
2. 「イベントの試行」タブでイベントログを確認
3. 各イベントのステータス:
   * **成功**: HTTP 200 が返っている
   * **失敗**: エラーレスポンスを確認、Stripe は最大 3 日間自動リトライ

### イベントの手動再送

Stripe ダッシュボードから特定のイベントを再送できる:

1. Webhooks > エンドポイント > イベントの試行
2. 失敗したイベントを選択
3. 「再送」ボタン

### Stripe CLI での本番 Webhook デバッグ

本番の Webhook イベントをローカルに転送して調査できる:

```Shell
# 本番イベントをローカルに転送（読み取り専用、再送はしない）
stripe listen --forward-to localhost:3000/api/webhooks/stripe --live
```

**注意**: `--live` フラグを使うと Live モードのイベントを受信する。テスト用途には使わないこと。

## 5. 本番チェックリスト

### デプロイ前

* [ ] Stripe アカウントの本人確認が完了している
* [ ] Stripe の事業情報が入力済み
* [ ] 特定商取引法に基づく表記ページがある（`/legal/tokushoho` 等）
* [ ] プライバシーポリシーページがある（`/privacy`）
* [ ] 利用規約ページがある（`/terms`）

### Stripe 設定

* [ ] Live モードの API キーを Vercel に設定
* [ ] Live モードの Webhook エンドポイントを登録
* [ ] Webhook の署名シークレットを Vercel に設定
* [ ] `checkout.session.completed` イベントをリッスンしている
* [ ] `payment_intent.payment_failed` イベントをリッスンしている

### 動作確認

* [ ] テストモードで購入フロー全体が動作する
* [ ] Webhook が正常に受信・処理される
* [ ] 購入後にコレクションにカードが表示される
* [ ] Live モードで少額テスト決済 → 返金が完了する

### セキュリティ

* [ ] `STRIPE_SECRET_KEY` がクライアントサイドに露出していない
* [ ] `SUPABASE_SERVICE_ROLE_KEY` がクライアントサイドに露出していない
* [ ] Webhook で署名検証が有効になっている
* [ ] HTTPS が有効（Vercel はデフォルトで有効）

## 6. トラブルシューティング

| 症状                  | 原因                             | 対処                             |
| ------------------- | ------------------------------ | ------------------------------ |
| Checkout 画面が開かない    | API キーが未設定 or 不正               | Vercel 環境変数を確認                 |
| Webhook が届かない       | エンドポイント URL が間違っている            | Stripe ダッシュボードで URL を確認        |
| Webhook 署名エラー (400) | `STRIPE_WEBHOOK_SECRET` が一致しない | 正しい署名シークレットを設定                 |
| 購入後にカードが表示されない      | Webhook 処理でエラー                 | Vercel のログと Stripe のイベントログを確認  |
| Test/Live の混在       | 環境変数のモードが不一致                   | API キーと Webhook シークレットのモードを揃える |

