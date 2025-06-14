"use client";

/**
 * 配列フィールドコンポーネント
 * 
 * 動的に要素を追加・削除可能な配列フィールドを提供
 * useFieldArrayと連携して配列の操作を行う
 */

import { ReactNode } from "react";
import { useField, FieldApi } from "@tanstack/react-form";
import { useFormContext } from "./form-provider";

type ArrayFieldProps<TData, TName extends keyof TData, TItem> = {
  name: TName;
  label?: string;
  children: (field: FieldApi<TItem[], number, any, any>, index: number, item: TItem) => ReactNode;
  defaultItem: TItem;
  className?: string;
  addButtonText?: string;
  removeButtonText?: string;
  minItems?: number;
  maxItems?: number;
};

export function ArrayField<TData, TName extends keyof TData, TItem>({
  name,
  label,
  children,
  defaultItem,
  className = "",
  addButtonText = "追加",
  removeButtonText = "削除",
  minItems = 0,
  maxItems,
}: ArrayFieldProps<TData, TName, TItem>) {
  const { form } = useFormContext<TData>();
  
  const field = useField({
    form,
    name: name as any,
    defaultValue: [] as any,
  });

  const items = Array.isArray(field.state.value) ? (field.state.value as TItem[]) : [];

  const addItem = () => {
    if (maxItems && items.length >= maxItems) return;
    field.handleChange([...items, defaultItem] as any);
  };

  const removeItem = (index: number) => {
    if (items.length <= minItems) return;
    const newItems = items.filter((_, i) => i !== index);
    field.handleChange(newItems as any);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    field.handleChange(newItems as any);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <button
            type="button"
            onClick={addItem}
            disabled={maxItems ? items.length >= maxItems : false}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {addButtonText}
          </button>
        </div>
      )}

      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {field.state.meta.errors.join(", ")}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                #{index + 1}
              </span>
              <div className="flex items-center space-x-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveItem(index, index - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="上に移動"
                  >
                    ↑
                  </button>
                )}
                {index < items.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveItem(index, index + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="下に移動"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= minItems}
                  className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                >
                  {removeButtonText}
                </button>
              </div>
            </div>
            
            <ArrayItemField
              name={name}
              index={index}
              onUpdate={(updatedItem) => {
                const newItems = [...items];
                newItems[index] = updatedItem;
                field.handleChange(newItems as any);
              }}
            >
              {(itemField) => children(itemField, index, item)}
            </ArrayItemField>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>アイテムがありません</p>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            最初の{addButtonText}
          </button>
        </div>
      )}
    </div>
  );
}

type ArrayItemFieldProps<TData, TName extends keyof TData, TItem> = {
  name: TName;
  index: number;
  onUpdate: (item: TItem) => void;
  children: (field: FieldApi<TItem[], number, any, any>) => ReactNode;
};

function ArrayItemField<TData, TName extends keyof TData, TItem>({
  name,
  index,
  onUpdate,
  children,
}: ArrayItemFieldProps<TData, TName, TItem>) {
  const { form } = useFormContext<TData>();
  
  const field = useField({
    form,
    name: `${String(name)}[${index}]` as any,
  });

  return <>{children(field)}</>;
}