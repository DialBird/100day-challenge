"use client";

/**
 * テキストエリアフィールドコンポーネント
 * 
 * 複数行のテキスト入力を行うフィールドコンポーネント
 */

import { FormField } from "./form-field";

type TextareaFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
};

export function TextareaField<TData, TName extends keyof TData>({
  name,
  label,
  placeholder,
  rows = 4,
  maxLength,
  className = "",
  disabled = false,
  resize = "vertical",
}: TextareaFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => (
        <div>
          <textarea
            id={String(name)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            value={field.state.value as string || ""}
            onChange={(e) => field.handleChange(e.target.value as any)}
            onBlur={field.handleBlur}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-${resize}`}
          />
          {maxLength && (
            <div className="mt-1 text-sm text-gray-500 text-right">
              {(field.state.value as string || "").length} / {maxLength}
            </div>
          )}
        </div>
      )}
    </FormField>
  );
}