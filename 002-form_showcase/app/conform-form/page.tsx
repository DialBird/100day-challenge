"use client";

/**
 * Conform Form デモページ
 * 
 * 実装したConformフォームコンポーネント群の使用例を示すデモページ
 * 基本フィールド、配列、ネスト、条件付きフィールドなどを網羅
 */

import { useState } from "react";
import { z } from "zod";
import { useFieldList, useFieldset } from "@conform-to/react";
import {
  ConformFormProvider,
  useConformForm,
  ConformTextField,
  ConformNumberField,
  ConformSelectField,
  ConformCheckboxField,
  ConformCheckboxGroupField,
  ConformRadioField,
  ConformDateField,
  ConformTextareaField,
  ConformFieldset,
} from "@/components/conform";

// デモ用のZodスキーマ（TanStackと同じ構造）
const demoSchema = z.object({
  // 基本フィールド
  firstName: z.string().min(1, "名前は必須です"),
  lastName: z.string().min(1, "姓は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  age: z.number().min(0, "年齢は0以上で入力してください").max(150, "有効な年齢を入力してください").optional(),
  bio: z.string().max(500, "自己紹介は500文字以下で入力してください").optional(),
  
  // セレクト系
  country: z.enum(["japan", "usa", "uk", "canada"], {
    errorMap: () => ({ message: "国を選択してください" }),
  }),
  hobbies: z.array(z.string()).min(1, "最低1つの趣味を選択してください"),
  contactMethod: z.enum(["email", "phone", "mail"]),
  
  // 条件付きフィールド
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  
  // 日付
  birthDate: z.string().optional(),
  
  // チェックボックス
  newsletter: z.boolean(),
  terms: z.boolean().refine(val => val === true, "利用規約への同意が必要です"),
  
  // ネストオブジェクト
  preferences: z.object({
    theme: z.enum(["light", "dark"]),
    language: z.enum(["ja", "en"]),
    notifications: z.boolean(),
  }),
  
  // 配列フィールド
  skills: z.array(z.object({
    name: z.string().min(1, "スキル名は必須です"),
    level: z.number().min(1).max(5),
    yearsOfExperience: z.number().min(0),
  })).min(1, "最低1つのスキルを入力してください"),
}).refine((data) => {
  // 条件付きバリデーション
  if (data.contactMethod === "phone" && !data.phoneNumber) {
    return false;
  }
  if (data.contactMethod === "mail" && !data.address) {
    return false;
  }
  return true;
}, {
  message: "選択した連絡方法に応じて必要な情報を入力してください",
  path: ["contactMethod"],
});

type DemoFormData = z.infer<typeof demoSchema>;

const defaultValues: Partial<DemoFormData> = {
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  country: "japan",
  hobbies: [],
  contactMethod: "email",
  phoneNumber: "",
  address: "",
  birthDate: "",
  newsletter: false,
  terms: false,
  preferences: {
    theme: "light",
    language: "ja",
    notifications: true,
  },
  skills: [{
    name: "",
    level: 1,
    yearsOfExperience: 0,
  }],
};

const countryOptions = [
  { value: "japan", label: "日本" },
  { value: "usa", label: "アメリカ" },
  { value: "uk", label: "イギリス" },
  { value: "canada", label: "カナダ" },
];

const hobbyOptions = [
  { value: "reading", label: "読書" },
  { value: "gaming", label: "ゲーム" },
  { value: "sports", label: "スポーツ" },
  { value: "music", label: "音楽" },
  { value: "cooking", label: "料理" },
  { value: "travel", label: "旅行" },
];

const contactMethodOptions = [
  { value: "email", label: "メール" },
  { value: "phone", label: "電話" },
  { value: "mail", label: "郵送" },
];

const themeOptions = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
];

const languageOptions = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "英語" },
];

