"use client";

/**
 * Conform テキストエリアフィールドコンポーネント
 * 
 * 複数行のテキスト入力を行うフィールドコンポーネント
 */

import { getTextareaProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { ConformField } from "./form-field";

type ConformTextareaFieldProps = {
  field: FieldMetadata<string>;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
};

export function ConformTextareaField({
  field,
  label,
  placeholder,
  rows = 4,
  maxLength,
  className = "",
  disabled = false,
  resize = "vertical",
}: ConformTextareaFieldProps) {
  return (
    <ConformField field={field} label={label} className={className}>
      {() => (
        <div>
          <textarea
            {...getTextareaProps(field)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 resize-${resize}`}
          />
          {maxLength && (
            <div className="mt-1 text-sm text-gray-500 text-right">
              {field.value?.length || 0} / {maxLength}
            </div>
          )}
        </div>
      )}
    </ConformField>
  );
}