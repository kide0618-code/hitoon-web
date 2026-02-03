'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Layers } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.HOME, icon: Home, label: 'Home' },
  { href: ROUTES.MARKET, icon: ShoppingBag, label: 'Store' },
  { href: ROUTES.COLLECTION, icon: Layers, label: 'Collection' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 z-50">
      <div className="flex justify-around items-center p-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center p-2 transition-colors',
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