function ConformFormContent() {
  const { fields } = useConformForm();
  const [contactMethod, setContactMethod] = useState("email");
  
  // ネストフィールドの処理
  const preferences = useFieldset(fields.preferences);
  
  // 配列フィールドの処理
  const skillsList = useFieldList(fields.skills);

  return (
    <div className="space-y-8">
      {/* 基本情報セクション */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          基本情報
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConformTextField
            field={fields.firstName}
            label="名前"
            placeholder="太郎"
          />
          <ConformTextField
            field={fields.lastName}
            label="姓"
            placeholder="田中"
          />
          <ConformTextField
            field={fields.email}
            label="メールアドレス"
            type="email"
            placeholder="example@example.com"
          />
          <ConformNumberField
            field={fields.age}
            label="年齢"
            min={0}
            max={150}
            placeholder="25"
          />
        </div>
        <div className="mt-4">
          <ConformTextareaField
            field={fields.bio}
            label="自己紹介"
            placeholder="自己紹介を入力してください..."
            rows={4}
            maxLength={500}
          />
        </div>
      </section>

      {/* 選択フィールドセクション */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          選択項目
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConformSelectField
            field={fields.country}
            label="国"
            options={countryOptions}
            placeholder="国を選択してください"
          />
          <ConformDateField
            field={fields.birthDate}
            label="生年月日"
            type="date"
          />
        </div>
        <div className="mt-4">
          <ConformCheckboxGroupField
            field={fields.hobbies}
            label="趣味（複数選択可）"
            options={hobbyOptions}
          />
        </div>
        <div className="mt-4">
          <ConformRadioField
            field={fields.contactMethod}
            label="希望連絡方法"
            options={contactMethodOptions}
            direction="horizontal"
          />
        </div>
      </section>

      {/* 条件付きフィールドセクション */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          条件付きフィールド
        </h2>
        {/* ConformでのリアルタイムUI更新のため、状態管理が必要 */}
        <div className="space-y-4">
          <input
            type="hidden"
            name={fields.contactMethod.name}
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
          />
          
          {contactMethod === "phone" && (
            <ConformTextField
              field={fields.phoneNumber}
              label="電話番号"
              type="tel"
              placeholder="090-1234-5678"
            />
          )}
          
          {contactMethod === "mail" && (
            <ConformTextareaField
              field={fields.address}
              label="住所"
              placeholder="郵送先住所を入力してください"
              rows={3}
            />
          )}
        </div>
      </section>

      {/* ネストフィールドセクション */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          設定（ネストオブジェクト）
        </h2>
        <ConformFieldset
          field={fields.preferences}
          label="個人設定"
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConformSelectField
              field={preferences.theme}
              label="テーマ"
              options={themeOptions}
            />
            <ConformSelectField
              field={preferences.language}
              label="言語"
              options={languageOptions}
            />
          </div>
          <div className="mt-4">
            <ConformCheckboxField
              field={preferences.notifications}
              label="通知を受け取る"
              description="新機能やアップデートに関する通知"
            />
          </div>
        </ConformFieldset>
      </section>

      {/* 配列フィールドセクション */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          スキル（配列フィールド）
        </h2>
        <div className="space-y-4">
          {skillsList.map((skill, index) => {
            const skillFields = useFieldset(skill);
            return (
              <div key={skill.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    スキル #{index + 1}
                  </span>
                  {skillsList.length > 1 && (
                    <button
                      {...skillsList.remove(index)}
                      type="button"
                      className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                      削除
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ConformTextField
                    field={skillFields.name}
                    label="スキル名"
                    placeholder="JavaScript"
                  />
                  <ConformNumberField
                    field={skillFields.level}
                    label="レベル (1-5)"
                    min={1}
                    max={5}
                  />
                  <ConformNumberField
                    field={skillFields.yearsOfExperience}
                    label="経験年数"
                    min={0}
                  />
                </div>
              </div>
            );
          })}
          
          <button
            {...skillsList.append()}
            type="button"
            className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            スキルを追加
          </button>
        </div>
      </section>

      {/* 同意チェックボックス */}
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          確認事項
        </h2>
        <div className="space-y-4">
          <ConformCheckboxField
            field={fields.newsletter}
            label="ニュースレターを受け取る"
            description="新機能やアップデートに関する情報をお送りします"
          />
          <ConformCheckboxField
            field={fields.terms}
            label="利用規約に同意する"
            description="サービス利用には利用規約への同意が必要です"
          />
        </div>
      </section>

      {/* 送信ボタン */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          送信
        </button>
      </div>
    </div>
  );
}

export default function ConformFormDemo() {
  const [submittedData, setSubmittedData] = useState<DemoFormData | null>(null);

  const handleSubmit = (data: DemoFormData) => {
    console.log("フォームデータ:", data);
    setSubmittedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Conform Form デモ
          </h1>
          
          <ConformFormProvider
            schema={demoSchema}
            onSubmit={handleSubmit}
            defaultValue={defaultValues}
            className="space-y-8"
          >
            <ConformFormContent />
          </ConformFormProvider>

          {/* 送信結果表示 */}
          {submittedData && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                送信完了
              </h3>
              <pre className="text-sm text-green-700 bg-green-100 p-4 rounded overflow-auto">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}