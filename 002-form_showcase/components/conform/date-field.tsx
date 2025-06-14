"use client";

/**
 * Conform 日付フィールドコンポーネント
 * 
 * 日付入力を行うフィールドコンポーネント
 * HTML5のdate/datetime-local/time入力に対応
 */

import { getInputProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { ConformField } from "./form-field";

type ConformDateFieldProps = {
  field: FieldMetadata<string>;
  label?: string;
  type?: "date" | "datetime-local" | "time";
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
};

export function ConformDateField({
  field,
  label,
  type = "date",
  min,
  max,
  className = "",
  disabled = false,
}: ConformDateFieldProps) {
  return (
    <ConformField field={field} label={label} className={className}>
      {() => (
        <input
          {...getInputProps(field, { type })}
          min={min}
          max={max}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900"
        />
      )}
    </ConformField>
  );
}