'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Lock, Camera, Check, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

interface SettingsClientProps {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
  };
  providers: {
    email: boolean;
    google: boolean;
  };
}

export function SettingsClient({ user, providers }: SettingsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [displayName, setDisplayName] = useState(user.displayName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Email/Password state
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isEmailSaving, setIsEmailSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [emailMessage, setEmailMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [linkMessage, setLinkMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileMessage({ type: 'error', text: 'ファイルサイズは2MB以下にしてください' });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save profile (display name & avatar)
  const handleProfileSave = async () => {
    setIsProfileSaving(true);
    setProfileMessage(null);

    try {
      let newAvatarUrl = avatarUrl;

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(fileName);

        newAvatarUrl = `${publicUrl}?t=${Date.now()}`;
      }

      // Update profile (use update, not upsert - profile should exist from trigger)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('profiles') as any)
        .update({
          display_name: displayName || null,
          avatar_url: newAvatarUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      setProfileMessage({ type: 'success', text: 'プロフィールを更新しました' });
      router.refresh();
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'プロフィールの更新に失敗しました',
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Change email
  const handleEmailChange = async () => {
    if (!newEmail) return;

    setIsEmailSaving(true);
    setEmailMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      setEmailMessage({
        type: 'success',
        text: '確認メールを送信しました。メール内のリンクをクリックして変更を完了してください。',
      });
      setNewEmail('');
    } catch (error) {
      setEmailMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'メールアドレスの変更に失敗しました',
      });
    } finally {
      setIsEmailSaving(false);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'パスワードが一致しません' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'パスワードは6文字以上にしてください' });
      return;
    }

    setIsPasswordSaving(true);
    setPasswordMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'パスワードを変更しました' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'パスワードの変更に失敗しました',
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // Link Google account
  const handleLinkGoogle = async () => {
    setIsLinkingGoogle(true);
    setLinkMessage(null);

    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setLinkMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Googleアカウントの連携に失敗しました',
      });
      setIsLinkingGoogle(false);
    }
  };

  const displayAvatar = avatarPreview || avatarUrl;
  const userInitial =
    displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-800 bg-black/90 backdrop-blur-md">
        <div className="flex h-14 items-center px-4">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="ml-4 text-lg font-bold">アカウント設定</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 p-4">
        {/* Profile Section */}
        <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
          <div className="border-b border-gray-800 bg-gray-800/50 px-4 py-3">
            <h2 className="flex items-center gap-2 font-bold">
              <User size={18} className="text-blue-400" />
              プロフィール
            </h2>
          </div>

          <div className="space-y-4 p-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {displayAvatar ? (
                  <Image
                    src={displayAvatar}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full border-2 border-gray-700 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                    {userInitial}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-500"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">プロフィール画像</p>
                <p className="text-xs text-gray-500">2MB以下のJPG, PNG</p>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">表示名</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名を入力"
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Message */}
            {profileMessage && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  profileMessage.type === 'success'
                    ? 'border border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border border-red-500/50 bg-red-500/10 text-red-400'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <Check size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {profileMessage.text}
              </div>
            )}

            <Button onClick={handleProfileSave} isLoading={isProfileSaving} className="w-full">
              プロフィールを保存
            </Button>
          </div>
        </section>

        {/* Login Methods Section */}
        <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
          <div className="border-b border-gray-800 bg-gray-800/50 px-4 py-3">
            <h2 className="flex items-center gap-2 font-bold">
              <Lock size={18} className="text-blue-400" />
              ログイン方法
            </h2>
          </div>

          <div className="space-y-3 p-4">
            {/* Email Provider */}
            <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-gray-500">メールアドレス</p>
                </div>
              </div>
              {providers.email && (
                <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
                  有効
                </span>
              )}
            </div>

            {/* Google Provider */}
            <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
              <div className="flex items-center gap-3">
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
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-xs text-gray-500">Googleアカウント</p>
                </div>
              </div>
              {providers.google ? (
                <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
                  連携済み
                </span>
              ) : (
                <button
                  onClick={handleLinkGoogle}
                  disabled={isLinkingGoogle}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {isLinkingGoogle ? <Loader2 size={14} className="animate-spin" /> : '連携する'}
                </button>
              )}
            </div>

            {linkMessage && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  linkMessage.type === 'success'
                    ? 'border border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border border-red-500/50 bg-red-500/10 text-red-400'
                }`}
              >
                {linkMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                {linkMessage.text}
              </div>
            )}
          </div>
        </section>

        {/* Email Change Section (only for email providers) */}
        {providers.email && (
          <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
            <div className="border-b border-gray-800 bg-gray-800/50 px-4 py-3">
              <h2 className="flex items-center gap-2 font-bold">
                <Mail size={18} className="text-blue-400" />
                メールアドレスの変更
              </h2>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  新しいメールアドレス
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@example.com"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {emailMessage && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                    emailMessage.type === 'success'
                      ? 'border border-green-500/50 bg-green-500/10 text-green-400'
                      : 'border border-red-500/50 bg-red-500/10 text-red-400'
                  }`}
                >
                  {emailMessage.type === 'success' ? (
                    <Check size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {emailMessage.text}
                </div>
              )}

              <Button
                onClick={handleEmailChange}
                isLoading={isEmailSaving}
                disabled={!newEmail}
                className="w-full"
              >
                メールアドレスを変更
              </Button>
            </div>
          </section>
        )}

        {/* Password Change Section (only for email providers) */}
        {providers.email && (
          <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
            <div className="border-b border-gray-800 bg-gray-800/50 px-4 py-3">
              <h2 className="flex items-center gap-2 font-bold">
                <Lock size={18} className="text-blue-400" />
                パスワードの変更
              </h2>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6文字以上"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  新しいパスワード（確認）
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="パスワードを再入力"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {passwordMessage && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                    passwordMessage.type === 'success'
                      ? 'border border-green-500/50 bg-green-500/10 text-green-400'
                      : 'border border-red-500/50 bg-red-500/10 text-red-400'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <Check size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <Button
                onClick={handlePasswordChange}
                isLoading={isPasswordSaving}
                disabled={!newPassword || !confirmPassword}
                className="w-full"
              >
                パスワードを変更
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
