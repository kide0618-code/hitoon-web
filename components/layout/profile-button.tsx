'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Layers, User, Settings, ShoppingCart, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/cart-context';
import { CartDialog } from '@/components/cart/CartDialog';
import { ROUTES } from '@/constants/routes';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function ProfileButton() {
  const router = useRouter();
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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

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
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-800/80 animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-gray-800/80 animate-pulse" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          <Link
            href={ROUTES.LOGIN}
            className="w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all"
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
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2" ref={menuRef}>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
        <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
          {menuView === 'main' ? (
            <>
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-sm text-white truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <Link
                  href={ROUTES.COLLECTION}
                  onClick={() => { setIsOpen(false); setMenuView('main'); }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Layers size={16} />
                  コレクション
                </Link>
                <Link
                  href={ROUTES.SETTINGS}
                  onClick={() => { setIsOpen(false); setMenuView('main'); }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings size={16} />
                  アカウント設定
                </Link>
                <button
                  onClick={() => setMenuView('legal')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FileText size={16} />
                  <span className="flex-1 text-left">規約・ポリシー</span>
                  {/* <ChevronRight size={16} /> */}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  ログアウト
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-800">
                <button
                  onClick={() => setMenuView('main')}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                  戻る
                </button>
              </div>
              <div className="p-1">
                <Link
                  href={ROUTES.TERMS}
                  onClick={() => { setIsOpen(false); setMenuView('main'); }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FileText size={16} />
                  利用規約
                </Link>
                <Link
                  href={ROUTES.PRIVACY}
                  onClick={() => { setIsOpen(false); setMenuView('main'); }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FileText size={16} />
                  プライバシーポリシー
                </Link>
                <Link
                  href={ROUTES.TOKUSHOHO}
                  onClick={() => { setIsOpen(false); setMenuView('main'); }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
