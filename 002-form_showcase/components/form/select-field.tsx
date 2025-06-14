"use client";

/**
 * セレクトフィールドコンポーネント
 * 
 * 選択肢から単一値を選択するフィールドコンポーネント
 * optionsは{value, label}の配列で指定
 */

import { FormField } from "./form-field";

type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
};

export function SelectField<TData, TName extends keyof TData>({
  name,
  label,
  placeholder,
  options,
  className = "",
  disabled = false,
}: SelectFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => (
        <select
          id={String(name)}
          disabled={disabled}
          value={field.state.value as string || ""}
          onChange={(e) => {
            const value = e.target.value === "" ? undefined : e.target.value;
            field.handleChange(value as any);
          }}
          onBlur={field.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
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
    </FormField>
  );
}