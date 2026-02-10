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
    return (
      <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-500 transition-colors"
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
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800 transition-colors"
      >
        {user?.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 py-2 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50">
            {/* User info */}
            <div className="px-4 py-2 border-b border-gray-800">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {isOperator && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Shield size={16} />
                  管理画面
                </Link>
              )}
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Settings size={16} />
                設定
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
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
