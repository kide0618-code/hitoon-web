'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Wallet,
  X,
  CheckCircle,
  ExternalLink,
  Minus,
  Plus,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
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

export default function PurchaseAgreement({
  cardId,
  price,
  artistName,
  artistImageUrl,
  rarity,
  songTitle,
}: PurchaseAgreementProps) {
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
        <div className="flex items-center justify-between rounded-xl border border-gray-700 bg-gray-800/80 p-3">
          <span className="pl-2 text-sm font-bold text-gray-300">購入枚数</span>
          <div className="flex items-center gap-4 rounded-lg bg-gray-900 p-1">
            <button
              onClick={decrement}
              className="flex h-8 w-8 items-center justify-center rounded bg-gray-700 text-white transition hover:bg-gray-600 disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-lg font-bold text-white">{quantity}</span>
            <button
              onClick={increment}
              className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-50"
              disabled={quantity >= 10}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Purchase Button - Secondary outline style */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-blue-500 bg-transparent py-3 font-bold text-blue-400 transition-all hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Fully opaque backdrop - covers entire viewport */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
        }}
        onClick={() => !isLoading && setIsOpen(false)}
      />

      {/* Modal content */}
      <div className="animate-in fade-in zoom-in relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <ShieldCheck size={20} className="text-blue-400" />
            購入前の最終確認
          </h3>
          <button
            onClick={() => !isLoading && setIsOpen(false)}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto bg-gray-900 p-5">
          {/* Card Preview & Order Summary */}
          <div className="mb-5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-4">
            <div className="flex gap-4">
              {/* Card Preview - Using ArtistCard component */}
              <div className="w-24 flex-shrink-0 sm:w-28">
                <ArtistCard
                  artistName={artistName}
                  artistImageUrl={artistImageUrl}
                  rarity={rarity}
                  songTitle={songTitle}
                />
              </div>
              {/* Order Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="mb-1 truncate text-base font-bold text-white">{artistName}</p>
                {songTitle && <p className="mb-2 truncate text-xs text-gray-400">{songTitle}</p>}
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{quantity}枚</span>
                  <span className="text-gray-400">×</span>
                  <span className="text-blue-300">{formatPrice(price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Scrollable Area */}
          <div className="mb-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <CheckCircle size={16} className="text-blue-400" />
              確認事項
            </h4>
            <div className="h-32 overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-4 text-sm leading-relaxed text-gray-300">
              <div className="space-y-4">
                {/* <div>
                  <p className="mb-1 font-semibold text-blue-400">1. 金融商品ではありません</p>
                  <p className="text-gray-400">本パスは投資商品ではありません。</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-blue-400">2. 元本保証はありません</p>
                  <p className="text-gray-400">収益が購入額を下回る可能性があります。</p>
                </div> */}
                <div>
                  <p className="mb-1 font-semibold text-blue-400">1. 返金不可</p>
                  <p className="text-gray-400">決済完了後のキャンセルはできません。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-5 flex items-start rounded-xl border border-gray-700 bg-gray-800/50 p-3">
            <div className="mt-0.5 flex h-5 items-center">
              <input
                id="agreement-checkbox"
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                disabled={isLoading}
                className="h-5 w-5 cursor-pointer rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
            </div>
            <label
              htmlFor="agreement-checkbox"
              className="ml-3 cursor-pointer select-none text-sm leading-relaxed text-gray-300"
            >
              上記の確認事項および
              <Link
                href={ROUTES.TERMS}
                target="_blank"
                className="mx-1 inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 hover:underline"
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
            <div className="mb-4 rounded-xl border border-red-500/50 bg-red-900/50 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Total & Submit */}
          <div className="space-y-3">
            {/* Total Price Display */}
            <div className="flex items-center justify-between rounded-xl bg-gray-800 p-3">
              <span className="font-medium text-gray-400">お支払い合計</span>
              <span className="text-2xl font-bold text-white">{formatPrice(totalPrice)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePurchase}
              disabled={!isAgreed || isLoading}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-center font-bold text-white transition-all duration-200 ${
                isAgreed && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-500'
                  : 'cursor-not-allowed bg-gray-700 text-gray-500'
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
