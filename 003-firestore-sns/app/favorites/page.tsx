/**
 * お気に入り一覧ページ
 * ユーザーがお気に入りに追加したツイートを一覧表示
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tweet } from '@/lib/types';
import TweetItem from '@/components/TweetItem';
import { ArrowLeft } from 'lucide-react';

export default function FavoritesPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [favoritesTweets, setFavoritesTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 未認証の場合はログインページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // お気に入りツイートを取得
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userProfile || !userProfile.favorites || userProfile.favorites.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const tweets: Tweet[] = [];
        
        // お気に入りのツイートIDをバッチで取得
        for (const tweetId of userProfile.favorites) {
          const tweetDoc = await getDoc(doc(db, 'tweets', tweetId));
          if (tweetDoc.exists()) {
            tweets.push({
              id: tweetDoc.id,
              ...tweetDoc.data(),
            } as Tweet);
          }
        }

        // 投稿日時の新しい順にソート
        tweets.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime.getTime() - aTime.getTime();
        });

        setFavoritesTweets(tweets);
      } catch (error) {
        console.error('Failed to fetch favorite tweets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userProfile) {
      fetchFavorites();
    }
  }, [userProfile]);

  if (loading || isLoading) {
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              title="戻る"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              お気に入り
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {favoritesTweets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 mb-2">お気に入りのツイートがありません</div>
            <div className="text-sm text-gray-400">気になるツイートを⭐ボタンでお気に入りに追加しましょう！</div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              {favoritesTweets.length}件のお気に入り
            </div>
            {favoritesTweets.map((tweet) => (
              <TweetItem
                key={tweet.id}
                tweet={tweet}
                onTweetDeleted={() => {
                  // ツイートが削除された場合、お気に入りリストからも削除
                  setFavoritesTweets(prev => prev.filter(t => t.id !== tweet.id));
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}