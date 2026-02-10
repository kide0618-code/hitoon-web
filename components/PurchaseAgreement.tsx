'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Wallet, X, CheckCircle, ExternalLink, Minus, Plus, Loader2, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import { ROUTES } from '@/constants/routes';
import { ArtistCard } from '@/components/cards/artist-card';
import type { Rarity } from '@/types/card';

interface PurchaseAgreementProps {
  cardId: string;
  price: number;
  artistName: string;
  artistImageUrl: string;
  rarity: Rarity;
  songTitle?: string | null;
}

export default function PurchaseAgreement({ cardId, price, artistName, artistImageUrl, rarity, songTitle }: PurchaseAgreementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const totalPrice = quantity * price;

  // For portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

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
        <div className="flex items-center justify-between bg-gray-800/80 p-3 rounded-xl border border-gray-700">
          <span className="text-sm font-bold text-gray-300 pl-2">購入枚数</span>
          <div className="flex items-center gap-4 bg-gray-900 rounded-lg p-1">
            <button
              onClick={decrement}
              className="w-8 h-8 flex items-center justify-center rounded bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-50"
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

        {/* Purchase Button - Secondary outline style */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <Wallet size={20} /> 今すぐ購入 ({formatPrice(totalPrice)})
        </button>
      </div>
    );
  }

  // Modal view - use portal to render at body level
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
    >
      {/* Fully opaque backdrop - covers entire viewport */}
      <div
        className="absolute inset-0 bg-black"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundColor: '#000000' }}
        onClick={() => !isLoading && setIsOpen(false)}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-md mx-4 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-400" />
            購入前の最終確認
          </h3>
          <button
            onClick={() => !isLoading && setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 bg-gray-900 max-h-[80vh] overflow-y-auto">
          {/* Card Preview & Order Summary */}
          <div className="mb-5 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-4 rounded-xl">
            <div className="flex gap-4">
              {/* Card Preview - Using ArtistCard component */}
              <div className="w-24 sm:w-28 flex-shrink-0">
                <ArtistCard
                  artistName={artistName}
                  artistImageUrl={artistImageUrl}
                  rarity={rarity}
                  songTitle={songTitle}
                />
              </div>
              {/* Order Details */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <p className="text-white font-bold text-base mb-1 truncate">{artistName}</p>
                {songTitle && <p className="text-gray-400 text-xs mb-2 truncate">{songTitle}</p>}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-bold text-white">{quantity}枚</span>
                  <span className="text-gray-400">×</span>
                  <span className="text-blue-300">{formatPrice(price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Scrollable Area */}
          <div className="mb-5">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-blue-400" />
              重要事項説明書
            </h4>
            <div className="h-32 overflow-y-auto bg-gray-800 p-4 rounded-xl border border-gray-700 text-sm text-gray-300 leading-relaxed">
              <div className="space-y-4">
                <div>
                  <p className="text-blue-400 font-semibold mb-1">1. 金融商品ではありません</p>
                  <p className="text-gray-400">本パスは投資商品ではありません。</p>
                </div>
                <div>
                  <p className="text-blue-400 font-semibold mb-1">2. 元本保証はありません</p>
                  <p className="text-gray-400">収益が購入額を下回る可能性があります。</p>
                </div>
                <div>
                  <p className="text-blue-400 font-semibold mb-1">3. 返金不可</p>
                  <p className="text-gray-400">決済完了後のキャンセルはできません。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start mb-5 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="agreement-checkbox"
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                disabled={isLoading}
                className="w-5 h-5 border-gray-600 rounded bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <label
              htmlFor="agreement-checkbox"
              className="ml-3 text-sm text-gray-300 cursor-pointer select-none leading-relaxed"
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
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Total & Submit */}
          <div className="space-y-3">
            {/* Total Price Display */}
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl">
              <span className="text-gray-400 font-medium">お支払い合計</span>
              <span className="text-2xl font-bold text-white">{formatPrice(totalPrice)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePurchase}
              disabled={!isAgreed || isLoading}
              className={`w-full py-4 px-5 text-center text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                ${
                  isAgreed && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/30'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  処理中...
                </>
              ) : isAgreed ? (
                <>
                  <Wallet size={20} />
                  決済へ進む
                </>
              ) : (
                '上記に同意してください'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at body level, escaping any parent stacking contexts
  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
