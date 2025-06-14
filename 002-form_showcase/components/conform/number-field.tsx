"use client";

/**
 * Conform 数値フィールドコンポーネント
 * 
 * 数値入力を行うフィールドコンポーネント
 * min/max/step等の制約をサポート
 */

import { getInputProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { ConformField } from "./form-field";

type ConformNumberFieldProps = {
  field: FieldMetadata<number>;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
};

export function ConformNumberField({
  field,
  label,
  placeholder,
  min,
  max,
  step,
  className = "",
  disabled = false,
}: ConformNumberFieldProps) {
  return (
    <ConformField field={field} label={label} className={className}>
      {() => (
        <input
          {...getInputProps(field, { type: "number" })}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900"
        />
      )}
    </ConformField>
  );
}