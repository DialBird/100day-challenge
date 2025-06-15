/**
 * 個別ツイート表示コンポーネント
 * ツイートの内容、投稿者、投稿日時、削除ボタンを表示
 * 自分の投稿のみ削除可能
 */

'use client';

import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Tweet } from '@/lib/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';

dayjs.extend(relativeTime);
dayjs.locale('ja');

interface TweetItemProps {
  tweet: Tweet;
  onTweetDeleted?: () => void;
}

export default function TweetItem({ tweet, onTweetDeleted }: TweetItemProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.uid === tweet.userId;

  const handleDelete = async () => {
    if (!isOwner || isDeleting) return;

    if (!confirm('このツイートを削除しますか？')) return;

    setIsDeleting(true);
    
    try {
      await deleteDoc(doc(db, 'tweets', tweet.id));
      onTweetDeleted?.();
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      alert('ツイートの削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return dayjs(date).fromNow();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {tweet.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{tweet.userName}</div>
            <div className="text-sm text-gray-500">{formatDate(tweet.createdAt)}</div>
          </div>
        </div>
        
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '削除中...' : '削除'}
          </button>
        )}
      </div>
      
      <div className="text-gray-800 whitespace-pre-wrap">
        {tweet.text}
      </div>
    </div>
  );
}