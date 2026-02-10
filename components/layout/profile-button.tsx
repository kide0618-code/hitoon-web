'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut,
  Layers,
  User,
  Settings,
  ShoppingCart,
  FileText,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/cart-context';
import { CartDialog } from '@/components/cart/CartDialog';
import { ROUTES } from '@/constants/routes';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function ProfileButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'legal'>('main');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setMenuView('main');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-800/80" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-800/80" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 text-gray-400 backdrop-blur-sm transition-all hover:bg-gray-700/80 hover:text-white"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          <Link
            href={
              pathname && pathname !== '/'
                ? `${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`
                : ROUTES.LOGIN
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 text-gray-400 backdrop-blur-sm transition-all hover:bg-gray-700/80 hover:text-white"
          >
            <User size={20} />
          </Link>
        </div>
        <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </>
    );
  }

  // Logged in
  const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2" ref={menuRef}>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 text-gray-400 backdrop-blur-sm transition-all hover:bg-gray-700/80 hover:text-white"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg transition-transform hover:scale-110"
        >
          {userInitial}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
            {menuView === 'main' ? (
              <>
                <div className="border-b border-gray-800 px-4 py-3">
                  <p className="truncate text-sm text-white">{user.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    href={ROUTES.COLLECTION}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuView('main');
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Layers size={16} />
                    コレクション
                  </Link>
                  <Link
                    href={ROUTES.SETTINGS}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuView('main');
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Settings size={16} />
                    アカウント設定
                  </Link>
                  <button
                    onClick={() => setMenuView('legal')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <FileText size={16} />
                    <span className="flex-1 text-left">規約・ポリシー</span>
                    {/* <ChevronRight size={16} /> */}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <LogOut size={16} />
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-gray-800 px-4 py-3">
                  <button
                    onClick={() => setMenuView('main')}
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <ChevronLeft size={16} />
                    戻る
                  </button>
                </div>
                <div className="p-1">
                  <Link
                    href={ROUTES.TERMS}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuView('main');
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <FileText size={16} />
                    利用規約
                  </Link>
                  <Link
                    href={ROUTES.PRIVACY}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuView('main');
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <FileText size={16} />
                    プライバシーポリシー
                  </Link>
                  <Link
                    href={ROUTES.TOKUSHOHO}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuView('main');
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <FileText size={16} />
                    特定商取引法に基づく表示
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
