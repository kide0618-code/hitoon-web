'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  X,
  Minus,
  Plus,
  Trash2,
  Loader2,
  ShoppingCart,
  CheckCircle,
  ExternalLink,
  Wallet,
} from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { ArtistCard } from '@/components/cards/artist-card';
import { formatPrice } from '@/lib/utils/format';
import { ROUTES } from '@/constants/routes';
import type { CartItemWithCard } from '@/types/cart';

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartDialogItemProps {
  item: CartItemWithCard;
  onUpdateQuantity: (cardId: string, quantity: number) => Promise<void>;
  onRemove: (cardId: string) => Promise<void>;
  isDisabled: boolean;
}

function CartDialogItem({
  item,
  onUpdateQuantity,
  onRemove,
  isDisabled,
}: CartDialogItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10 || isUpdating) return;
    setIsUpdating(true);
    await onUpdateQuantity(item.cardId, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    await onRemove(item.cardId);
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-3 p-3 bg-gray-800/50 rounded-xl mb-3 border border-gray-700/50">
      {/* Mini card preview */}
      <div className="w-16 flex-shrink-0">
        <ArtistCard
          artistName={item.card.artist.name}
          artistImageUrl={item.card.visual.artistImageUrl}
          rarity={item.card.rarity}
          songTitle={item.card.visual.songTitle}
        />
      </div>

      {/* Info & controls */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">
          {item.card.artist.name}
        </p>
        {item.card.visual.songTitle && (
          <p className="text-gray-400 text-xs truncate">
            {item.card.visual.songTitle}
          </p>
        )}

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isDisabled || isUpdating || item.quantity <= 1}
            className="w-6 h-6 flex items-center justify-center rounded bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-bold w-5 text-center text-white">
            {isUpdating ? (
              <Loader2 size={12} className="animate-spin mx-auto" />
            ) : (
              item.quantity
            )}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isDisabled || isUpdating || item.quantity >= 10}
            className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Subtotal */}
        <p className="text-blue-400 font-bold text-sm mt-1">
          {formatPrice(item.card.price * item.quantity)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={handleRemove}
        disabled={isDisabled || isUpdating}
        className="self-start p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="削除"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function CartDialog({ isOpen, onClose }: CartDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isLoading } =
    useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset agreement when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsAgreed(false);
      setError(null);
    }
  }, [isOpen]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleCheckout = async () => {
    if (!isAgreed || items.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const res = await fetch(ROUTES.API.CHECKOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            cardId: item.cardId,
            quantity: item.quantity,
          })),
        }),
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
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    if (!isCheckingOut) {
      onClose();
    }
  };

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
      {/* Fully opaque backdrop */}
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
        onClick={handleClose}
      />

      {/* Dialog container */}
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0 bg-gray-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-400" />
            カート ({totalItems})
          </h2>
          <button
            onClick={handleClose}
            disabled={isCheckingOut}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-4 bg-gray-900">
          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : items.length === 0 ? (
            /* Empty cart */
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">カートは空です</p>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="mb-4">
                {items.map((item) => (
                  <CartDialogItem
                    key={item.cardId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    isDisabled={isCheckingOut}
                  />
                ))}
              </div>

              {/* Important notes */}
              <div className="mb-4">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-blue-400" />
                  重要事項説明書
                </h4>
                <div className="h-24 overflow-y-auto bg-gray-800 p-3 rounded-xl border border-gray-700 text-sm text-gray-300 leading-relaxed">
                  <div className="space-y-3">
                    <div>
                      <p className="text-blue-400 font-semibold mb-0.5">
                        1. 金融商品ではありません
                      </p>
                      <p className="text-gray-400 text-xs">
                        本パスは投資商品ではありません。
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-400 font-semibold mb-0.5">
                        2. 元本保証はありません
                      </p>
                      <p className="text-gray-400 text-xs">
                        収益が購入額を下回る可能性があります。
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-400 font-semibold mb-0.5">
                        3. 返金不可
                      </p>
                      <p className="text-gray-400 text-xs">
                        決済完了後のキャンセルはできません。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="flex items-start mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="cart-agreement-checkbox"
                    type="checkbox"
                    checked={isAgreed}
                    onChange={() => setIsAgreed(!isAgreed)}
                    disabled={isCheckingOut}
                    className="w-5 h-5 border-gray-600 rounded bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <label
                  htmlFor="cart-agreement-checkbox"
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

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-sm text-red-300">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer (sticky) */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-800 flex-shrink-0 bg-gray-900 space-y-3">
            {/* Total price display */}
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl">
              <span className="text-gray-400 font-medium">お支払い合計</span>
              <span className="text-2xl font-bold text-white">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Submit button */}
            <button
              onClick={handleCheckout}
              disabled={!isAgreed || isCheckingOut || items.length === 0}
              className={`w-full py-4 px-5 text-center text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                ${
                  isAgreed && !isCheckingOut
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/30'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isCheckingOut ? (
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
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
