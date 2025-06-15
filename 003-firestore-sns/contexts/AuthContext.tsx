/**
 * 認証コンテキスト
 * アプリケーション全体で認証状態を管理し、ログイン・ログアウト機能を提供
 * 匿名ログインとGoogleログインをサポート
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signInAnonymously, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signInAnonymous: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 匿名ユーザー名を生成
const generateAnonymousName = (): string => {
  const randomNum = Math.floor(Math.random() * 1000);
  return `anonymous_${randomNum}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ユーザープロフィールの作成または取得
  const createOrGetUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: firebaseUser.uid, ...userSnap.data() } as User;
    } else {
      // 新規ユーザーの場合、プロフィールを作成
      const displayName = firebaseUser.displayName || generateAnonymousName();
      const newUser: Omit<User, 'id'> = {
        displayName,
        createdAt: serverTimestamp() as any,
      };

      await setDoc(userRef, newUser);
      return { id: firebaseUser.uid, ...newUser, createdAt: serverTimestamp() as any };
    }
  };

  // 匿名ログイン
  const signInAnonymous = async () => {
    try {
      const result = await signInAnonymously(auth);
      const profile = await createOrGetUserProfile(result.user);
      setUserProfile(profile);
    } catch (error) {
      console.error('Anonymous login failed:', error);
      throw error;
    }
  };

  // Googleログイン
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const profile = await createOrGetUserProfile(result.user);
      setUserProfile(profile);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await createOrGetUserProfile(firebaseUser);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to get user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInAnonymous,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};