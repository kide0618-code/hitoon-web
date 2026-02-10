import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表示',
  description: `${APP_CONFIG.name}の特定商取引法に基づく表示`,
};

export default function TokushohoPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>特定商取引法に基づく表示</h1>
      <p className="text-gray-400">最終更新日: 2026年2月3日</p>

      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b border-gray-700">
            <th className="w-1/3 py-3 pr-4 text-left align-top text-gray-300">販売業者</th>
            <td className="py-3">株式会社HITOON（仮称）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">運営統括責任者</th>
            <td className="py-3">代表取締役 ○○ ○○</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">所在地</th>
            <td className="py-3">
              〒000-0000
              <br />
              東京都○○区○○ 0-0-0 ○○ビル 0F
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">電話番号</th>
            <td className="py-3">03-0000-0000（お問い合わせはメールにてお願いいたします）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">メールアドレス</th>
            <td className="py-3">support@hitoon.example.com</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">販売URL</th>
            <td className="py-3">{APP_CONFIG.url}</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">販売価格</th>
            <td className="py-3">各商品ページに表示された価格（税込）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">販売価格以外の必要料金</th>
            <td className="py-3">
              なし
              <br />
              ※インターネット接続料金、通信料金等はお客様のご負担となります
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">支払方法</th>
            <td className="py-3">
              クレジットカード（VISA、Mastercard、American Express、JCB）
              <br />
              Apple Pay、Google Pay
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">支払時期</th>
            <td className="py-3">購入手続き完了時</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">商品の引渡時期</th>
            <td className="py-3">
              決済完了後、即時
              <br />
              ※デジタルコンテンツのため、購入完了後すぐにマイコレクションからアクセス可能
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">返品・キャンセル</th>
            <td className="py-3">
              デジタルコンテンツという商品の性質上、購入完了後の返品・キャンセル・返金はお受けできません。
              <br />
              ※商品に欠陥がある場合は、個別にご対応いたします
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">動作環境</th>
            <td className="py-3">
              <ul className="ml-4 mt-0 list-disc">
                <li>対応ブラウザ: Google Chrome、Safari、Firefox、Edge（いずれも最新版）</li>
                <li>対応OS: iOS 15以上、Android 10以上、Windows 10以上、macOS 12以上</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <section className="mt-8">
        <h2>お問い合わせ</h2>
        <p>
          商品やサービスについてのお問い合わせは、メールにて承っております。
          <br />
          メールアドレス: support@hitoon.example.com
        </p>
      </section>
    </article>
  );
}
