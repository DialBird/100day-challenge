import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false)

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

  const toggleItem = (id: string) => {
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
              onKeyPress={handleKeyPress}
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
          <div className="space-y-3">
            {/* Incomplete Items */}
            {items.filter(item => !item.completed).map(item => (
              <Card
                key={item.id}
                className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 flex items-center justify-center"
                  >
                    {item.completed && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                  <span className="flex-1 text-gray-800">{item.name}</span>
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
            ))}

            {/* Completed Items */}
            {items.filter(item => item.completed).map(item => (
              <Card
                key={item.id}
                className="p-4 bg-green-50/80 backdrop-blur-sm border-0 shadow-lg opacity-75"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <span className="flex-1 text-gray-600 line-through">{item.name}</span>
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
            ))}
          </div>
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
