'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useIsOperator } from '@/hooks/use-auth';

/**
 * User menu component for header
 * Shows login button or user dropdown
 */
export function UserMenu() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isOperator } = useIsOperator();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-800" />;
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
      >
        <User size={16} />
        ログイン
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-800"
      >
        {user?.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-sm font-medium text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 py-2 shadow-xl">
            {/* User info */}
            <div className="border-b border-gray-800 px-4 py-2">
              <p className="truncate text-sm font-medium text-white">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {isOperator && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
                >
                  <Shield size={16} />
                  管理画面
                </Link>
              )}
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
              >
                <Settings size={16} />
                設定
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-gray-800"
              >
                <LogOut size={16} />
                ログアウト
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
