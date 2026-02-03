'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, X, CheckCircle, ExternalLink, Minus, Plus, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { ROUTES } from '@/constants/routes';

interface PurchaseAgreementProps {
  cardId: string;
  price: number;
  artistName: string;
}

export default function PurchaseAgreement({ cardId, price, artistName }: PurchaseAgreementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = quantity * price;

  const increment = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(ROUTES.API.CHECKOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle 401 - redirect to login
        if (res.status === 401) {
          const currentPath = window.location.pathname;
          window.location.href = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(currentPath)}`;
          return;
        }
        throw new Error(data.error || '決済の準備に失敗しました');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setIsLoading(false);
    }
  };

  // Initial view (button area)
  if (!isOpen) {
    return (
      <div className="space-y-4">
        {/* Quantity Selector */}
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

        {/* Purchase Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Wallet size={20} /> 購入へ進む ({formatPrice(totalPrice)})
        </button>
      </div>
    );
  }

  // Modal view
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && setIsOpen(false)}
      />

      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-400" /> 購入前の最終確認
          </h3>
          <button
            onClick={() => !isLoading && setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-1"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-4 bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-200">アーティスト</span>
              <span className="font-bold text-white">{artistName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-200">選択中のプラン</span>
              <span className="text-lg font-bold text-white">
                {quantity}枚 <span className="text-sm text-slate-400 mx-1">×</span>{' '}
                {formatPrice(price)}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="h-40 overflow-y-scroll bg-black/30 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 mb-6 leading-relaxed shadow-inner">
            <h4 className="font-bold text-white mb-3 sticky top-0 bg-slate-900/0 backdrop-blur-md">
              重要事項説明書
            </h4>
            <div className="space-y-4">
              <p>
                <strong className="text-blue-400 block mb-1">1. 金融商品ではありません</strong>
                本パスは投資商品ではありません。
              </p>
              <p>
                <strong className="text-blue-400 block mb-1">2. 元本保証はありません</strong>
                収益が購入額を下回る可能性があります。
              </p>
              <p>
                <strong className="text-blue-400 block mb-1">3. 返金不可</strong>
                決済完了後のキャンセルはできません。
              </p>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5 mt-1">
              <input
                id="agreement-checkbox"
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                disabled={isLoading}
                className="w-5 h-5 border-slate-600 rounded bg-slate-800 text-blue-600 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <label
              htmlFor="agreement-checkbox"
              className="ml-3 text-sm font-medium text-slate-300 cursor-pointer select-none"
            >
              上記重要事項および
              <Link
                href={ROUTES.TERMS}
                target="_blank"
                className="text-blue-400 hover:text-blue-300 hover:underline mx-1 inline-flex items-center gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                利用規約
                <ExternalLink size={12} />
              </Link>
              に同意し、申し込みます。
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handlePurchase}
            disabled={!isAgreed || isLoading}
            className={`w-full py-4 px-5 text-center text-white font-bold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2
              ${
                isAgreed && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transform hover:-translate-y-0.5 shadow-blue-900/40'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                処理中...
              </>
            ) : isAgreed ? (
              `${formatPrice(totalPrice)} で決済する`
            ) : (
              '同意して決済へ進む'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
