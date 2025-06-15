/**
 * アプリケーション全体で使用する型定義
 * ツイートとユーザーの構造を定義
 */

import { Timestamp } from 'firebase/firestore';

export interface Tweet {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
  imageUrl?: string;
  imageAlt?: string;
  likes: string[]; // ユーザーIDの配列
  likesCount: number;
}

export interface User {
  id: string;
  displayName: string;
  createdAt: Timestamp;
  favorites: string[]; // お気に入りのツイートIDの配列
}