/**
 * メインページ（タイムライン）
 * 認証済みユーザーには投稿フォームとタイムラインを表示
 * 未認証ユーザーはログインページにリダイレクト
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TweetForm from '@/components/TweetForm';
import TweetList from '@/components/TweetList';
import { Star } from 'lucide-react';

export default function Home() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 未認証の場合はログインページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // ログアウト処理
  const handleLogout = async () => {
    if (confirm('ログアウトしますか？')) {
      await logout();
      router.push('/login');
    }
  };

  // ツイート投稿後の更新
  const handleTweetPosted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              📱 Twitter クローン
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {userProfile.displayName}
              </span>
              <button
                onClick={() => router.push('/favorites')}
                className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-full transition-colors"
                title="お気に入り"
              >
                <Star size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <TweetForm onTweetPosted={handleTweetPosted} />
        <TweetList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}
