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
import { toggleLike, toggleFavorite } from '@/lib/tweetActions';
import { Heart, Star, Trash2 } from 'lucide-react';
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
  const { user, userProfile } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const isOwner = user?.uid === tweet.userId;
  const isLiked = user ? tweet.likes?.includes(user.uid) : false;
  const isFavorited = userProfile ? userProfile.favorites?.includes(tweet.id) : false;

  // いいね処理
  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      await toggleLike(tweet.id, user.uid);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      alert('いいねの処理に失敗しました');
    } finally {
      setIsLiking(false);
    }
  };

  // お気に入り処理
  const handleFavorite = async () => {
    if (!user || isFavoriting) return;

    setIsFavoriting(true);
    try {
      await toggleFavorite(tweet.id, user.uid);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('お気に入りの処理に失敗しました');
    } finally {
      setIsFavoriting(false);
    }
  };

  // 削除処理
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
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="削除"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="text-gray-800 whitespace-pre-wrap mb-4">
        {tweet.text}
      </div>
      
      {/* 画像表示 */}
      {tweet.imageUrl && (
        <div className="mb-4">
          <img
            src={tweet.imageUrl}
            alt={tweet.imageAlt || 'ツイート画像'}
            className="max-w-full max-h-96 rounded-lg object-cover cursor-pointer"
            onClick={() => window.open(tweet.imageUrl, '_blank')}
          />
        </div>
      )}
      
      {/* アクションボタン */}
      <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
        {/* いいねボタン */}
        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`flex items-center space-x-2 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isLiked
              ? 'text-red-500 hover:bg-red-50'
              : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
          }`}
          title={isLiked ? 'いいねを取り消し' : 'いいね'}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm">{tweet.likesCount || 0}</span>
        </button>
        
        {/* お気に入りボタン */}
        <button
          onClick={handleFavorite}
          disabled={!user || isFavoriting}
          className={`flex items-center space-x-2 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isFavorited
              ? 'text-yellow-500 hover:bg-yellow-50'
              : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
          }`}
          title={isFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
          <Star size={18} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}