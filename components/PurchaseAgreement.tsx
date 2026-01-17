"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, X, CheckCircle, ExternalLink, Minus, Plus } from "lucide-react"; 

export default function PurchaseAgreement() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1); // 👈 数量管理

  // 数量の増減
  const increment = () => setQuantity(prev => Math.min(prev + 1, 10)); // 最大10枚まで
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handlePurchase = async () => {
    alert(`${quantity}枚分の決済（¥${quantity * 1000}）へ進みます`);
    setIsOpen(false);
  };

  // ▼ 初期表示（ボタンエリア）
  if (!isOpen) {
    return (
      <div className="space-y-4">
        {/* 数量セレクター */}
        <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-xl border border-slate-600">
          <span className="text-sm font-bold text-slate-300 pl-2">購入枚数</span>
          <div className="flex items-center gap-4 bg-slate-800 rounded-lg p-1">
            <button 
              onClick={decrement}
              className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600 transition disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="text-lg font-bold w-6 text-center text-white">{quantity}</span>
            <button 
              onClick={increment}
              className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50"
              disabled={quantity >= 10}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* 購入ボタン */}
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Wallet size={20} /> 購入へ進む (¥{(quantity * 1000).toLocaleString()})
        </button>
      </div>
    );
  }

  // ▼ モーダル表示
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        
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
          {/* 注文内容のサマリーを表示 */}
          <div className="mb-4 bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg flex justify-between items-center">
            <span className="text-sm text-blue-200">選択中のプラン</span>
            <span className="text-lg font-bold text-white">
              {quantity}枚 <span className="text-sm text-slate-400 mx-1">×</span> ¥1,000
            </span>
          </div>

          <div className="h-40 overflow-y-scroll bg-black/30 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 mb-6 leading-relaxed shadow-inner">
            <h4 className="font-bold text-white mb-3 sticky top-0 bg-slate-900/0 backdrop-blur-md">
              重要事項説明書
            </h4>
            <div className="space-y-4">
              <p><strong className="text-blue-400 block mb-1">1. 金融商品ではありません</strong>本パスは投資商品ではありません。</p>
              <p><strong className="text-blue-400 block mb-1">2. 元本保証はありません</strong>収益が購入額を下回る可能性があります。</p>
              <p><strong className="text-blue-400 block mb-1">3. 返金不可</strong>決済完了後のキャンセルはできません。</p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5 mt-1">
              <input
                id="agreement-checkbox"
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                className="w-5 h-5 border-slate-600 rounded bg-slate-800 text-blue-600 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <label htmlFor="agreement-checkbox" className="ml-3 text-sm font-medium text-slate-300 cursor-pointer select-none">
              上記重要事項および
              <Link 
                href="/terms" 
                target="_blank" 
                className="text-blue-400 hover:text-blue-300 hover:underline mx-1 inline-flex items-center gap-0.5"
                onClick={(e) => e.stopPropagation()} 
              >
                利用規約<ExternalLink size={12} />
              </Link>
              に同意し、申し込みます。
            </label>
          </div>

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
            {isAgreed ? `¥${(quantity * 1000).toLocaleString()} で決済する` : "同意して決済へ進む"}
          </button>
        </div>
      </div>
    </div>
  );
}
