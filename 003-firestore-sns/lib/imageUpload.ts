/**
 * 画像アップロード機能
 * Firebase Storageを使用した画像のアップロードと管理
 * 画像の圧縮とリサイズも含む
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// 画像ファイルの検証
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'サポートされていないファイル形式です。JPEG、PNG、GIF、WebPのみ対応しています。',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。',
    };
  }

  return { isValid: true };
};

// 画像の圧縮とリサイズ
export const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // アスペクト比を保ちながらリサイズ
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Canvas context is not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

// 画像をFirebase Storageにアップロード
export const uploadImage = async (file: File, userId: string): Promise<string> => {
  try {
    // ファイル検証
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 画像を圧縮
    const compressedFile = await compressImage(file);

    // ファイル名を生成（ユニークID + 元のファイル名）
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `tweets/${userId}/${fileName}`;

    // Firebase Storageにアップロード
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, compressedFile);

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

// 画像をFirebase Storageから削除
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // URLからファイルパスを抽出
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Image deletion failed:', error);
    throw error;
  }
};