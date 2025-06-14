"use client";

/**
 * TanStack Form デモページ
 * 
 * 実装したフォームコンポーネント群の使用例を示すデモページ
 * 基本フィールド、配列、ネスト、条件付きフィールドなどを網羅
 */

import { useState } from "react";
import { z } from "zod";
import {
  FormProvider,
  Form,
  TextField,
  NumberField,
  SelectField,
  CheckboxField,
  CheckboxGroupField,
  RadioField,
  DateField,
  TextareaField,
  ArrayField,
  NestedField,
  NestedFieldSubField,
  ConditionalField,
  conditions,
  commonSchemas,
} from "@/components/form";

// デモ用のZodスキーマ
const demoSchema = z.object({
  // 基本フィールド
  firstName: commonSchemas.requiredString,
  lastName: commonSchemas.requiredString,
  email: commonSchemas.email,
  age: commonSchemas.age.optional(),
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
  birthDate: commonSchemas.pastDate.optional(),
  
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
    name: commonSchemas.requiredString,
    level: z.number().min(1).max(5),
    yearsOfExperience: z.number().min(0),
  })).min(1, "最低1つのスキルを入力してください"),
}).refine((data) => {
  // 条件付きバリデーション：連絡方法が電話の場合は電話番号必須
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

const defaultValues: DemoFormData = {
  firstName: "",
  lastName: "",
  email: "",
  age: undefined,
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

export default function TanStackFormDemo() {
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
            TanStack Form デモ
          </h1>
          
          <FormProvider
            defaultValues={defaultValues}
            validationSchema={demoSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-8">
              {/* 基本情報セクション */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  基本情報
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField<DemoFormData, "firstName">
                    name="firstName"
                    label="名前"
                    placeholder="太郎"
                  />
                  <TextField<DemoFormData, "lastName">
                    name="lastName"
                    label="姓"
                    placeholder="田中"
                  />
                  <TextField<DemoFormData, "email">
                    name="email"
                    label="メールアドレス"
                    type="email"
                    placeholder="example@example.com"
                  />
                  <NumberField<DemoFormData, "age">
                    name="age"
                    label="年齢"
                    min={0}
                    max={150}
                    placeholder="25"
                  />
                </div>
                <div className="mt-4">
                  <TextareaField<DemoFormData, "bio">
                    name="bio"
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
                  <SelectField<DemoFormData, "country">
                    name="country"
                    label="国"
                    options={countryOptions}
                    placeholder="国を選択してください"
                  />
                  <DateField<DemoFormData, "birthDate">
                    name="birthDate"
                    label="生年月日"
                    type="date"
                  />
                </div>
                <div className="mt-4">
                  <CheckboxGroupField<DemoFormData, "hobbies">
                    name="hobbies"
                    label="趣味（複数選択可）"
                    options={hobbyOptions}
                  />
                </div>
                <div className="mt-4">
                  <RadioField<DemoFormData, "contactMethod">
                    name="contactMethod"
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
                <ConditionalField<DemoFormData>
                  condition={conditions.equals("contactMethod", "phone")}
                >
                  <TextField<DemoFormData, "phoneNumber">
                    name="phoneNumber"
                    label="電話番号"
                    type="tel"
                    placeholder="090-1234-5678"
                  />
                </ConditionalField>
                
                <ConditionalField<DemoFormData>
                  condition={conditions.equals("contactMethod", "mail")}
                >
                  <TextareaField<DemoFormData, "address">
                    name="address"
                    label="住所"
                    placeholder="郵送先住所を入力してください"
                    rows={3}
                  />
                </ConditionalField>
              </section>

              {/* ネストフィールドセクション */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  設定（ネストオブジェクト）
                </h2>
                <NestedField<DemoFormData, "preferences", DemoFormData["preferences"]>
                  name="preferences"
                  label="個人設定"
                  defaultValue={{
                    theme: "light",
                    language: "ja",
                    notifications: true,
                  }}
                  collapsible={true}
                >
                  {() => (
                    <div className="space-y-4">
                      <NestedFieldSubField<DemoFormData, "preferences", DemoFormData["preferences"], "theme">
                        parentName="preferences"
                        name="theme"
                        label="テーマ"
                      >
                        {(subField) => (
                          <select
                            value={subField.state.value || "light"}
                            onChange={(e) => subField.handleChange(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          >
                            {themeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </NestedFieldSubField>
                      
                      <NestedFieldSubField<DemoFormData, "preferences", DemoFormData["preferences"], "language">
                        parentName="preferences"
                        name="language"
                        label="言語"
                      >
                        {(subField) => (
                          <select
                            value={subField.state.value || "ja"}
                            onChange={(e) => subField.handleChange(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                          >
                            {languageOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </NestedFieldSubField>
                      
                      <NestedFieldSubField<DemoFormData, "preferences", DemoFormData["preferences"], "notifications">
                        parentName="preferences"
                        name="notifications"
                        label="通知を受け取る"
                      >
                        {(subField) => (
                          <input
                            type="checkbox"
                            checked={Boolean(subField.state.value)}
                            onChange={(e) => subField.handleChange(e.target.checked as any)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        )}
                      </NestedFieldSubField>
                    </div>
                  )}
                </NestedField>
              </section>

              {/* 配列フィールドセクション */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  スキル（配列フィールド）
                </h2>
                <ArrayField<DemoFormData, "skills", DemoFormData["skills"][0]>
                  name="skills"
                  label="スキル一覧"
                  defaultItem={{
                    name: "",
                    level: 1,
                    yearsOfExperience: 0,
                  }}
                  addButtonText="スキルを追加"
                  removeButtonText="削除"
                  minItems={1}
                  maxItems={10}
                >
                  {(field, index, item) => (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          スキル名
                        </label>
                        <input
                          type="text"
                          placeholder="JavaScript"
                          value={item.name}
                          onChange={(e) => {
                            const currentValue = Array.isArray(field.state.value) ? field.state.value : [];
                            const newValue = [...currentValue];
                            newValue[index] = { ...item, name: e.target.value };
                            field.handleChange(newValue as any);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          レベル (1-5)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={item.level}
                          onChange={(e) => {
                            const currentValue = Array.isArray(field.state.value) ? field.state.value : [];
                            const newValue = [...currentValue];
                            newValue[index] = { ...item, level: Number(e.target.value) };
                            field.handleChange(newValue as any);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          経験年数
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.yearsOfExperience}
                          onChange={(e) => {
                            const currentValue = Array.isArray(field.state.value) ? field.state.value : [];
                            const newValue = [...currentValue];
                            newValue[index] = { ...item, yearsOfExperience: Number(e.target.value) };
                            field.handleChange(newValue as any);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                    </div>
                  )}
                </ArrayField>
              </section>

              {/* 同意チェックボックス */}
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  確認事項
                </h2>
                <div className="space-y-4">
                  <CheckboxField<DemoFormData, "newsletter">
                    name="newsletter"
                    label="ニュースレターを受け取る"
                    description="新機能やアップデートに関する情報をお送りします"
                  />
                  <CheckboxField<DemoFormData, "terms">
                    name="terms"
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
            </Form>
          </FormProvider>

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