"use client";

/**
 * Conform チェックボックスフィールドコンポーネント
 * 
 * boolean値の入力を行うフィールドコンポーネント
 * 単一チェックボックスと複数選択チェックボックスに対応
 */

import { getInputProps, getFieldsetProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";

type ConformCheckboxFieldProps = {
  field: FieldMetadata<boolean>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

export function ConformCheckboxField({
  field,
  label,
  description,
  className = "",
  disabled = false,
}: ConformCheckboxFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start">
        <input
          {...getInputProps(field, { type: "checkbox" })}
          disabled={disabled}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
        />
        <div className="ml-3">
          {label && (
            <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {field.errors && field.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.errors.join(", ")}
        </div>
      )}
    </div>
  );
}

type CheckboxOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type ConformCheckboxGroupFieldProps = {
  field: FieldMetadata<string[]>;
  label?: string;
  options: CheckboxOption[];
  className?: string;
  disabled?: boolean;
};

export function ConformCheckboxGroupField({
  field,
  label,
  options,
  className = "",
  disabled = false,
}: ConformCheckboxGroupFieldProps) {
  const fieldset = getFieldsetProps(field);
  
  return (
    <fieldset {...fieldset} className={`space-y-4 ${className}`}>
      {label && (
        <legend className="text-sm font-medium text-gray-700">
          {label}
        </legend>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              value={option.value}
              disabled={disabled || option.disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-50"
            />
            <label className="ml-2 text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {field.errors && field.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.errors.join(", ")}
        </div>
      )}
    </fieldset>
  );
}