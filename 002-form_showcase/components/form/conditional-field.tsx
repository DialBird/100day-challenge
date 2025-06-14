"use client";

/**
 * 条件付きフィールドコンポーネント
 * 
 * 他のフィールドの値に応じて表示・非表示を制御するフィールドコンポーネント
 * 複雑な条件式にも対応
 */

import { ReactNode } from "react";
import { useField } from "@tanstack/react-form";
import { useFormContext } from "./form-provider";

type ConditionFunction<TData> = (formData: TData) => boolean;

type ConditionalFieldProps<TData> = {
  condition: ConditionFunction<TData>;
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
};

export function ConditionalField<TData>({
  condition,
  children,
  className = "",
  fallback = null,
}: ConditionalFieldProps<TData>) {
  const { form } = useFormContext<TData>();
  
  // フォーム全体の値を監視
  const shouldShow = condition(form.state.values);

  return (
    <div className={className}>
      {shouldShow ? children : fallback}
    </div>
  );
}

type WatchFieldProps<TData, TWatchName extends keyof TData> = {
  name: TWatchName;
  children: (value: TData[TWatchName]) => ReactNode;
};

export function WatchField<TData, TWatchName extends keyof TData>({
  name,
  children,
}: WatchFieldProps<TData, TWatchName>) {
  const { form } = useFormContext<TData>();
  
  const field = useField({
    form,
    name: name as any,
  });

  return <>{children(field.state.value)}</>;
}

// 便利な条件ヘルパー関数
export const conditions = {
  equals: <TData, TName extends keyof TData>(name: TName, value: TData[TName]) =>
    (formData: TData) => formData[name] === value,
    
  notEquals: <TData, TName extends keyof TData>(name: TName, value: TData[TName]) =>
    (formData: TData) => formData[name] !== value,
    
  isTrue: <TData, TName extends keyof TData>(name: TName) =>
    (formData: TData) => Boolean(formData[name]),
    
  isFalse: <TData, TName extends keyof TData>(name: TName) =>
    (formData: TData) => !Boolean(formData[name]),
    
  isEmpty: <TData, TName extends keyof TData>(name: TName) =>
    (formData: TData) => {
      const value = formData[name];
      return value === null || value === undefined || value === "" || 
             (Array.isArray(value) && value.length === 0);
    },
    
  isNotEmpty: <TData, TName extends keyof TData>(name: TName) =>
    (formData: TData) => {
      const value = formData[name];
      return value !== null && value !== undefined && value !== "" && 
             (!Array.isArray(value) || value.length > 0);
    },
    
  includes: <TData, TName extends keyof TData>(name: TName, value: any) =>
    (formData: TData) => {
      const fieldValue = formData[name];
      return Array.isArray(fieldValue) && fieldValue.includes(value);
    },
    
  greaterThan: <TData, TName extends keyof TData>(name: TName, value: number) =>
    (formData: TData) => Number(formData[name]) > value,
    
  lessThan: <TData, TName extends keyof TData>(name: TName, value: number) =>
    (formData: TData) => Number(formData[name]) < value,
    
  and: <TData>(...conditions: ConditionFunction<TData>[]) =>
    (formData: TData) => conditions.every(condition => condition(formData)),
    
  or: <TData>(...conditions: ConditionFunction<TData>[]) =>
    (formData: TData) => conditions.some(condition => condition(formData)),
    
  not: <TData>(condition: ConditionFunction<TData>) =>
    (formData: TData) => !condition(formData),
};

// 使用例:
// <ConditionalField condition={conditions.equals("type", "premium")}>
//   <PremiumFeatureField />
// </ConditionalField>
//
// <ConditionalField condition={conditions.and(
//   conditions.equals("country", "Japan"),
//   conditions.greaterThan("age", 18)
// )}>
//   <JapanAdultOnlyField />
// </ConditionalField>