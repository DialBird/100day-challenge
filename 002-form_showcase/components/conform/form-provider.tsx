"use client";

/**
 * Conform フォームプロバイダー
 * 
 * Conformを使用したフォーム状態の管理とZodバリデーションを提供する
 * 汎用的なフォームプロバイダーコンポーネント
 */

import { ReactNode } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

type ConformFormProviderProps<TSchema extends z.ZodTypeAny> = {
  children: ReactNode;
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;
  defaultValue?: Partial<z.infer<TSchema>>;
  className?: string;
};

export function ConformFormProvider<TSchema extends z.ZodTypeAny>({
  children,
  schema,
  onSubmit,
  defaultValue,
  className = "",
}: ConformFormProviderProps<TSchema>) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      const submission = parseWithZod(formData, { schema });
      
      if (submission.status === "success") {
        onSubmit(submission.value);
      }
    },
    defaultValue,
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className={className}
    >
      <ConformFormContext.Provider value={{ form, fields }}>
        {children}
      </ConformFormContext.Provider>
    </form>
  );
}

// Context for form state
import { createContext, useContext } from "react";
import type { FieldMetadata } from "@conform-to/react";

type ConformFormContextValue = {
  form: any;
  fields: Record<string, FieldMetadata<any>>;
};

const ConformFormContext = createContext<ConformFormContextValue | null>(null);

export function useConformForm() {
  const context = useContext(ConformFormContext);
  if (!context) {
    throw new Error("useConformForm must be used within a ConformFormProvider");
  }
  return context;
}