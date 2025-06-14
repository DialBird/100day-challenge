"use client";

/**
 * Conform ラジオボタンフィールドコンポーネント
 * 
 * 選択肢から単一値を選択するラジオボタングループのフィールドコンポーネント
 */

import { getFieldsetProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";

type RadioOption = {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
};

type ConformRadioFieldProps = {
  field: FieldMetadata<string>;
  label?: string;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
};

export function ConformRadioField({
  field,
  label,
  options,
  className = "",
  disabled = false,
  direction = "vertical",
}: ConformRadioFieldProps) {
  const fieldset = getFieldsetProps(field);
  
  return (
    <fieldset {...fieldset} className={`space-y-4 ${className}`}>
      {label && (
        <legend className="text-sm font-medium text-gray-700">
          {label}
        </legend>
      )}
      <div className={`${direction === "horizontal" ? "flex flex-wrap gap-6" : "space-y-3"}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <input
              type="radio"
              name={field.name}
              value={option.value}
              disabled={disabled || option.disabled}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:bg-gray-50"
            />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
            </div>
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