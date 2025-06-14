"use client";

/**
 * 日付フィールドコンポーネント
 * 
 * 日付入力を行うフィールドコンポーネント
 * HTML5のdate/datetime-local/time入力に対応
 */

import { FormField } from "./form-field";

type DateFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  type?: "date" | "datetime-local" | "time";
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
};

export function DateField<TData, TName extends keyof TData>({
  name,
  label,
  type = "date",
  min,
  max,
  className = "",
  disabled = false,
}: DateFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => (
        <input
          id={String(name)}
          type={type}
          min={min}
          max={max}
          disabled={disabled}
          value={field.state.value as string || ""}
          onChange={(e) => field.handleChange(e.target.value as any)}
          onBlur={field.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900"
        />
      )}
    </FormField>
  );
}