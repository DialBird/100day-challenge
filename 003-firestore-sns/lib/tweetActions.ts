/**
 * ツイート関連のアクション
 * いいね機能とお気に入り機能のロジック
 */

import { doc, updateDoc, arrayUnion, arrayRemove, increment, runTransaction } from 'firebase/firestore';
import { db } from './firebase';

// いいねをトグル
export const toggleLike = async (tweetId: string, userId: string): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      const tweetRef = doc(db, 'tweets', tweetId);
      const tweetDoc = await transaction.get(tweetRef);

      if (!tweetDoc.exists()) {
        throw new Error('Tweet not found');
      }

      const tweetData = tweetDoc.data();
      const likes = tweetData.likes || [];
      const isLiked = likes.includes(userId);

      if (isLiked) {
        // いいねを取り消し
        transaction.update(tweetRef, {
          likes: arrayRemove(userId),
          likesCount: increment(-1),
        });
      } else {
        // いいねを追加
        transaction.update(tweetRef, {
          likes: arrayUnion(userId),
          likesCount: increment(1),
        });
      }
    });
  } catch (error) {
    console.error('Failed to toggle like:', error);
    throw error;
  }
};

// お気に入りをトグル
export const toggleFavorite = async (tweetId: string, userId: string): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      const isFavorited = favorites.includes(tweetId);

      if (isFavorited) {
        // お気に入りを取り消し
        transaction.update(userRef, {
          favorites: arrayRemove(tweetId),
        });
      } else {
        // お気に入りに追加
        transaction.update(userRef, {
          favorites: arrayUnion(tweetId),
        });
      }
    });
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    throw error;
  }
};