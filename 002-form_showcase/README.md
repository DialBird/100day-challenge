# フォームのショーケース

## 目的

> conformとTanStack Formを使ってフォームを作成する

- TanStack Form を用いて、以下の要件をすべて満たす汎用性の高いフォーム コンポーネント群を自動生成する。
- ネスト構造
- 配列フィールド
- 外部バリデーションスキーマ連携（Zod）
- カスタム UI ライブラリ連携（Input, Select, DatePicker など）

## 実装内容
1.	フォーム プロバイダー
2.	基本フィールド（Text, Number, Select, Checkbox, Radio, DatePicker）
3.	配列フィールド（useFieldArray を使った動的追加／削除）
4.	ネストドフォーム（オブジェクト型フィールドの階層構造）
5.	条件付きフィールド（他フィールド値に応じた表示制御）
6.	バリデーション（Zod スキーマによる sync/async バリデーション）
