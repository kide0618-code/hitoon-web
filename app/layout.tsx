import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
// アイコンをインポート（Ranking用のアイコンは削除し、Collection用のLayersを追加）
import { Home, ShoppingBag, Layers, User } from 'lucide-react'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HITOON',
  description: 'Music Asset Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* メインコンテンツ */}
        <main className="pb-20">
          {children}
        </main>

        {/* ▼▼ ここが下のメニューバーの設定です ▼▼ */}
        <nav className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 z-50">
          <div className="flex justify-around items-center p-2">
            
            {/* 1. ホーム */}
            <Link href="/" className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors">
              <Home size={20} />
              <span className="text-[10px] font-bold mt-1">Home</span>
            </Link>

            {/* 2. ストア (Market) */}
            <Link href="/market" className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              <span className="text-[10px] font-bold mt-1">Store</span>
            </Link>

            {/* 3. コレクション (旧 Activity) */}
            {/* ここを Activity から Collection に変更しました */}
            <Link href="/activity" className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors">
              <Layers size={20} />
              <span className="text-[10px] font-bold mt-1">Collection</span>
            </Link>

            {/* 4. マイページ (Profile) */}
            {/* もしプロフィール機能を使わないなら、このブロックごと削除してもOKです */}
            {/* <Link href="/profile" className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors">
              <User size={20} />
              <span className="text-[10px] font-bold mt-1">My Page</span>
            </Link> */}
            
            {/* ※ Rankingボタンは削除しました */}
          </div>
        </nav>
      </body>
    </html>
  );
}
