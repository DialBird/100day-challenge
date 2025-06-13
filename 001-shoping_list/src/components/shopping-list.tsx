import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Trash2, Check, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [celebration, setCelebration] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem('shopping-list')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('shopping-list', JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addItem = () => {
    if (inputValue.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: inputValue.trim(),
        completed: false,
      };
      setItems([...items, newItem]);
      setInputValue('');
    }
  };

  const toggleItem = (id: string, event?: React.MouseEvent) => {
    const item = items.find(item => item.id === id);
    if (item && !item.completed && event) {
      // アイテムがチェックされる場合、クリック位置を記録
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setCelebration({
        id,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      // 3秒後にエフェクトをクリア
      setTimeout(() => setCelebration(null), 3000);
    }
    
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Celebration Effect Component  
  function CelebrationEffect({ x, y }: { x: number; y: number }) {
    const petals = ['🌸', '🌺', '🌼', '🌻', '🌷', '💐', '✨', '🎉'];
    
    return (
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const radius = 120;
          const x25 = Math.cos(angle) * radius * 0.25;
          const y25 = Math.sin(angle) * radius * 0.25 - 20;
          const x50 = Math.cos(angle) * radius * 0.5;
          const y50 = Math.sin(angle) * radius * 0.5 + 10;
          const x75 = Math.cos(angle) * radius * 0.75;
          const y75 = Math.sin(angle) * radius * 0.75 + 40;
          const x100 = Math.cos(angle) * radius;
          const y100 = Math.sin(angle) * radius + 80;
          
          return (
            <div
              key={i}
              className="absolute text-xl celebration-petal"
              style={{
                '--x-25': `${x25}px`,
                '--y-25': `${y25}px`,
                '--x-50': `${x50}px`,
                '--y-50': `${y50}px`,
                '--x-75': `${x75}px`,
                '--y-75': `${y75}px`,
                '--x-100': `${x100}px`,
                '--y-100': `${y100}px`,
                animationDelay: `${i * 0.1}s`,
              } as React.CSSProperties & { [key: string]: string }}
            >
              {petals[i % petals.length]}
            </div>
          );
        })}
      </div>
    );
  }

  // Sortable Item Component
  function SortableItem({ item }: { item: ShoppingItem }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`p-4 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${
          isDragging ? 'opacity-50 rotate-3 scale-105' : 'hover:scale-[1.02]'
        } ${
          item.completed ? 'bg-green-50/80 opacity-75' : 'bg-white/80'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={(e) => toggleItem(item.id, e)}
            className={`w-6 h-6 rounded-full border-2 transition-colors duration-200 flex items-center justify-center ${
              item.completed
                ? 'bg-green-500 border-green-500 hover:bg-green-600'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {item.completed && (
              <Check className="w-4 h-4 text-white" />
            )}
          </button>
          <span className={`flex-1 ${
            item.completed ? 'text-gray-600 line-through' : 'text-gray-800'
          }`}>
            {item.name}
          </span>
          <Button
            onClick={() => deleteItem(item.id)}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full text-white">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h1 className="text-3xl text-gray-800">買い物リスト</h1>
          </div>
          
          {totalCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <span className="bg-blue-100 px-3 py-1 rounded-full">
                {completedCount}/{totalCount}個完了
              </span>
              {allCompleted && (
                <span className="text-2xl animate-bounce">🎉</span>
              )}
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <Card className="p-6 mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="商品名を入力..."
              className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-12"
            />
            <Button
              onClick={addItem}
              disabled={!inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-xl h-12 min-w-[100px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 mr-2" />
              追加
            </Button>
          </div>
        </Card>

        {/* Items List or Empty State */}
        {totalCount === 0 ? (
          <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-600 mb-2">リストが空です</h3>
              <p className="text-gray-500">商品を追加してください</p>
            </div>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Celebration Effect */}
        {celebration && (
          <CelebrationEffect x={celebration.x} y={celebration.y} />
        )}

        {/* All Completed Celebration */}
        {allCompleted && (
          <Card className="mt-6 p-6 text-center bg-gradient-to-r from-green-400 to-blue-500 text-white border-0 shadow-lg">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl mb-1">おめでとうございます！</h3>
            <p>すべてのアイテムが完了しました</p>
          </Card>
        )}
      </div>
    </div>
  );
}
