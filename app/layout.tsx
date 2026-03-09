import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { APP_CONFIG } from '@/constants/config';
import { CartProvider } from '@/contexts/cart-context';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description:
    'HITOONは、アーティストのデジタルトレーディングカードを購入・コレクションできるプラットフォームです。限定コンテンツや特別なカードを通じて、音楽を一生モノにする体験を提供します。',
  metadataBase: new URL(APP_CONFIG.url),
  keywords: [
    'デジタルトレカ',
    'アーティストカード',
    'デジタルコレクション',
    '音楽カード',
    'トレーディングカード',
    '限定コンテンツ',
    'HITOON',
    'アーティストグッズ',
    'デジタルグッズ',
    'ミュージックカード',
  ],
  openGraph: {
    title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    description:
      'アーティストのデジタルトレーディングカードを購入・コレクション。限定コンテンツで音楽を一生モノに。',
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    description:
      'アーティストのデジタルトレーディングカードを購入・コレクション。限定コンテンツで音楽を一生モノに。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_CONFIG.url,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="bg-black font-sans text-white antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
