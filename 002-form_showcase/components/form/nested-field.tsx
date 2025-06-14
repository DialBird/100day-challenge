"use client";

/**
 * ネストドフィールドコンポーネント
 * 
 * オブジェクト型のフィールドを階層構造で管理するコンポーネント
 * 深いネストにも対応し、各階層でのバリデーションを提供
 */

import { ReactNode } from "react";
import { useField, FieldApi } from "@tanstack/react-form";
import { useFormContext } from "./form-provider";

type NestedFieldProps<TData, TName extends keyof TData, TNestedData> = {
  name: TName;
  label?: string;
  children: (field: FieldApi<TNestedData, keyof TNestedData, any, any>, data: TNestedData) => ReactNode;
  defaultValue: TNestedData;
  className?: string;
  collapsible?: boolean;
  initiallyCollapsed?: boolean;
};

export function NestedField<TData, TName extends keyof TData, TNestedData>({
  name,
  label,
  children,
  defaultValue,
  className = "",
  collapsible = false,
  initiallyCollapsed = false,
}: NestedFieldProps<TData, TName, TNestedData>) {
  const { form } = useFormContext<TData>();
  
  const field = useField({
    form,
    name: name as any,
    defaultValue: defaultValue as any,
  });

  const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed);

  const nestedData = (field.state.value as TNestedData) || defaultValue;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isCollapsed ? "展開" : "折りたたみ"}
            </button>
          )}
        </div>
      )}

      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.state.meta.errors.join(", ")}
        </div>
      )}

      {(!collapsible || !isCollapsed) && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <NestedFormProvider parentName={name} parentForm={form} data={nestedData}>
            {children(field, nestedData)}
          </NestedFormProvider>
        </div>
      )}
    </div>
  );
}

type NestedFormProviderProps<TData, TName extends keyof TData, TNestedData> = {
  parentName: TName;
  parentForm: any;
  data: TNestedData;
  children: ReactNode;
};

function NestedFormProvider<TData, TName extends keyof TData, TNestedData>({
  parentName,
  parentForm,
  data,
  children,
}: NestedFormProviderProps<TData, TName, TNestedData>) {
  return <>{children}</>;
}

type NestedFieldSubFieldProps<TData, TName extends keyof TData, TNestedData, TSubName extends keyof TNestedData> = {
  parentName: TName;
  name: TSubName;
  label?: string;
  children: (field: FieldApi<TNestedData, TSubName, any, any>) => ReactNode;
  className?: string;
};

export function NestedFieldSubField<TData, TName extends keyof TData, TNestedData, TSubName extends keyof TNestedData>({
  parentName,
  name,
  label,
  children,
  className = "",
}: NestedFieldSubFieldProps<TData, TName, TNestedData, TSubName>) {
  const { form } = useFormContext<TData>();
  
  const field = useField({
    form,
    name: `${String(parentName)}.${String(name)}` as any,
  });

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={`${String(parentName)}.${String(name)}`} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children(field)}
      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.state.meta.errors.join(", ")}
        </div>
      )}
    </div>
  );
}

// React importを追加
import React from "react";