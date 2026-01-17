"use client";

import { useState } from "react";
import { Wallet, X, CheckCircle } from "lucide-react"; 

export default function PurchaseAgreement() {
  // モーダルを開いているかどうかの状態
  const [isOpen, setIsOpen] = useState(false);
  // 同意チェックの状態
  const [isAgreed, setIsAgreed] = useState(false);

  const handlePurchase = async () => {
    // 決済処理（デモ）
    alert("Stripe決済画面へ遷移します（機能実装待ち）");
    setIsOpen(false); // 処理後に閉じる
  };

  // ▼ 初期状態：ただの購入ボタンを表示
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
      >
        <Wallet size={20} /> 公式パートナーパスを購入 (¥1,000)
      </button>
    );
  }

  // ▼ ボタンが押されたら：画面全体を覆うモーダルを表示
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景の黒いフィルター（クリックで閉じる） */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* モーダル本体 */}
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-400"/> 購入前の最終確認
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* 規約スクロールエリア */}
          <div className="h-48 overflow-y-scroll bg-black/30 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 mb-6 leading-relaxed shadow-inner">
            <h4 className="font-bold text-white mb-3 sticky top-0 bg-slate-900/0 backdrop-blur-md">
              重要事項説明書
            </h4>
            
            <div className="space-y-4">
              <p>
                <strong className="text-blue-400 block mb-1">1. 金融商品ではありません</strong>
                本パスは、金融商品取引法上の有価証券（投資信託等）ではありません。アーティストから特定の楽曲に関する将来の収益受領権を譲り受ける「債権譲渡契約」です。
              </p>
              <p>
                <strong className="text-blue-400 block mb-1">2. 元本保証はありません</strong>
                楽曲の再生実績により、収益分配額が購入金額を下回る、または0円となる可能性があります。いかなる場合も元本の返還・保証は行いません。
              </p>
              <p>
                <strong className="text-blue-400 block mb-1">3. 「労働」ではありません</strong>
                本サービスにおけるユーザーの活動は、自己資産の管理行為であり、雇用契約に基づく労働ではありません。
              </p>
              <p>
                <strong className="text-blue-400 block mb-1">4. 返金不可</strong>
                デジタルコンテンツの性質上、決済完了後のキャンセル・返金は一切できません。
              </p>
            </div>
          </div>

          {/* チェックボックス */}
          <div 
            className="flex items-start mb-6 group cursor-pointer p-2 rounded hover:bg-white/5 transition"
            onClick={() => setIsAgreed(!isAgreed)}
          >
            <div className="flex items-center h-5 mt-1">
              <input
                type="checkbox"
                checked={isAgreed}
                readOnly
                className="w-5 h-5 border-slate-600 rounded bg-slate-800 text-blue-600 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <label className="ml-3 text-sm font-medium text-slate-300 group-hover:text-white cursor-pointer select-none">
              上記重要事項に同意し、本取引が投資ではないことを理解した上で申し込みます。
            </label>
          </div>

          {/* 決済ボタン */}
          <button
            onClick={handlePurchase}
            disabled={!isAgreed}
            className={`w-full py-4 px-5 text-center text-white font-bold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2
              ${
                isAgreed
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transform hover:-translate-y-0.5 shadow-blue-900/40"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
          >
            {isAgreed ? "¥1,000 で決済する" : "同意して決済へ進む"}
          </button>
        </div>
      </div>
    </div>
  );
}
