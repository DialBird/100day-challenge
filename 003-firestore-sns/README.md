# 📘 Twitterクローン仕様書（Next.js + Firebase）

## 🧑‍💻 概要

このプロジェクトは、Next.js と Firebase（Authentication + Firestore）を使って構築する、簡単な Twitter クローンです。ログイン後、ツイートの投稿・表示・削除ができる最小限の機能を持ちます。

---

## 🔧 技術スタック

- フロントエンド: **Next.js (App Router または Pages Router)**
- スタイリング: **Tailwind CSS**（任意）
- バックエンド: **Firebase**
  - Firebase Authentication
  - Firestore Database
  - Firebase Hosting（任意）

---

## ✅ 実装機能一覧

| 機能           | 説明                                                                 |
|----------------|----------------------------------------------------------------------|
| ツイート投稿   | テキスト（最大280文字）を投稿可能。ログイン必須。                   |
| タイムライン表示 | Firestoreから新着順にツイートを取得し表示。                         |
| ユーザー認証   | 匿名ログイン（最低限）、Googleログイン（任意）                       |
| ツイート削除   | 自分の投稿のみ削除可能                                               |
| 表示名         | 匿名なら自動生成のユーザー名、Googleログインならその表示名を使用     |

---

## 🔐 Firebase Authentication

- 匿名ログイン（MVP）
- Googleログイン（任意）
- UIDをベースに Firestore にユーザーデータを保存

---

## 🧱 Firestore データ構造

### コレクション: `tweets`

<javascript>
{
  "text": "今日も一日がんばるぞい！",
  "userId": "abc123uid",
  "userName": "anonymous_493",
  "createdAt": Timestamp
}
</javascript>

### コレクション: `users`

<javascript>
{
  "displayName": "anonymous_493",
  "createdAt": Timestamp
}
</javascript>

---

## 🧑‍🎨 UI 画面構成

### 1. タイムライン画面（`/`）

- 投稿フォーム（テキストボックス + ボタン）
- 新着順でツイート一覧表示
  - 投稿者名
  - 投稿日時
  - テキスト
  - 自分の投稿には削除ボタン

### 2. ログイン画面（初回アクセス時）

- 匿名ログインボタン
- Googleログインボタン（任意）

---

## 🧑‍💻 Firebase Firestore セキュリティルール（MVP）

<javascript>
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /tweets/{tweetId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
</javascript>

---

## 📦 ページ構成（Next.js）

| パス       | 内容                     |
|------------|--------------------------|
| `/`        | タイムライン＋投稿フォーム |
| `/login`   | ログインページ（初回用）   |

※ ログイン状態は `useEffect` + `onAuthStateChanged` などで監視

---

## 🔄 投稿フロー

1. ユーザーがログイン（匿名 or Google）
2. 投稿フォームからテキスト送信
3. Firestore の `tweets` コレクションに追加（`createdAt` に `serverTimestamp()`）
4. タイムラインにリアルタイムで反映（`onSnapshot`）

---

## 💡 発展アイデア（Optional）

- 🔄 リアルタイム表示（`onSnapshot()`使用）
- ❤️ いいね機能（`likes: number`を追加）
- 🧵 ユーザープロフィール（自己紹介、投稿一覧）
- 🔗 投稿URL共有（TweetにIDベースのルート付与）
- 📷 画像添付（Firebase Storage）

---

## ✅ 実装優先度（ステップ）

1. Firebase プロジェクト作成（Auth + Firestore）
2. Next.js プロジェクト立ち上げ（`create-next-app`）
3. Firebase SDK セットアップ（`.env.local`）
4. 認証処理（匿名ログイン）
5. 投稿フォームとFirestore連携
6. タイムライン一覧表示（新着順）
7. 削除ボタン（自分の投稿のみ）
8. UI微調整（Tailwindなど）

---

## 📝 補足

- Firestore はクエリ制限に注意（インデックスの自動生成も確認）
- 投稿数が増えた場合、ページネーションや無限スクロールを導入検討
- モバイルファーストの設計がおすすめ（Twitter UXに近づけるなら）

---

## 📚 使用パッケージ例（Next.js）

- `firebase`
- `react-firebase-hooks`（Auth用に便利）
- `dayjs`（日時表示）

---

## 📁 ディレクトリ例（App Router）

/app
/login
page.tsx
/tweet
[id]/page.tsx
/layout.tsx
/page.tsx (timeline)
/components
TweetForm.tsx
TweetList.tsx
TweetItem.tsx

## 🎉 完成イメージ

- 投稿できる  
- 見れる  
- 削除できる  
- 認証されている  

これだけでも「ミニTwitter」として機能します！
