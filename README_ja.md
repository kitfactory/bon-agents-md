# bon-agents-md ⚡️

`bon-agents-md` は、AI アシスタント向けのガイド（AGENTS.md など）を  
**ワンコマンドで生成するためのツール**です。

- 各エディタ（Codex CLI / Cursor / Claude Code / Copilot）ごとのガイドを自動生成
- concept / spec / architecture / plan を **Spec ID でひとつながり**に管理
- プロジェクト固有の情報は `docs/` に分離して、AI の誤読・誤生成を抑制

「まず AI に渡す設計ガイドをサッと用意したい」「仕様のブレや手戻りを減らしたい」
ときの**スターターキット**として使えます。

---

## なにが嬉しいの？（メリット）✨

### 1. AGENTS ガイドを数秒で用意できる
- `bon` コマンドを 1 回実行するだけで、エディタごとに最適化されたガイドを生成  
  - Codex / Claude Code: `AGENTS.md`  
  - Cursor: `.cursorrules`  
  - Copilot: `copilot-instructions.md`
- 「まずこのファイルを AI に読ませればいい」という状態をすぐ作れます。

### 2. concept/spec/architecture/plan が一貫した「型」になる
- `docs/OVERVIEW.md` を生成し（無ければ作成）、運用の入口とリンク集を用意
- `docs/concept.md` / `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` は無ければ最小テンプレを作成し、プロジェクト固有内容はあなたが管理
- すべて **Spec ID** で連携されるので、
  - 機能 → 仕様 → 実装レイヤー → 開発計画  
  がトレースしやすくなります。
- plan は current / future / archive で管理します。
- 人間どうしの合意ポイントも明示されるため、レビューや相談がしやすくなります。

### 3. AI に渡しても「暴走しにくい」設計ノウハウをビルトイン
- Spec は Given / When / Then 形式で、見出しに Spec ID を併記  
  → 「どの条件でどう動くか」を AI にも人にも誤解させにくい
- Architecture はレイヤー責務と主要 I/F を明示し、  
  **ゴッド API / ゴッドデータ** を避ける指針を含めます。
- エラーは Error ID（例: `[bon][E_EDITOR_UNSUPPORTED] ...`）付きで固定し、  
  ログ・メッセージの表現が AI に壊されにくくなります。

### 4. サンプルが短くハッキリしていて、期待値を合わせやすい
- 成功パターン / 失敗パターンを 1 行ずつ用意し、Error ID も付けてあります。
- 「こういう入力のときに、こういうログ・エラーが出る」が一目で分かるため、  
  AI にとっても人にとっても**挙動のイメージが揃えやすい**構成です。

### 5. .env の扱いも安全寄りのデフォルト
- `.env.sample` は自動生成しません。
- 必要な環境変数と利用箇所だけを AGENTS ガイド側で指示するスタイルにすることで、  
  「とりあえず秘密を書いちゃった」事故を減らします。

---

## インストール

```bash
npm install -g bon-agents-md
```

- 要件: Node.js 16+

---

## 使い方

```bash
bon                     # ロケール自動判定でガイド + docs/OVERVIEW.md（無ければ作成）を生成
bon --dir path/to       # 出力先ディレクトリを指定（無ければ作成）
bon --force             # 既存ガイドファイルを上書き
bon --lang ts           # python|js|ts|rust から言語ガイダンスを選択（既定: python）
bon --editor cursor     # codex|cursor|claudecode|copilot からエディタを選択（既定: codex）
bon --help              # ヘルプ表示
bon --version           # バージョン表示
```

---

## 生成されるファイル構成

### エディタ向けガイド

- Codex / Claude Code: `AGENTS.md`
- Cursor: `.cursorrules`
- Copilot: `copilot-instructions.md`

### プロジェクト固有ドキュメント（`docs/` 配下）

- `docs/OVERVIEW.md`（無ければ作成）
  - 入口（現在地・スコープ・重要リンク・運用ルール）
- それ以外（プロジェクト固有の正本）はあなたが用意:
  - `docs/concept.md` / `docs/spec.md` / `docs/architecture.md` / `docs/plan.md`

### プロジェクト内スキル配置
bon はスキルを**プロジェクト内**にコピーします（グローバルには入れません）:
- codex / claudecode: `./.codex/skills`
- cursor: `./.cursor/skills`
- copilot: `./.github/copilot/skills`

---

## ロケールと記述方針

- `LANG` / `LC_ALL` / OS 設定からロケールを判定（WSL は Windows 側を優先）
- 日本語ロケールの場合:
  - ドキュメントは日本語
  - コードコメントは日英併記推奨  
  → チーム内での読みやすさと、AI にとっての理解しやすさの両立を狙います。

---

## 開発

- テスト:

```bash
npm test
```

PR やフィードバックも歓迎です。
