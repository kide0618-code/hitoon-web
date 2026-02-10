'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { localizeAuthError } from '@/lib/utils/auth-errors';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? localizeAuthError(err.message)
          : 'パスワードリセットメールの送信に失敗しました',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-white">メールを送信しました</h1>
        <p className="mb-8 text-gray-400">
          <span className="font-medium text-white">{email}</span>
          <br />
          宛にパスワードリセット用のリンクを送信しました。
          <br />
          メールに記載されたリンクをクリックして、新しいパスワードを設定してください。
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            ログインページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">パスワードをお忘れの方</h1>
        <p className="text-gray-400">
          登録したメールアドレスを入力してください。
          <br />
          パスワードリセット用のリンクをお送りします。
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3.5 pl-12 pr-4 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
          リセットメールを送信
        </Button>
      </form>

      {/* Back to Login */}
      <p className="mt-6 text-center">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          ログインに戻る
        </Link>
      </p>
    </div>
  );
}
