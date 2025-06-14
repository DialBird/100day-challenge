"use client";

/**
 * テキストフィールドコンポーネント
 * 
 * 文字列入力を行うフィールドコンポーネント
 * type指定により、text/email/password/url等に対応
 */

import { FormField } from "./form-field";

type TextFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "url" | "tel";
  className?: string;
  disabled?: boolean;
};

export function TextField<TData, TName extends keyof TData>({
  name,
  label,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
}: TextFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => (
        <input
          id={String(name)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={field.state.value as string || ""}
          onChange={(e) => field.handleChange(e.target.value as any)}
          onBlur={field.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      )}
    </FormField>
  );
}