# bon-agents-md 仕様書

## 概要
- `bon` CLI は、指定ディレクトリに AGENTS.md を生成するツール。npm のグローバルインストール前提。
- 対応 AI エディタ: `codex` / `cursor` / `claudecode` / `copilot`（未指定時は `codex`）。
- 対応プログラミング言語: Python / JavaScript / TypeScript / Rust（未指定時は Python）。
- ターミナル言語に応じて AGENTS.md を日/英で生成。判定不可時は英語。
- 生成する AGENTS.md はプロジェクト固有情報を直接書かず、`docs/` 配下（concept/spec/architecture など）を読むようガイドする共通テンプレートとする。
- 出力ファイル名はエディタに合わせる: codex/claudecode は `AGENTS.md`、cursor は `.cursorrules`、copilot は `copilot-instructions.md`。
- `docs/` に concept/spec/architecture が無い場合は作成を推奨し、`docs/plan.md` のチェックリストを使って進めるようテンプレートで案内する。

## 言語・エディタ判定
- 言語優先順位: ユーザー入力 `--lang` > `LANG`/`LC_ALL` > OS 推定。WSL の場合は Windows 側の言語設定を優先して推定。
- エディタ指定: `--editor codex|cursor|claudecode|copilot`（未指定は codex）。

## CLI インターフェース
- `bon [--dir <path>] [--force] [--lang <python|js|ts|rust>] [--editor <...>] [--help] [--version]`
- `--dir`: 生成先ディレクトリ（既定: 現在ディレクトリ）。存在しない場合は再帰作成。
- `--force`: 既存の AGENTS.md を上書き。
- `--help`/`--version`: 情報表示のみで終了。

## 生成物
- `AGENTS.md` を生成。既存があり `--force` でない場合はエラー。
- `.env.sample` は生成しない。環境変数や `.env` の必要事項は AGENTS.md に記載させる。

## AGENTS.md の必須構成
- 要件定義: 想定ユーザー、困りごと、ユースケース、機能一覧、使用ライブラリ、ソフトウェア全体設計を必須項目として列挙。
- 仕様/要求仕様: 英語は Given/When/Then、日本語は 前提/条件/振る舞い 形式で記述する指針を明記。
- 設計: レイヤー構造と単一責務。抽象クラスを設け、DI しやすい設計を促す。ゴッドクラスや雑多なヘルパーは禁止し、シンプルなインターフェースを提示。
- テスト方針: 機能・レイヤー単位で完了させる。モックは補助で、実通信・実接続が通ったら完了扱い。必要な環境変数・接続情報・`.env` の配置場所と例を指示（サンプルファイル生成はしない）。テストが難航した場合はステップごとにデバッグメッセージを追加する方針を明記。
- ドキュメント参照: プロジェクト詳細は AGENTS.md に直接持たず、`docs/` の concept/spec/architecture を参照するよう明示する。

## 言語別テンプレート要件
- Python: `uv` + `.venv` 仮想環境、`pytest`、Lint/Format（`ruff`/`black` など）、必要な環境変数の例を記載。
- JavaScript: Node.js + `pnpm`/`npm`、テスト（Vitest/Jest）、Lint/Format（ESLint/Prettier）、`.env` の利用箇所と必要キーを指示。
- TypeScript: JS と同様 + `tsc --noEmit` での型チェック、型境界の設計指針。
- Rust: `cargo` ワークスペース推奨、`cargo fmt` / `cargo clippy` / `cargo test`、feature flag 設計と実機テスト導線。
- 共通方針: `.env.sample` は自動生成しない。`.env` や環境変数の必要キーと利用箇所は AGENTS.md で明示する。

## ロケールと言語切替
- 日本語出力: `LANG`/`LC_ALL` が ja 系、またはユーザーが日本語を指定した場合。
- 英語出力: 上記以外、または判定不可時。

## テスト
- CLI オプション（dir/force/lang/editor/help/version）の動作確認。
- 言語切替の出力確認（日/英）。
- 各言語テンプレートの差分確認（Python/JS/TS/Rust）。
- エディタ指定がテンプレートに反映されることを確認。
- 上書き防止と `--force` の挙動を確認。
