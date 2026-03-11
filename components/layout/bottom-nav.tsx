'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Layers, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.HOME, icon: Home, label: 'Home' },
  { href: ROUTES.MARKET, icon: ShoppingBag, label: 'Store' },
  { href: ROUTES.COLLECTION, icon: Layers, label: 'Collection' },
  { href: '#', icon: ArrowLeftRight, label: 'Trade', disabled: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  const handleDisabledClick = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black">
        <div className="flex items-center justify-around p-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label, disabled }) => {
            if (disabled) {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={handleDisabledClick}
                  className="flex flex-col items-center p-2 text-gray-400"
                >
                  <Icon size={20} />
                  <span className="mt-1 text-[10px] font-bold">{label}</span>
                </button>
              );
            }

            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center p-2 transition-colors',
                  isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white',
                )}
              >
                <Icon size={20} />
                <span className="mt-1 text-[10px] font-bold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg">
          現在開発中です
        </div>
      )}
    </>
  );
}
