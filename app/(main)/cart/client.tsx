'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { useCart } from '@/contexts/cart-context';
import { CartContent } from '@/components/cart/cart-content';

export function CartPageClient() {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <PageContainer>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-800 bg-gray-900 p-6">
        <button
          onClick={() => router.back()}
          className="mr-2 rounded-lg p-1 transition-colors hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <ShoppingCart className="text-blue-500" />
        <h1 className="text-2xl font-bold">Cart</h1>
        {totalItems > 0 && (
          <span className="ml-auto text-sm text-gray-500">{totalItems} items</span>
        )}
      </div>

      <CartContent />
    </PageContainer>
  );
}
