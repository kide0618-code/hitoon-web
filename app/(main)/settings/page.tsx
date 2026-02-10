import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants/routes';
import { SettingsClient } from './client';

export const metadata: Metadata = {
  title: 'アカウント設定',
  description: 'アカウント設定を変更',
};

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Get profile data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileData } = await (supabase.from('profiles') as any)
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single();

  const profile = profileData as { display_name: string | null; avatar_url: string | null } | null;

  // Check login providers
  const providers = user.app_metadata?.providers as string[] | undefined;
  const provider = user.app_metadata?.provider as string | undefined;

  const hasEmailProvider = Boolean(providers?.includes('email') || (user.email && !provider));
  const hasGoogleProvider = Boolean(providers?.includes('google') || provider === 'google');

  return (
    <SettingsClient
      user={{
        id: user.id,
        email: user.email || '',
        displayName: profile?.display_name || '',
        avatarUrl: profile?.avatar_url || '',
      }}
      providers={{
        email: hasEmailProvider,
        google: hasGoogleProvider,
      }}
    />
  );
}
