"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart, Check, Wallet, Minus, Plus } from "lucide-react";
import { ArtistCard } from "./artist-card";
import { RarityBadge } from "./rarity-badge";
import { formatPrice } from "@/lib/utils/format";
import type { Rarity } from "@/types/card";

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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startRotation = useRef({ x: 0, y: 0 });

  const isSoldOut =
    card.totalSupply !== null && card.currentSupply >= card.totalSupply;

  const totalPrice = card.price * quantity;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset rotation and quantity when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRotation({ x: 0, y: 0 });
      setQuantity(cartQuantity > 0 ? cartQuantity : 1);
    }
  }, [isOpen, cartQuantity]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      startPos.current = { x: clientX, y: clientY };
      startRotation.current = { ...rotation };
    },
    [rotation],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const deltaX = clientX - startPos.current.x;
      const deltaY = clientY - startPos.current.y;

      // Rotate Y based on horizontal movement, X based on vertical movement
      const newRotationY = startRotation.current.y + deltaX * 0.5;
      const newRotationX = startRotation.current.x - deltaY * 0.3;

      // Clamp X rotation to prevent flipping too far
      const clampedX = Math.max(-30, Math.min(30, newRotationX));

      setRotation({
        x: clampedX,
        y: newRotationY,
      });
    },
    [isDragging],
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Header - Fixed */}
      <div className="relative z-10 flex items-center justify-between p-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <X size={24} />
        </button>
        {/* <RarityBadge rarity={card.rarity} /> */}
        {/* Spacer for alignment */}
        <div className="w-10" />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        {/* 3D Card Container */}
        <div
          className="flex items-center justify-center px-6 py-6 select-none min-h-[340px]"
          style={{ perspective: "1000px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={cardRef}
            className="w-full max-w-[260px] sm:max-w-sm transition-transform cursor-grab active:cursor-grabbing"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: "preserve-3d",
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          >
            <ArtistCard
              artistName={card.artistName}
              artistImageUrl={card.artistImageUrl}
              songTitle={card.songTitle}
              rarity={card.rarity}
            />
          </div>
        </div>

        {/* Drag hint */}
        <div className="text-center text-gray-500 text-xs mb-4">
          スワイプでカードを回転
        </div>

        {/* Bottom Section */}
        <div className="p-4 pt-0">
        {/* Card Info */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {card.artistName}
              </h2>
              {card.songTitle && (
                <p className="text-sm text-gray-400">{card.songTitle}</p>
              )}
            </div>
            {card.totalSupply && (
              <p className="text-sm text-gray-500">
                {card.currentSupply} / {card.totalSupply} sold
              </p>
            )}
          </div>
          {isSoldOut && <p className="text-red-400 font-bold mt-1">SOLD OUT</p>}
        </div>

        {!isSoldOut && (
          <>
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-800/80 p-3 rounded-xl border border-gray-700 mb-4">
              <div>
                <p className="text-lg font-bold text-white">
                  {formatPrice(card.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-12 h-8 text-center text-lg font-bold text-white bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">合計</span>
              <p className="text-2xl font-bold text-blue-400">
                {formatPrice(totalPrice)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add/Update Cart Button */}
              <button
                onClick={() => onUpdateCart(quantity)}
                className={`w-full font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all ${
                  isInCart
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Wallet size={20} />
                {isAuthenticated
                  ? `${formatPrice(totalPrice)} で購入`
                  : "ログインして購入"}
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
