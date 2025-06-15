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
}

export interface User {
  id: string;
  displayName: string;
  createdAt: Timestamp;
}