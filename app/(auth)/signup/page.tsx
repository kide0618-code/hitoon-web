import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: '新規登録',
  description: 'HITOONに新規登録',
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
