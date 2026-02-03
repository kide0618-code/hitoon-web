import type { Metadata } from 'next';
import { CartPageClient } from './client';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'ショッピングカート',
};

export default function CartPage() {
  return <CartPageClient />;
}
