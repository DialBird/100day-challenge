"use client";

/**
 * Conform テキストフィールドコンポーネント
 * 
 * 文字列入力を行うフィールドコンポーネント
 * type指定により、text/email/password/url等に対応
 */

import { getInputProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { ConformField } from "./form-field";

type ConformTextFieldProps = {
  field: FieldMetadata<string>;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "url" | "tel";
  className?: string;
  disabled?: boolean;
};

export function ConformTextField({
  field,
  label,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
}: ConformTextFieldProps) {
  return (
    <ConformField field={field} label={label} className={className}>
      {() => (
        <input
          {...getInputProps(field, { type })}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900"
        />
      )}
    </ConformField>
  );
}