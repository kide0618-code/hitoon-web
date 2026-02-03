'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { RarityBadge } from '@/components/cards/rarity-badge';
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
    item.card.totalSupply !== null &&
    item.card.currentSupply >= item.card.totalSupply;

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex gap-4">
        {/* Card Image */}
        <Link
          href={ROUTES.ARTIST(item.card.artist.id)}
          className="flex-shrink-0"
        >
          <img
            src={
              item.card.visual.artistImageUrl ||
              'https://placehold.co/120x160/1e293b/60a5fa?text=Card'
            }
            alt={item.card.name}
            className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-lg border border-gray-700"
          />
        </Link>

        {/* Card Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base truncate">
                {item.card.artist.name}
              </h3>
              {item.card.visual.songTitle && (
                <p className="text-xs text-gray-500 truncate">
                  {item.card.visual.songTitle}
                </p>
              )}
              <div className="mt-1">
                <RarityBadge rarity={item.card.rarity} />
              </div>
            </div>
            <button
              onClick={onRemove}
              disabled={isUpdating}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
              aria-label="Remove from cart"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {isSoldOut && (
            <p className="text-xs text-red-400 font-bold mt-2">SOLD OUT</p>
          )}

          {/* Price & Quantity */}
          <div className="flex items-center justify-between mt-3">
            <p className="font-bold text-blue-400">
              {formatPrice(item.card.price)}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                disabled={item.quantity >= 10 || isUpdating || isSoldOut}
                className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <p className="text-right text-sm text-gray-400 mt-2">
            小計: {formatPrice(item.card.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CartPageClient() {
  const router = useRouter();
  const {
    items,
    isLoading,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
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
          router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CART)}`);
          return;
        }
        throw new Error(data.error || '決済の準備に失敗しました');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : '予期せぬエラーが発生しました'
      );
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center gap-3 sticky top-0 z-10">
          <ShoppingCart className="text-blue-500" />
          <h1 className="text-2xl font-bold">Cart</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="mr-2 p-1 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <ShoppingCart className="text-blue-500" />
        <h1 className="text-2xl font-bold">Cart</h1>
        {totalItems > 0 && (
          <span className="text-gray-500 text-sm ml-auto">
            {totalItems} items
          </span>
        )}
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
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
          <div className="text-center py-20 text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
            <p>カートは空です</p>
            <Link
              href={ROUTES.MARKET}
              className="text-blue-400 hover:underline mt-2 inline-block"
            >
              カードを探す →
            </Link>
          </div>
        )}
      </div>

      {/* Checkout Section */}
      {items.length > 0 && (
        <div className="sticky bottom-20 p-4 bg-gradient-to-t from-black via-black to-transparent pt-8">
          {/* Clear Cart */}
          <div className="flex justify-end mb-3">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              カートを空にする
            </button>
          </div>

          {/* Total */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">合計 ({totalItems} items)</span>
              <span className="text-xl font-bold text-white">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Error */}
          {checkoutError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-red-300">
              {checkoutError}
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || items.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isCheckingOut ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <ShoppingBag size={20} />
                {formatPrice(totalPrice)} で購入へ進む
              </>
            )}
          </button>
        </div>
      )}
    </PageContainer>
  );
}
