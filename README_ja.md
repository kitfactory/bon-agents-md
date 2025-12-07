# bon-agents-md ⚡️

`bon` コマンドひとつで、AI アシスタント向けの AGENTS.md を生成します。テンプレートは軽量で、プロジェクト固有情報は `docs/` に逃がしつつ、concept/spec/architecture/plan の書き方を明示して AI の誤生成を防ぎます。人間の合意を通しやすくし、AI の暴走を抑えつつ、セットアップを一瞬で終わらせるためのツールです。ワンコマンドでガイドが揃うので、開発を始めるのがちょっと楽しくなります。🎉

## なんで bon？🌈

| 求めるもの | bon がくれるもの |
| --- | --- |
| concept/spec/architecture/plan の高品質な型 | Spec ID で連携し、合意ポイントも明示するガードレール |
| ぶれない仕様記述 | 見出しに Spec ID を入れた Given/When/Then で振る舞いを正確に記載 |
| AI でも安心な設計ノウハウ | レイヤー責務＋主要 I/F を提示し、ゴッド API/データ禁止をビルトイン |
| すぐ試せるサンプル | 成功/失敗の短い例（Error ID 付き、実装メッセージと一致）で期待値を固定 |
| マルチエディタ対応 | codex/cursor/claudecode/copilot 向けに `AGENTS.md` / `.cursorrules` / `copilot-instructions.md` を自動選択 |

## インストール

```bash
npm install -g bon-agents-md
```

要件: Node.js 16+

## 使い方

```bash
bon                     # ロケール自動判定で AGENTS.md を生成
bon --dir path/to       # 出力先ディレクトリを指定（無ければ作成）
bon --force             # 既存ファイルを上書き
bon --lang ts           # python|js|ts|rust から言語ガイダンスを選択（既定: python）
bon --editor cursor     # codex|cursor|claudecode|copilot からエディタを選択（既定: codex）
bon --help              # ヘルプ表示
bon --version           # バージョン表示
```

## テンプレートが指示すること 🎯
- ロケール対応: `LANG`/`LC_ALL`/OS から日本語・英語を判定（WSL は Windows 優先）。該当言語でテンプレートを出力。
- ドキュメントは `docs/` へ: AGENTS.md は共通テンプレートのみ。プロジェクト固有の背景や詳細は `docs/concept.md` / `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に記載。
- concept: 機能表に Spec ID・依存関係・MVP/フェーズを記載。作成・更新時は必ずユーザーと合意する。
- spec: 機能グループごとに章立てし、Spec ID を併記した番号付き Given/When/Then で記述。入力バリデーションやエラー挙動も番号付きで整理し、エラー/メッセージは一覧表で管理。
- architecture: レイヤー責務・依存方向と主要 I/F を明示。API は最小粒度・最小引数、データ属性は必要最小限（ゴッド API/データ禁止）。非機能は過剰に固定しないが、ログ/エラー方針（例: `[bon][E1] ...`）は明示。
- plan: フェーズ別チェックリスト。plan ができたタイミングでもユーザー合意を取る。
- サンプル/スニペット: 成功と失敗の例を各 1 行入れる。Error ID を必ず含め、実装の文言と完全一致させる。例: 成功 `bon --dir ./project --lang ts --editor cursor` → `.cursorrules`、失敗 `bon --editor unknown` → `[bon][E2] Unsupported editor: ...`。
- `.env`: `.env.sample` は生成しない。必要なキーと利用箇所を AGENTS.md で指示する。

## 文書ごとの工夫とサンプル
- Concept (`docs/concept.md`): Spec ID 付き機能表で依存関係とフェーズを明示。例: `F2 | テンプレート生成 | AGENTS.md/.cursorrules/... | フェーズ1 | F1 依存`。
- Spec (`docs/spec.md`): 見出しに Spec ID を併記し、前提/条件/振る舞いで行動を記述。例タイトル: `4.1 [F2] --dir を指定した場合、ディレクトリを再帰的に作成する`。
- Architecture (`docs/architecture.md`): レイヤー責務と主要 I/F を列挙し、ゴッド API/データ禁止。ログ/エラー形式サンプル: `[bon][E2] Unsupported editor: ...`。
- Plan (`docs/plan.md`): フェーズ別チェックリスト。完成時にユーザー合意を取ることを明記。
- AGENTS 内サンプル: 成功 `bon --dir ./project --lang ts --editor cursor` → `.cursorrules`、失敗 `bon --editor unknown` → `[bon][E2] Unsupported editor: ...`。

## 出力されるファイル名
- codex/claudecode: `AGENTS.md`
- cursor: `.cursorrules`
- copilot: `copilot-instructions.md`

## この構成の狙い（メリット）✨
- concept→spec→architecture→plan を Spec ID でトレースし、合意ポイントを明示して誤解を減らす（人が主導権を持てる）。
- 日本語テンプレート時はドキュメントを日本語、コードコメントを日英併記とする指針で、ロケール差分の迷子を防ぐ。
- API/データのスリム化とエラー文言の固定で、AI が不要な生成や改変をしにくくし、ログ/エラーも一貫。
- 例示は最小限かつ Error ID 付きの成功/失敗サンプルで期待値をピン留めし、オンボーディングを楽にする。
- `.env.sample` を作らず秘密を入れない/漏らさない方針をデフォルト化し、安全に素早く始められる。

## 開発
- テスト: `npm test`
