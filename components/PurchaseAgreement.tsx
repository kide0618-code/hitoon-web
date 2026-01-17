"use client";

import { useState } from "react";

export default function PurchaseAgreement() {
  const [isAgreed, setIsAgreed] = useState(false);

  const handlePurchase = async () => {
    // ここにStripe決済ページへの遷移やAPIコールを書く
    // 例: router.push('/api/checkout_session?price_id=...')
    console.log("Stripe決済へ進みます");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        購入前の重要事項確認
      </h3>

      {/* 重要事項説明書（スクロールエリア） */}
      <div className="h-48 overflow-y-scroll bg-gray-50 p-4 rounded-md border border-gray-300 text-sm text-gray-600 mb-6">
        <h4 className="font-bold text-gray-800 mb-2">
          必ずお読みください
        </h4>
        
        <p className="mb-3">
          <strong>1. 金融商品ではありません</strong><br />
          本パスは、金融商品取引法上の有価証券（投資信託等）ではありません。アーティストから特定の楽曲に関する将来の収益受領権を譲り受ける「債権譲渡契約」です。
        </p>

        <p className="mb-3">
          <strong>2. 元本保証はありません</strong><br />
          楽曲の再生実績により、収益分配額が購入金額を下回る、または0円となる可能性があります。いかなる場合も元本の返還・保証は行いません。
        </p>

        <p className="mb-3">
          <strong>3. 「労働」ではありません</strong><br />
          本サービスにおけるユーザーの活動（再生・拡散等）は、ユーザー自身が保有する権利価値を向上させるための「任意の資産管理行為」であり、雇用や業務委託に基づく「労働」ではありません。
        </p>

        <p className="mb-3">
          <strong>4. クーリングオフ適用外</strong><br />
          本取引はデジタルコンテンツおよび権利の販売であるため、特定商取引法に基づくクーリングオフ制度の対象外となります。決済完了後のキャンセルはできません。
        </p>
        
        <p className="text-xs text-gray-400 mt-4">
          最終更新日: 2026年1月17日
        </p>
      </div>

      {/* チェックボックス */}
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="agreement"
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 cursor-pointer"
          />
        </div>
        <label
          htmlFor="agreement"
          className="ml-3 text-sm font-medium text-gray-900 cursor-pointer select-none"
        >
          上記重要事項および
          <a href="/terms" target="_blank" className="text-blue-600 hover:underline mx-1">
            利用規約
          </a>
          に同意し、本取引が投資商品ではないことを理解した上で申し込みます。
        </label>
      </div>

      {/* 購入ボタン */}
      <button
        onClick={handlePurchase}
        disabled={!isAgreed}
        className={`w-full py-3 px-5 text-center text-white font-bold rounded-lg transition-all duration-200
          ${
            isAgreed
              ? "bg-blue-600 hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5"
              : "bg-gray-400 cursor-not-allowed opacity-70"
          }`}
      >
        決済へ進む (¥1,000)
      </button>
      
      <p className="text-xs text-center text-gray-500 mt-3">
        Powered by Stripe Secure Payment
      </p>
    </div>
  );
}
