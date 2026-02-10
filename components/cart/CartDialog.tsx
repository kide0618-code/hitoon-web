'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { CartContent } from '@/components/cart/cart-content';

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDialog({ isOpen, onClose }: CartDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleClose = () => {
    onClose();
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="animate-in fade-in zoom-in relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl duration-200">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-blue-500" />
            <h2 className="text-2xl font-bold">Cart</h2>
            {totalItems > 0 && <span className="text-sm text-gray-500">{totalItems} items</span>}
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable content - same UI as cart page */}
        <div className="flex-1 overflow-y-auto">
          <CartContent onClose={handleClose} />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
