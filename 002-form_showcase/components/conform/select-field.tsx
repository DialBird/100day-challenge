"use client";

/**
 * Conform セレクトフィールドコンポーネント
 * 
 * 選択肢から単一値を選択するフィールドコンポーネント
 * optionsは{value, label}の配列で指定
 */

import { getSelectProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { ConformField } from "./form-field";

type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type ConformSelectFieldProps = {
  field: FieldMetadata<string>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
};

export function ConformSelectField({
  field,
  label,
  placeholder,
  options,
  className = "",
  disabled = false,
}: ConformSelectFieldProps) {
  return (
    <ConformField field={field} label={label} className={className}>
      {() => (
        <select
          {...getSelectProps(field)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
    </ConformField>
  );
}