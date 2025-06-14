"use client";

/**
 * Zodバリデーション統合コンポーネント
 * 
 * TanStack FormとZodスキーマを統合し、型安全なバリデーションを提供
 * sync/asyncバリデーション、カスタムエラーメッセージに対応
 */

import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";

// Zodバリデーター統合のためのヘルパー関数
export function createZodValidator<T>(schema: z.ZodSchema<T>) {
  return {
    validator: zodValidator(),
    schema,
    validators: {
      onChange: schema,
      onBlur: schema,
    },
  };
}

// よく使用されるZodスキーマのプリセット
export const commonSchemas = {
  // 基本型
  requiredString: z.string().min(1, "必須項目です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  url: z.string().url("有効なURLを入力してください"),
  phoneNumber: z.string().regex(/^[\d-+().\s]+$/, "有効な電話番号を入力してください"),
  
  // 数値
  positiveNumber: z.number().positive("正の数値を入力してください"),
  nonNegativeNumber: z.number().min(0, "0以上の数値を入力してください"),
  age: z.number().int().min(0, "0歳以上を入力してください").max(150, "有効な年齢を入力してください"),
  
  // 日付
  date: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "有効な日付を入力してください"),
  
  futureDate: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, "未来の日付を入力してください"),
  
  pastDate: z.string().refine((val) => {
    const date = new Date(val);
    return date < new Date();
  }, "過去の日付を入力してください"),
  
  // 配列
  nonEmptyArray: z.array(z.any()).min(1, "最低1つは選択してください"),
  
  // カスタム
  japaneseZipCode: z.string().regex(/^\d{3}-\d{4}$/, "郵便番号は000-0000の形式で入力してください"),
  
  // パスワード確認
  passwordConfirmation: (passwordField: string) => z.object({
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  }),
};

// 条件付きバリデーション用のヘルパー
export const conditionalValidation = {
  requiredIf: <T>(condition: (data: any) => boolean, schema: z.ZodSchema<T>) =>
    z.any().superRefine((val, ctx) => {
      if (condition(ctx)) {
        const result = schema.safeParse(val);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue(issue);
          });
        }
      }
    }),
    
  validateIf: <T>(condition: (data: any) => boolean, schema: z.ZodSchema<T>) =>
    z.any().superRefine((val, ctx) => {
      if (condition(ctx) && val !== undefined && val !== null && val !== "") {
        const result = schema.safeParse(val);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue(issue);
          });
        }
      }
    }),
};

// 非同期バリデーション用のヘルパー
export const asyncValidation = {
  uniqueEmail: (checkFunction: (email: string) => Promise<boolean>) =>
    z.string().email().refine(async (email) => {
      return await checkFunction(email);
    }, "このメールアドレスは既に使用されています"),
    
  uniqueUsername: (checkFunction: (username: string) => Promise<boolean>) =>
    z.string().refine(async (username) => {
      return await checkFunction(username);
    }, "このユーザー名は既に使用されています"),
};

// エラーメッセージの日本語化
export const zodJapaneseErrors = {
  required_error: "必須項目です",
  invalid_type_error: "入力形式が正しくありません",
  
  string: {
    min: (min: number) => `${min}文字以上で入力してください`,
    max: (max: number) => `${max}文字以下で入力してください`,
    email: "有効なメールアドレスを入力してください",
    url: "有効なURLを入力してください",
    regex: "入力形式が正しくありません",
  },
  
  number: {
    min: (min: number) => `${min}以上の数値を入力してください`,
    max: (max: number) => `${max}以下の数値を入力してください`,
    int: "整数を入力してください",
    positive: "正の数値を入力してください",
    nonnegative: "0以上の数値を入力してください",
  },
  
  array: {
    min: (min: number) => `最低${min}個選択してください`,
    max: (max: number) => `最大${max}個まで選択できます`,
  },
  
  date: {
    min: (min: string) => `${min}以降の日付を入力してください`,
    max: (max: string) => `${max}以前の日付を入力してください`,
  },
};

// バリデーションスキーマの例
export const exampleSchemas = {
  userRegistration: z.object({
    firstName: commonSchemas.requiredString,
    lastName: commonSchemas.requiredString,
    email: commonSchemas.email,
    age: commonSchemas.age.optional(),
    phoneNumber: commonSchemas.phoneNumber.optional(),
    zipCode: commonSchemas.japaneseZipCode.optional(),
    terms: z.boolean().refine(val => val === true, "利用規約への同意が必要です"),
  }),
  
  productForm: z.object({
    name: commonSchemas.requiredString,
    price: commonSchemas.positiveNumber,
    category: z.enum(["electronics", "clothing", "books"], {
      errorMap: () => ({ message: "カテゴリを選択してください" }),
    }),
    description: z.string().max(1000, "説明は1000文字以下で入力してください").optional(),
    tags: z.array(z.string()).max(5, "タグは最大5個まで設定できます").optional(),
    publishDate: commonSchemas.futureDate.optional(),
  }),
  
  nestedForm: z.object({
    user: z.object({
      name: commonSchemas.requiredString,
      email: commonSchemas.email,
    }),
    address: z.object({
      street: commonSchemas.requiredString,
      city: commonSchemas.requiredString,
      zipCode: commonSchemas.japaneseZipCode,
    }),
    preferences: z.object({
      newsletter: z.boolean(),
      notifications: z.boolean(),
    }),
  }),
};