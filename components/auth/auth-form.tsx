'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { localizeAuthError } from '@/lib/utils/auth-errors';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const REDIRECT_STORAGE_KEY = 'hitoon_auth_redirect';

function getStoredRedirect(): string {
  if (typeof window === 'undefined') return '/';
  try {
    return sessionStorage.getItem(REDIRECT_STORAGE_KEY) || '/';
  } catch {
    return '/';
  }
}

function storeRedirect(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(REDIRECT_STORAGE_KEY, path);
  } catch {
    // sessionStorage disabled
  }
}

function clearStoredRedirect(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || getStoredRedirect();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const initialError = searchParams.get('error');
  const [error, setError] = useState<string | null>(
    initialError ? localizeAuthError(initialError) : null,
  );
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. まずログインを試行
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!loginError) {
        // ログイン成功
        clearStoredRedirect();
        router.push(redirectTo);
        router.refresh();
        return;
      }

      // 2. ログイン失敗 → 新規登録を試行
      storeRedirect(redirectTo);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) throw signUpError;

      // ユーザーが既に存在する場合（identitiesが空）
      if (signUpData.user && signUpData.user.identities?.length === 0) {
        setError('メールアドレスまたはパスワードが正しくありません');
        return;
      }

      // 新規登録成功 → 確認メール送信
      setMessage(
        '確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? localizeAuthError(err.message)
          : 'エラーが発生しました',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      storeRedirect(redirectTo);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? localizeAuthError(err.message) : 'Google認証に失敗しました');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          ログイン / 新規登録
        </h1>
        {/* <p className="text-gray-400">
          HITOONへようこそ
        </p> */}
      </div>

      {/* Error/Message Display */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-xl border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-400">
          {message}
        </div>
      )}

      {/* Google Auth */}
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isGoogleLoading || isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 font-semibold text-gray-800 shadow-lg transition-all hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Googleで続ける
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 border-t border-gray-800" />
        <span className="text-sm text-gray-500">または</span>
        <div className="flex-1 border-t border-gray-800" />
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
            メールアドレス
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 flex items-center">
              <Mail className="h-5 w-5 text-gray-400" />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3.5 pl-12 pr-4 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&:-webkit-autofill]:bg-gray-800/50 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
            パスワード
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 flex items-center">
              <Lock className="h-5 w-5 text-gray-400" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6文字以上"
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3.5 pl-12 pr-12 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&:-webkit-autofill]:bg-gray-800/50 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 flex items-center text-gray-400 transition-colors hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            パスワードをお忘れですか？
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isGoogleLoading}
          className="w-full"
        >
          ログイン / 新規登録
        </Button>
      </form>

      {/* <p className="mt-6 text-center text-sm text-gray-500">
        アカウントが存在しない場合は自動的に新規登録されます
      </p> */}

      <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
        アカウント登録することで、
        <Link
          href={ROUTES.TERMS}
          target="_blank"
          className="text-blue-400 hover:text-blue-300 hover:underline"
        >
          利用規約
        </Link>
        および
        <Link
          href={ROUTES.PRIVACY}
          target="_blank"
          className="text-blue-400 hover:text-blue-300 hover:underline"
        >
          プライバシーポリシー
        </Link>
        に同意したことになります。
      </p>
    </div>
  );
}
