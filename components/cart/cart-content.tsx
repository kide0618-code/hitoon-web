'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Minus,
  Plus,
  Loader2,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import { ArtistCard } from '@/components/cards/artist-card';
import { useCart } from '@/contexts/cart-context';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/lib/utils/format';
import type { CartItemWithCard } from '@/types/cart';

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: {
  item: CartItemWithCard;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  isUpdating: boolean;
}) {
  const isSoldOut =
    item.card.totalSupply !== null && item.card.currentSupply >= item.card.totalSupply;

  return (
    <div className="rounded-xl border border-gray-800 bg-surface-raised p-4">
      <div className="flex gap-4">
        {/* Card Preview */}
        <Link href={ROUTES.ARTIST(item.card.artist.id)} className="w-24 flex-shrink-0 sm:w-28">
          <ArtistCard
            artistName={item.card.artist.name}
            artistImageUrl={
              item.card.cardImageUrl || 'https://placehold.co/120x160/1e293b/60a5fa?text=Card'
            }
            rarity={item.card.rarity}
            songTitle={item.card.songTitle}
          />
        </Link>

        {/* Card Info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold sm:text-base">{item.card.artist.name}</h3>
              {item.card.songTitle && (
                <p className="truncate text-xs text-gray-500">{item.card.songTitle}</p>
              )}
            </div>
            <button
              onClick={onRemove}
              disabled={isUpdating}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
              aria-label="Remove from cart"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {isSoldOut && <p className="mt-2 text-xs font-bold text-red-400">SOLD OUT</p>}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & Quantity */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-bold text-blue-400">{formatPrice(item.card.price)}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-1">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="flex h-7 w-7 items-center justify-center rounded bg-gray-700 text-white transition hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                min={1}
                max={10}
                value={item.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= 10) {
                    onUpdateQuantity(val);
                  }
                }}
                disabled={isUpdating || isSoldOut}
                className="h-7 w-10 border-none bg-transparent text-center text-sm font-bold text-white outline-none [appearance:textfield] disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                disabled={item.quantity >= 10 || isUpdating || isSoldOut}
                className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <p className="mt-2 text-right text-sm text-gray-400">
            小計: {formatPrice(item.card.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface CartContentProps {
  onClose?: () => void;
}

export function CartContent({ onClose }: CartContentProps = {}) {
  const { items, isLoading, totalItems, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();
  const [updatingCardId, setUpdatingCardId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleUpdateQuantity = async (cardId: string, quantity: number) => {
    setUpdatingCardId(cardId);
    await updateQuantity(cardId, quantity);
    setUpdatingCardId(null);
  };

  const handleRemove = async (cardId: string) => {
    setUpdatingCardId(cardId);
    await removeItem(cardId);
    setUpdatingCardId(null);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

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
      setCheckoutError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      {/* Cart Items */}
      <div className="space-y-4 p-4">
        {items.map((item) => (
          <CartItem
            key={item.cardId}
            item={item}
            onUpdateQuantity={(qty) => handleUpdateQuantity(item.cardId, qty)}
            onRemove={() => handleRemove(item.cardId)}
            isUpdating={updatingCardId === item.cardId}
          />
        ))}

        {items.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
            <p>カートは空です</p>
            <Link
              href={ROUTES.MARKET}
              className="mt-2 inline-block text-blue-400 hover:underline"
              onClick={onClose}
            >
              カードを探す →
            </Link>
          </div>
        )}
      </div>

      {/* Checkout Section */}
      {items.length > 0 && (
        <div className="p-4">
          {/* Clear Cart */}
          <div className="mb-3 flex justify-end">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 transition-colors hover:text-red-400"
            >
              カートを空にする
            </button>
          </div>

          {/* 確認事項 */}
          <div className="mb-4">
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 text-sm leading-relaxed text-gray-300">
              <div>
                <p className="mb-1 font-semibold text-blue-400">返金不可</p>
                <p className="text-gray-400">決済完了後のキャンセルはできません。</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mb-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">お支払い合計</span>
              <span className="text-2xl font-bold text-white">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Error */}
          {checkoutError && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-900/30 p-3 text-sm text-red-300">
              {checkoutError}
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-white transition-all ${
              !isCheckingOut
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-500'
                : 'cursor-not-allowed bg-gray-700 text-gray-500'
            }`}
          >
            {isCheckingOut ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <Wallet size={20} />
                決済へ進む
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
