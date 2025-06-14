"use client";

/**
 * フォームプロバイダー
 * 
 * TanStack Formを使用したフォーム状態の管理とZodバリデーションを提供する
 * 汎用的なフォームプロバイダーコンポーネント
 */

import { ReactNode, createContext, useContext } from "react";
import { useForm, FormApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

type FormContextValue<TData> = {
  form: FormApi<TData, any>;
};

const FormContext = createContext<FormContextValue<any> | null>(null);

export function useFormContext<TData>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as FormContextValue<TData>;
}

type FormProviderProps<TData> = {
  children: ReactNode;
  defaultValues: TData;
  validationSchema?: z.ZodSchema<TData>;
  onSubmit: (data: TData) => void | Promise<void>;
  onValidate?: (data: TData) => Record<string, string> | Promise<Record<string, string>>;
};

export function FormProvider<TData>({
  children,
  defaultValues,
  validationSchema,
  onSubmit,
  onValidate,
}: FormProviderProps<TData>) {
  const form = useForm({
    defaultValues,
    validatorAdapter: validationSchema ? zodValidator() : undefined,
    validators: validationSchema ? {
      onChange: validationSchema,
    } : undefined,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    onValidate,
  });

  return (
    <FormContext.Provider value={{ form }}>
      {children}
    </FormContext.Provider>
  );
}

type FormProps = {
  children: ReactNode;
  className?: string;
};

export function Form({ children, className = "" }: FormProps) {
  const { form } = useFormContext();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={className}
    >
      {children}
    </form>
  );
}