import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'ログイン / 新規登録',
  description: 'HITOONにログインまたは新規登録',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
