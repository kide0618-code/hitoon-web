import { redirect } from 'next/navigation';

/**
 * Signup page redirects to unified login page.
 * Login and signup are now handled on the same page.
 */
export default function SignupPage() {
  redirect('/login');
}
