"use client";

/**
 * ラジオボタンフィールドコンポーネント
 * 
 * 選択肢から単一値を選択するラジオボタングループのフィールドコンポーネント
 */

import { FormField } from "./form-field";

type RadioOption = {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
};

type RadioFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
};

export function RadioField<TData, TName extends keyof TData>({
  name,
  label,
  options,
  className = "",
  disabled = false,
  direction = "vertical",
}: RadioFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => (
        <div className={`${direction === "horizontal" ? "flex flex-wrap gap-6" : "space-y-3"}`}>
          {options.map((option) => (
            <div key={option.value} className="flex items-start">
              <input
                id={`${String(name)}-${option.value}`}
                name={String(name)}
                type="radio"
                disabled={disabled || option.disabled}
                checked={field.state.value === option.value}
                onChange={() => field.handleChange(option.value as any)}
                onBlur={field.handleBlur}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:bg-gray-50"
              />
              <div className="ml-3">
                <label
                  htmlFor={`${String(name)}-${option.value}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
}