import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'ログイン',
  description: 'HITOONにログイン',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
