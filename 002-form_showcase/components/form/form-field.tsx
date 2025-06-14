"use client";

/**
 * フォームフィールド基底コンポーネント
 * 
 * TanStack Formと連携し、エラーハンドリングとラベル表示を統一するベースコンポーネント
 */

import { ReactNode } from "react";
import { useField, FieldApi } from "@tanstack/react-form";
import { useFormContext } from "./form-provider";

type FormFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  children: (field: FieldApi<TData, TName, any, any>) => ReactNode;
  className?: string;
};

export function FormField<TData, TName extends keyof TData>({
  name,
  label,
  children,
  className = "",
}: FormFieldProps<TData, TName>) {
  const { form } = useFormContext<TData>();
  
  const field = useField({
    form,
    name: name as any,
  });

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={String(name)} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children(field)}
      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.state.meta.errors.join(", ")}
        </div>
      )}
    </div>
  );
}