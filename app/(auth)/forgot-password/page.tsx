import type { Metadata } from 'next';
import { ForgotPasswordForm } from './form';

export const metadata: Metadata = {
  title: 'パスワードをお忘れの方',
  description: 'パスワードリセットメールを送信',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
