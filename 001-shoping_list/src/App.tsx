import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Label } from './components/ui/label'

interface ShoppingItem {
  id: string
  name: string
  completed: boolean
}

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [inputValue, setInputValue] = useState('')
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
        completed: false
      }
      setItems([...items, newItem])
      setInputValue('')
    }
  }

  const toggleComplete = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              🛒 買い物リスト
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-input">商品を追加</Label>
              <div className="flex gap-2">
                <Input
                  id="item-input"
                  type="text"
                  placeholder="商品名を入力..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={addItem} disabled={!inputValue.trim()}>
                  追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              商品一覧 ({items.filter(item => !item.completed).length}/{items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                商品を追加してください
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      item.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleComplete(item.id)}
                      className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed
                          ? 'text-green-700 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {item.name}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      削除
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {items.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            購入済み: {items.filter(item => item.completed).length}個
          </div>
        )}
      </div>
    </div>
  )
}

export default App
