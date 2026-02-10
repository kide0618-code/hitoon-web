'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // User should have a session after clicking the recovery link
      setIsValidSession(!!session);
    };

    checkSession();

    // Listen for auth state changes (recovery link sets up a session)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        <Loader2 size={32} className="mx-auto animate-spin text-gray-400" />
        <p className="mt-4 text-gray-400">読み込み中...</p>
      </div>
    );
  }

  // Show error if no valid session
  if (isValidSession === false) {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle size={32} className="text-red-400" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-white">リンクが無効です</h1>
        <p className="mb-8 text-gray-400">
          パスワードリセットのリンクが無効または期限切れです。
          <br />
          もう一度パスワードリセットをお試しください。
        </p>
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
        >
          パスワードリセットを再送信
        </Link>
      </div>
    );
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-white">パスワードを更新しました</h1>
        <p className="mb-8 text-gray-400">
          新しいパスワードが設定されました。
          <br />
          ログインページへ自動的に移動します...
        </p>
        <Link href={ROUTES.LOGIN} className="inline-block text-blue-400 hover:text-blue-300">
          今すぐログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">新しいパスワードを設定</h1>
        <p className="text-gray-400">新しいパスワードを入力してください。</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
            新しいパスワード
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
              minLength={8}
              placeholder="8文字以上"
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3.5 pl-12 pr-12 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 transition-colors hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-300">
            パスワード（確認）
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 flex items-center">
              <Lock className="h-5 w-5 text-gray-400" />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="パスワードを再入力"
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3.5 pl-12 pr-12 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-gray-400 transition-colors hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <p className="text-xs text-gray-500">※ パスワードは8文字以上で設定してください</p>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
          パスワードを更新
        </Button>
      </form>

      {/* Back to Login */}
      <p className="mt-6 text-center">
        <Link href={ROUTES.LOGIN} className="text-gray-400 transition-colors hover:text-white">
          ログインページに戻る
        </Link>
      </p>
    </div>
  );
}
