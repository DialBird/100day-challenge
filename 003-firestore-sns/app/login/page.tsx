/**
 * ログインページ
 * 匿名ログインとGoogleログインの選択肢を提供
 * 未認証ユーザーがアクセスする最初のページ
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { user, signInAnonymous, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ログイン済みの場合はトップページにリダイレクト
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymous();
      router.push('/');
    } catch (error) {
      console.error('Anonymous login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📱 Twitter クローン
          </h1>
          <p className="text-gray-600">
            ログインしてツイートを始めましょう
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleAnonymousLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '処理中...' : '匿名でログイン'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '処理中...' : 'Googleでログイン'}
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>匿名ログインでは、ランダムなユーザー名が自動生成されます。</p>
          <p>Googleログインでは、Googleアカウントの表示名が使用されます。</p>
        </div>
      </div>
    </div>
  );
}