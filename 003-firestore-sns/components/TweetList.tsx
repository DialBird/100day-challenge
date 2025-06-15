/**
 * ツイート一覧表示コンポーネント
 * Firestoreからツイートを取得し、新しい順に表示
 * リアルタイム更新に対応
 */

'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tweet } from '@/lib/types';
import TweetItem from './TweetItem';

interface TweetListProps {
  refreshTrigger?: number;
}

export default function TweetList({ refreshTrigger }: TweetListProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tweets'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tweetList: Tweet[] = [];
      querySnapshot.forEach((doc) => {
        tweetList.push({
          id: doc.id,
          ...doc.data(),
        } as Tweet);
      });
      
      setTweets(tweetList);
      setLoading(false);
    }, (error) => {
      console.error('Failed to fetch tweets:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">ツイートを読み込み中...</div>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500 mb-2">まだツイートがありません</div>
        <div className="text-sm text-gray-400">最初のツイートを投稿してみましょう！</div>
      </div>
    );
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetItem
          key={tweet.id}
          tweet={tweet}
          onTweetDeleted={() => {
            // リアルタイム更新により自動で削除されるため、特別な処理は不要
          }}
        />
      ))}
    </div>
  );
}