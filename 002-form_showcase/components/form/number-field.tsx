"use client";

/**
 * 数値フィールドコンポーネント
 * 
 * 数値入力を行うフィールドコンポーネント
 * min/max/step等の制約をサポート
 */

import { FormField } from "./form-field";

type NumberFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
};

export function NumberField<TData, TName extends keyof TData>({
  name,
  label,
  placeholder,
  min,
  max,
  step,
  className = "",
  disabled = false,
}: NumberFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => (
        <input
          id={String(name)}
          type="number"
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={field.state.value as number || ""}
          onChange={(e) => {
            const value = e.target.value === "" ? undefined : Number(e.target.value);
            field.handleChange(value as any);
          }}
          onBlur={field.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      )}
    </FormField>
  );
}