'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Check, Wallet, Minus, Plus } from 'lucide-react';
import { ArtistCard } from './artist-card';
import { RotatableCard } from './rotatable-card';
import { formatPrice } from '@/lib/utils/format';
import type { Rarity } from '@/types/card';

interface CardDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  card: {
    id: string;
    artistName: string;
    artistImageUrl: string;
    songTitle: string | null;
    rarity: Rarity;
    price: number;
    totalSupply: number | null;
    currentSupply: number;
  };
  isInCart: boolean;
  cartQuantity: number;
  onUpdateCart: (quantity: number) => void;
  onPurchase: (quantity: number) => void;
  isAuthenticated: boolean;
}

export function CardDetailDialog({
  isOpen,
  onClose,
  card,
  isInCart,
  cartQuantity,
  onUpdateCart,
  onPurchase,
  isAuthenticated,
}: CardDetailDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isSoldOut = card.totalSupply !== null && card.currentSupply >= card.totalSupply;

  const totalPrice = card.price * quantity;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset quantity when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(cartQuantity > 0 ? cartQuantity : 1);
    }
  }, [isOpen, cartQuantity]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Header - Fixed */}
      <div className="relative z-10 flex flex-shrink-0 items-center justify-between p-4">
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={24} />
        </button>
        {/* <RarityBadge rarity={card.rarity} /> */}
        {/* Spacer for alignment */}
        <div className="w-10" />
      </div>

      {/* Scrollable Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
        {/* 3D Card Container */}
        <RotatableCard className="flex min-h-[340px] items-center justify-center px-6 py-6">
          <ArtistCard
            artistName={card.artistName}
            artistImageUrl={card.artistImageUrl}
            songTitle={card.songTitle}
            rarity={card.rarity}
          />
        </RotatableCard>

        {/* Drag hint */}
        <div className="mb-4 text-center text-xs text-gray-500">スワイプでカードを回転</div>

        {/* Bottom Section */}
        <div className="p-4 pt-0">
          {/* Card Info */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{card.artistName}</h2>
                {card.songTitle && <p className="text-sm text-gray-400">{card.songTitle}</p>}
              </div>
              {card.totalSupply && (
                <p className="text-sm text-gray-500">
                  {card.currentSupply} / {card.totalSupply} sold
                </p>
              )}
            </div>
            {isSoldOut && <p className="mt-1 font-bold text-red-400">SOLD OUT</p>}
          </div>

          {!isSoldOut && (
            <>
              {/* Quantity Selector */}
              <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-700 bg-gray-800/80 p-3">
                <div>
                  <p className="text-lg font-bold text-white">{formatPrice(card.price)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-900 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded bg-gray-700 text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setQuantity(Math.max(1, Math.min(10, val)));
                      }
                    }}
                    className="h-8 w-12 border-none bg-transparent text-center text-lg font-bold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">合計</span>
                <p className="text-2xl font-bold text-blue-400">{formatPrice(totalPrice)}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Add/Update Cart Button */}
                <button
                  onClick={() => onUpdateCart(quantity)}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold transition-all ${
                    isInCart
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isInCart ? (
                    <>
                      <Check size={18} />
                      カートを更新 ({quantity}枚)
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      カートに追加 ({quantity}枚)
                    </>
                  )}
                </button>

                {/* Purchase Button */}
                <button
                  onClick={() => onPurchase(quantity)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-4 font-bold text-white transition-all hover:scale-[1.02] hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Wallet size={20} />
                  {isAuthenticated ? `${formatPrice(totalPrice)} で購入` : 'ログインして購入'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
