"use client";

/**
 * Conform フォームフィールド基底コンポーネント
 * 
 * Conformと連携し、エラーハンドリングとラベル表示を統一するベースコンポーネント
 */

import { ReactNode } from "react";
import { getFieldsetProps, getInputProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";

type ConformFieldProps = {
  field: FieldMetadata<any>;
  label?: string;
  children: (props: any) => ReactNode;
  className?: string;
};

export function ConformField({
  field,
  label,
  children,
  className = "",
}: ConformFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children(getInputProps(field, { type: "text" }))}
      {field.errors && field.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.errors.join(", ")}
        </div>
      )}
    </div>
  );
}

type ConformFieldsetProps = {
  field: FieldMetadata<any>;
  label?: string;
  children: ReactNode;
  className?: string;
};

export function ConformFieldset({
  field,
  label,
  children,
  className = "",
}: ConformFieldsetProps) {
  const fieldset = getFieldsetProps(field);
  
  return (
    <fieldset {...fieldset} className={`space-y-4 ${className}`}>
      {label && (
        <legend className="text-lg font-medium text-gray-900 mb-4">
          {label}
        </legend>
      )}
      {children}
      {field.errors && field.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.errors.join(", ")}
        </div>
      )}
    </fieldset>
  );
}