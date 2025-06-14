'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Calendar, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  selfIntroduction: string;
  country: string;
  birthDate: Date | undefined;
  hobbies: string[];
  contactMethod: string;
  theme: string;
  language: string;
  notifications: boolean;
  skills: string[];
  newsletter: boolean;
  termsAccepted: boolean;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    firstName: 'たに',
    lastName: 'ぐち',
    email: '',
    age: '',
    selfIntroduction: '',
    country: '',
    birthDate: undefined,
    hobbies: [],
    contactMethod: '',
    theme: 'ライト',
    language: '日本語',
    notifications: true,
    skills: [],
    newsletter: false,
    termsAccepted: false,
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);

  const hobbiesList = ['読書', 'ゲーム', 'スポーツ', '音楽', '料理', '旅行'];
  const contactMethods = ['メール', '電話', '郵送'];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHobbyChange = (hobby: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hobbies: checked 
        ? [...prev.hobbies, hobby]
        : prev.hobbies.filter(h => h !== hobby)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報セクション */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">基本情報</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-light">名前</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="h-10 rounded border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-light">姓</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="h-10 rounded border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-light">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="rememberthatk@icloud.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-10 rounded border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-light">年齢</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="h-10 rounded border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selfIntroduction" className="text-sm font-light">自己紹介</Label>
              <Textarea
                id="selfIntroduction"
                value={formData.selfIntroduction}
                onChange={(e) => handleInputChange('selfIntroduction', e.target.value)}
                maxLength={500}
                className="min-h-24 rounded border-gray-300 resize-none"
              />
              <div className="text-right text-sm text-gray-500">
                {formData.selfIntroduction.length} / 500
              </div>
            </div>
          </section>

          {/* 選択項目セクション */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">選択項目</h2>
            
            <div className="space-y-2">
              <Label className="text-sm font-light">国</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger className="h-10 rounded border-gray-300">
                  <SelectValue placeholder="日本" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="japan">日本</SelectItem>
                  <SelectItem value="usa">アメリカ</SelectItem>
                  <SelectItem value="uk">イギリス</SelectItem>
                  <SelectItem value="china">中国</SelectItem>
                  <SelectItem value="korea">韓国</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-light">生年月日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-start text-left font-normal rounded border-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate ? (
                      format(formData.birthDate, 'yyyy年MM月dd日', { locale: ja })
                    ) : (
                      <span className="text-gray-500">日付を選択</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => handleInputChange('birthDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-light">趣味（複数選択）</Label>
              <div className="grid grid-cols-2 gap-3">
                {hobbiesList.map((hobby) => (
                  <div key={hobby} className="flex items-center space-x-2">
                    <Checkbox
                      id={hobby}
                      checked={formData.hobbies.includes(hobby)}
                      onCheckedChange={(checked) => handleHobbyChange(hobby, checked as boolean)}
                    />
                    <Label htmlFor={hobby} className="text-sm font-light cursor-pointer">
                      {hobby}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-light">希望連絡方法</Label>
              <RadioGroup 
                value={formData.contactMethod} 
                onValueChange={(value) => handleInputChange('contactMethod', value)}
              >
                {contactMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <RadioGroupItem value={method} id={method} />
                    <Label htmlFor={method} className="text-sm font-light cursor-pointer">
                      {method}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </section>

          {/* 条件付きフィールドセクション */}
          <section className="space-y-4 bg-gray-50 p-4 rounded">
            <h2 className="text-sm font-semibold">条件付きフィールド</h2>
            {/* 条件付きフィールドの内容は要求に含まれていないため、プレースホルダーとして残します */}
          </section>

          {/* 設定（ネストオブジェクト）セクション */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">設定（ネストオブジェクト）</h2>
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-600">個人設定</h3>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isSettingsCollapsed ? '展開' : '折りたたみ'}
              </Button>
            </div>

            {!isSettingsCollapsed && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-light">テーマ</Label>
                  <Select value={formData.theme} disabled>
                    <SelectTrigger className="h-10 rounded border-gray-300 opacity-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ライト">ライト</SelectItem>
                      <SelectItem value="ダーク">ダーク</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-light">言語</Label>
                  <Select value={formData.language} disabled>
                    <SelectTrigger className="h-10 rounded border-gray-300 opacity-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="日本語">日本語</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-light">通知を受け取る</Label>
                  <Switch
                    checked={formData.notifications}
                    onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                  />
                </div>
              </div>
            )}
          </section>

          {/* スキル（配列フィールド）セクション */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">スキル（配列フィールド）</h2>
              <Button
                type="button"
                onClick={addSkill}
                size="sm"
                className="h-8"
                disabled={!newSkill.trim()}
              >
                <Plus className="h-3 w-3 mr-1" />
                スキルを追加
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="スキルを入力..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="h-10 rounded border-gray-300"
              />
            </div>

            <div className="space-y-2">
              {formData.skills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-4">アイテムがありません</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newSkill.trim()) {
                        addSkill();
                      }
                    }}
                    disabled={!newSkill.trim()}
                  >
                    最初のスキルを追加
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{skill}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 確認事項セクション */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">確認事項</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                  />
                  <Label htmlFor="newsletter" className="text-sm font-light cursor-pointer">
                    ニュースレターを受け取る
                  </Label>
                </div>
                <p className="text-xs font-light text-gray-600 ml-6">
                  新機能やアップデートに関する情報をお送りします
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                  />
                  <Label htmlFor="terms" className="text-sm font-light cursor-pointer">
                    利用規約に同意する
                  </Label>
                </div>
                <p className="text-xs font-light text-gray-600 ml-6">
                  サービス利用には利用規約への同意が必要です
                </p>
              </div>
            </div>
          </section>

          {/* フッター */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="h-10 px-6"
              disabled={!formData.termsAccepted}
            >
              送信
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
