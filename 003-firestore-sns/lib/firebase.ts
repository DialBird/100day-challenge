/**
 * Firebase設定とSDKの初期化を行うファイル
 * Firebaseプロジェクトとの接続を管理し、認証とFirestoreの設定を提供する
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  // TODO: Firebaseプロジェクトの設定を環境変数から取得
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase アプリの初期化
const app = initializeApp(firebaseConfig);

// 認証の初期化
export const auth = getAuth(app);

// Firestore の初期化
export const db = getFirestore(app);

// 開発環境でのエミュレータ接続
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  try {
    // Auth エミュレータに接続
    connectAuthEmulator(auth, 'http://localhost:9099');
    // Firestore エミュレータに接続
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // エミュレータがすでに接続されている場合のエラーは無視
    console.log('Firebase emulators already connected or not available');
  }
}

export default app;