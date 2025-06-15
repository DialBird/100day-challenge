/**
 * ツイート投稿フォームコンポーネント
 * 最大280文字のテキスト投稿機能を提供
 * 認証済みユーザーのみ使用可能
 */

'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface TweetFormProps {
  onTweetPosted?: () => void;
}

export default function TweetForm({ onTweetPosted }: TweetFormProps) {
  const { user, userProfile } = useAuth();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile || !text.trim()) return;

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'tweets'), {
        text: text.trim(),
        userId: user.uid,
        userName: userProfile.displayName,
        createdAt: serverTimestamp(),
      });
      
      setText('');
      onTweetPosted?.();
    } catch (error) {
      console.error('Failed to post tweet:', error);
      alert('ツイートの投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !userProfile) {
    return null;
  }

  const isValid = text.trim().length > 0 && text.length <= 280;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="いまどうしてる？"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={280}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {text.length}/280
          </div>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '投稿中...' : 'ツイート'}
          </button>
        </div>
      </form>
    </div>
  );
}