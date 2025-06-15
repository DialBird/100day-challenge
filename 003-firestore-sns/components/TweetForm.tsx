/**
 * ツイート投稿フォームコンポーネント
 * 最大280文字のテキスト投稿機能を提供
 * 認証済みユーザーのみ使用可能
 */

'use client';

import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImage } from '@/lib/imageUpload';
import { Camera, X } from 'lucide-react';

interface TweetFormProps {
  onTweetPosted?: () => void;
}

export default function TweetForm({ onTweetPosted }: TweetFormProps) {
  const { user, userProfile } = useAuth();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 画像選択処理
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // プレビュー用のURLを作成
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 画像削除処理
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile || !text.trim()) return;

    setIsSubmitting(true);
    
    try {
      let imageUrl: string | undefined;

      // 画像がある場合はアップロード
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, user.uid);
      }

      // ツイートデータを作成
      const tweetData: any = {
        text: text.trim(),
        userId: user.uid,
        userName: userProfile.displayName,
        createdAt: serverTimestamp(),
        likes: [],
        likesCount: 0,
      };

      if (imageUrl) {
        tweetData.imageUrl = imageUrl;
        tweetData.imageAlt = `${userProfile.displayName}の投稿画像`;
      }

      await addDoc(collection(db, 'tweets'), tweetData);
      
      // フォームをリセット
      setText('');
      handleImageRemove();
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
        
        {/* 画像プレビュー */}
        {imagePreview && (
          <div className="mb-4 relative">
            <img
              src={imagePreview}
              alt="プレビュー"
              className="max-w-full max-h-64 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleImageRemove}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {text.length}/280
            </div>
            
            {/* 画像添付ボタン */}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="画像を添付"
              >
                <Camera size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
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