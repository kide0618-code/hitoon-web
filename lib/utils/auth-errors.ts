/**
 * Localized auth error messages.
 * Maps Supabase Auth error messages to translations by language.
 * Falls back to Japanese ('ja') if browser language is not supported.
 */

type ErrorMap = Record<string, string>;

const ja: ErrorMap = {
  'Invalid login credentials': 'メールアドレスまたはパスワードが正しくありません',
  'Email not confirmed': 'メールアドレスが確認されていません。確認メールをご確認ください',
  'User already registered': 'このメールアドレスは既に登録されています',
  'Password should be at least 6 characters': 'パスワードは6文字以上で入力してください',
  'Signup requires a valid password': '有効なパスワードを入力してください',
  'Unable to validate email address: invalid format': 'メールアドレスの形式が正しくありません',
  'Email rate limit exceeded': 'メール送信の制限に達しました。しばらく経ってからお試しください',
  'User not found': 'ユーザーが見つかりません',
  'New password should be different from the old password.':
    '新しいパスワードは現在のパスワードと異なるものにしてください',
  'Auth session missing!': 'セッションが切れました。再度ログインしてください',
  'Token has expired or is invalid': 'リンクの有効期限が切れています。再度お試しください',
  'Email link is invalid or has expired':
    'メールリンクが無効または有効期限切れです。再度お試しください',
};

const en: ErrorMap = {
  // English messages are already in English from Supabase, so pass through.
  // Only override if we want friendlier wording.
  'Invalid login credentials': 'Incorrect email or password',
};

const translations: Record<string, ErrorMap> = { ja, en };

function getBrowserLang(): string {
  if (typeof navigator === 'undefined') return 'ja';
  const lang = navigator.language || 'ja';
  return lang.split('-')[0] || 'ja';
}

/**
 * Translate a Supabase auth error message based on the browser language.
 * - Checks exact match first, then case-insensitive substring match.
 * - Falls back to Japanese if the language is unsupported.
 * - Returns the original message if no translation is found (for English browsers).
 */
export function localizeAuthError(message: string): string {
  const lang = getBrowserLang();
  const map = translations[lang];

  // For unsupported languages, use Japanese
  if (!map) {
    return ja[message] || matchPartial(ja, message) || message;
  }

  // For Japanese, always translate
  if (lang === 'ja') {
    return ja[message] || matchPartial(ja, message) || message;
  }

  // For English, use friendlier wording if available, otherwise pass through
  return en[message] || message;
}

/**
 * Try partial matching for errors that contain dynamic parts
 * e.g. "For security purposes, you can only request this after 59 seconds"
 */
function matchPartial(map: ErrorMap, message: string): string | null {
  const lower = message.toLowerCase();

  if (lower.includes('security purposes') && lower.includes('after')) {
    return 'セキュリティのため、しばらく経ってから再度お試しください';
  }
  if (lower.includes('rate limit')) {
    return 'リクエストの制限に達しました。しばらく経ってからお試しください';
  }
  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return map['User already registered'] || null;
  }

  return null;
}
