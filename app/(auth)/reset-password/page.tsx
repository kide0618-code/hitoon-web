import type { Metadata } from 'next';
import { ResetPasswordForm } from './form';

export const metadata: Metadata = {
  title: '新しいパスワードを設定',
  description: '新しいパスワードを設定してください',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
