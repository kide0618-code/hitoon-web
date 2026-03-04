import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表示',
  description: `${APP_CONFIG.name}の特定商取引法に基づく表示`,
};

export default function TokushohoPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>特定商取引法に基づく表記</h1>
      <p className="text-gray-400">最終更新日: 2026年3月4日</p>

      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b border-gray-700">
            <th className="w-1/3 py-3 pr-4 text-left align-top text-gray-300">
              販売事業者名
            </th>
            <td className="py-3">井手 恭一郎（HITOON運営事務局）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">代表者</th>
            <td className="py-3">井手 恭一郎</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">所在地</th>
            <td className="py-3">茨城県つくば市真瀬1427-1</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">電話番号</th>
            <td className="py-3">
              ※電話でのお問い合わせは受け付けておりません。お問い合わせは下記メールアドレスまたはフォームよりお願いいたします。
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              メールアドレス
            </th>
            <td className="py-3">info@hitoonstore.com</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">販売URL</th>
            <td className="py-3">{APP_CONFIG.url}</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">販売価格</th>
            <td className="py-3">各商品ページに記載（税込表示）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              商品代金以外の必要料金
            </th>
            <td className="py-3">
              インターネット接続料金・通信料金はお客様のご負担となります
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">お支払い方法</th>
            <td className="py-3">クレジットカード決済（Stripe）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              代金の支払時期
            </th>
            <td className="py-3">商品注文時</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              商品の引渡時期
            </th>
            <td className="py-3">
              決済完了後、即時
              <br />
              ※デジタルコンテンツのため、購入完了後すぐにマイコレクションからアクセス可能
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              返品・キャンセルに関する特約
            </th>
            <td className="py-3">
              デジタルコンテンツという商品の性質上、お客様都合による返品・キャンセル・返金はお受けできません。
              <br />
              ※商品に欠陥がある場合は、個別にご対応いたします
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">動作環境</th>
            <td className="py-3">
              推奨ブラウザ: Google Chrome、Safari、Firefox、Edge（いずれも最新版）
            </td>
          </tr>
        </tbody>
      </table>

      <section className="mt-8">
        <h2>お問い合わせ</h2>
        <p>
          商品やサービスについてのお問い合わせは、メールにて承っております。
          <br />
          メールアドレス: info@hitoonstore.com
        </p>
      </section>
    </article>
  );
}
