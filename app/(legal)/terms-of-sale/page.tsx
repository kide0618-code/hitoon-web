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

      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b border-gray-700">
            <th className="w-1/3 py-3 pr-4 text-left align-top text-gray-300">
              販売業者
            </th>
            <td className="py-3">HITOON運営事務局</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">所在地</th>
            <td className="py-3">茨城県つくば市真瀬1427-1</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">電話番号</th>
            <td className="py-3">
              電話番号については、ご請求をいただければ遅滞なく開示いたします。
              <br />
              <span className="text-gray-400 text-xs">
                ※サービスに関するお問い合わせは、お電話では受け付けておりません。下記のメールアドレスへご連絡ください。
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              メールアドレス
            </th>
            <td className="py-3">info@hitoonstore.com</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              運営統括責任者
            </th>
            <td className="py-3">井手 恭一郎</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b border-gray-700">
            <th className="w-1/3 py-3 pr-4 text-left align-top text-gray-300">
              販売価格
            </th>
            <td className="py-3">
              各デジタルグッズ詳細ページに表示された価格（消費税込）に基づきます。
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              商品代金以外に必要な料金
            </th>
            <td className="py-3">
              <strong>インターネット接続料金・通信料金:</strong>{' '}
              お客様がご利用の通信契約に基づきます。
              <br />
              <strong>決済手数料:</strong>{' '}
              原則無料ですが、一部の決済方法（コンビニ決済等）を選択された場合のみ、別途手数料が発生する場合があります（決済画面に表示されます）。
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              支払方法
            </th>
            <td className="py-3">
              クレジットカード決済（VISA / MasterCard / JCB / AMEX）
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">支払時期</th>
            <td className="py-3">商品購入手続き完了時に即時決済されます。</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              商品の引渡時期（役務の提供時期）
            </th>
            <td className="py-3">
              決済完了後、直ちにマイページ内の「コレクション（保有リスト）」に反映され、閲覧が可能となります。
            </td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="py-3 pr-4 text-left align-top text-gray-300">
              返品・キャンセルに関する特約
            </th>
            <td className="py-3">
              <strong>返品・交換について:</strong>{' '}
              取り扱う商品が「デジタルデータ（電磁的記録）」であり、決済完了と同時にコンテンツへのアクセス権が付与される性質上、購入手続き完了後のお客様都合による返品、キャンセル、返金は一切お受けできません。
              <br />
              <strong>欠陥・不具合について:</strong>{' '}
              システム上の不具合によりデジタルグッズが正常に閲覧できない場合に限り、正常なデータへの修正または利用権の再付与を行います。
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
