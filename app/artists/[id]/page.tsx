'use client';

import React, { useState, use } from 'react';
import { artists } from '../../data/artists';
import { notFound } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react'; // 読み込みアイコン追加
import Link from 'next/link';

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artist = artists.find((a) => a.id === resolvedParams.id);
  
  const [isPurchase, setIsPurchase] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 決済中フラグ

  if (!artist) return notFound();

  // エンジニアに「ここをStripeに繋いで」と伝えるための関数
  const handleStripeCheckout = async () => {
    setIsLoading(true);
    
    // ここで本来はバックエンド(Supabase/Stripe)を呼び出す
    // デモとして2秒待機してから完了させる
    setTimeout(() => {
      alert('Stripeの安全な決済画面へリダイレクトします...');
      // 成功後の処理（デモ）
      window.location.href = `/activity?success=true&artistId=${artist.id}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* 既存のレイアウトコード */}
      <Link href="/market" className="fixed top-4 left-4 z-20 bg-black/50 p-2 rounded-full"><ArrowLeft size={24} /></Link>
      
      {/* ... (中略: アーティスト画像表示など) ... */}

      <div className="p-6">
        {!isPurchase ? (
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
            <p className="text-sm text-gray-500 mb-2">Membership Price</p>
            <p className="text-4xl font-bold mb-6">¥{artist.price.toLocaleString()}</p>
            <button 
              onClick={() => setIsPurchase(true)} 
              className="w-full bg-blue-600 font-bold py-4 rounded-full"
            >
              メンバーになる
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl border border-blue-500 animate-in slide-in-from-bottom-2">
            <h3 className="text-xl font-bold mb-4 text-center">購入の確認</h3>
            <div className="flex justify-between border-b border-gray-700 pb-2 mb-6 text-lg">
              <span>合計金額</span>
              <span className="font-bold text-blue-400">¥{artist.price.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleStripeCheckout}
              disabled={isLoading}
              className="w-full bg-blue-600 font-bold py-4 rounded-full mb-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" /> 準備中...</>
              ) : (
                '安全な決済画面へ進む'
              )}
            </button>
            
            {!isLoading && (
              <button onClick={() => setIsPurchase(false)} className="w-full text-gray-500 text-sm py-2">
                キャンセル
              </button>
            )}
            
            <p className="text-[10px] text-gray-500 text-center mt-4">
              ※この決済はStripeによって保護されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
