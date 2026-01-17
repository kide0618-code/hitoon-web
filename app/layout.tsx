import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
// User アイコンを追加しました
import { LayoutDashboard, Search, Megaphone, Trophy, User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HITOON",
  description: "Promote your favorite music.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-2xl tracking-tighter">HITOON</Link>
            <nav className="flex gap-1 md:gap-4">
              <Link href="/" className="p-2 text-slate-400 hover:text-white flex flex-col items-center text-[10px] md:text-sm">
                <LayoutDashboard size={20} /><span>ホーム</span>
              </Link>
              <Link href="/market" className="p-2 text-slate-400 hover:text-white flex flex-col items-center text-[10px] md:text-sm">
                <Search size={20} /><span>探す</span>
              </Link>
              <Link href="/ranking" className="p-2 text-slate-400 hover:text-white flex flex-col items-center text-[10px] md:text-sm">
                <Trophy size={20} /><span>ランク</span>
              </Link>
              <Link href="/activity" className="p-2 text-blue-400 hover:text-blue-300 flex flex-col items-center text-[10px] md:text-sm font-bold">
                <Megaphone size={20} /><span>活動</span>
              </Link>
              <Link href="/profile" className="p-2 text-slate-400 hover:text-white flex flex-col items-center text-[10px] md:text-sm">
                <User size={20} /><span>マイページ</span>
              </Link>
            </nav>
          </div>
        </header>
        <div className="pt-20 pb-24 max-w-4xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
