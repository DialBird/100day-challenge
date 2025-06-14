"use client";

/**
 * チェックボックスフィールドコンポーネント
 * 
 * boolean値の入力を行うフィールドコンポーネント
 * 単一チェックボックスと複数選択チェックボックスに対応
 */

import { FormField } from "./form-field";

type CheckboxFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

export function CheckboxField<TData, TName extends keyof TData>({
  name,
  label,
  description,
  className = "",
  disabled = false,
}: CheckboxFieldProps<TData, TName>) {
  return (
    <FormField name={name} className={className}>
      {(field) => (
        <div className="flex items-start">
          <input
            id={String(name)}
            type="checkbox"
            disabled={disabled}
            checked={Boolean(field.state.value)}
            onChange={(e) => field.handleChange(e.target.checked as any)}
            onBlur={field.handleBlur}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
          />
          <div className="ml-3">
            {label && (
              <label htmlFor={String(name)} className="text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      )}
    </FormField>
  );
}

type CheckboxOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type CheckboxGroupFieldProps<TData, TName extends keyof TData> = {
  name: TName;
  label?: string;
  options: CheckboxOption[];
  className?: string;
  disabled?: boolean;
};

export function CheckboxGroupField<TData, TName extends keyof TData>({
  name,
  label,
  options,
  className = "",
  disabled = false,
}: CheckboxGroupFieldProps<TData, TName>) {
  return (
    <FormField name={name} label={label} className={className}>
      {(field) => {
        const selectedValues = (field.state.value as Array<string | number>) || [];
        
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${String(name)}-${option.value}`}
                  type="checkbox"
                  disabled={disabled || option.disabled}
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value);
                    field.handleChange(newValues as any);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
                />
                <label
                  htmlFor={`${String(name)}-${option.value}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      }}
    </FormField>
  );
}