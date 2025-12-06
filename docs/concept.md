# bon-agents-md コンセプト

bon-agents-md は、AI エディタが安全かつ効率的に作業できる環境を素早く用意するための CLI です。`bon` コマンドひとつで、プロジェクトに最適化された AGENTS.md を生成します。

- AI エディタ用の必須コンテキストをまとめた AGENTS.md を自動生成し、初期セットアップの手間を削減する。
- ターミナルの言語設定を検知し、日本語・英語いずれかで AGENTS.md を生成する（判定不可の場合は英語）。
- 指定されたプログラミング言語に合わせて、適切な構成・内容の AGENTS.md を作成する（Python / JavaScript / TypeScript / Rust に対応）。
- Python を指定された場合は、`uv` + `.venv` 仮想環境、pytest、Lint などの推奨セットアップを案内するテンプレートを作成する。
- JavaScript / TypeScript を指定された場合は、Node.js + `pnpm`/`npm`、型チェック（TS）、テストランナー（Vitest/Jest など）、Lint/Format（ESLint/Prettier）を推奨。
- Rust を指定された場合は、`cargo` ワークスペース、`cargo fmt` / `cargo clippy` / `cargo test` の導線を含める。
- 対応 AI エディタは codex / cursor / claudecode / copilot。指定がない場合は codex 向けの AGENTS.md を作成する。
- プログラミング言語が無指定のときは Python を前提に、ターミナルの言語が推定できない場合は英語で生成する。
- 言語判定の優先順位：ユーザー指定 > `LANG`/`LC_ALL` > OS 推定。WSL の場合は Windows 側の言語設定を優先して推定する。
- 生成する AGENTS.md はプロジェクト固有の情報を直接書かず、必ず `docs/` 配下のドキュメント（concept/spec/architecture など）を参照してプロジェクトを把握するようガイドする。共通テンプレートとして使い回せるようにする。
- エディタに応じて出力ファイル名を変える: codex/claudecode は `AGENTS.md`、cursor は `.cursorrules`、copilot は `copilot-instructions.md`。
- `docs/` に concept/spec/architecture が無い場合は作成を促す文面をテンプレートに含め、作業手順として `docs/plan.md` のチェックリストを利用するよう案内する。

この仕組みにより、チームやプロジェクトごとのガイドライン・ツールチェーン・安全対策を素早く共有し、AI エディタが誤操作を避けながら高品質な支援を行えるようになります。

## AGENTS.md が必ず含む観点

- 要件定義：想定ユーザーと困りごとを明確化し、必要なユースケース・機能一覧・使用するライブラリ・ソフトウェア全体設計を必須項目として記載。
- 仕様書/要求仕様：英語は Given/When/Then、日本語は 前提/条件/振る舞い で記述。
- 設計：レイヤー構造と単一責務を守り、抽象クラスを用いて DI しやすい設計とする。ゴッドクラスや雑多なヘルパー関数は避け、シンプルなインターフェースを提供する。
- テスト方針：機能・レイヤー単位で完了させる。モックは補助であり、実通信・実接続まで動作したときに機能完了とみなす。必要な環境変数や接続情報、`.env` を含む秘密情報の取得・読み込み手順（例: `.env` の設置場所、環境変数を使うコードパス、設定例）を AGENTS.md に明示する。`.env.sample` の自動生成は行わず、ユーザーに必要なキーと設定例を示す。テスト修正が難航する場合は各ステップでデバッグメッセージを追加して原因を特定する。

## 言語別テンプレートの要点

- Python: `uv` + `.venv` 仮想環境、`pytest`、Lint/Format（`ruff`/`black` など）、環境変数例の提示。
- JavaScript: Node.js + `pnpm`/`npm`、テスト（Vitest/Jest）、Lint/Format（ESLint/Prettier）。`.env` の必要キーと利用箇所を AGENTS.md で指示し、サンプルファイルは生成しない。
- TypeScript: 上記 JS に加えて型チェック（`tsc --noEmit`）と型境界の設計指針。
- Rust: `cargo` ワークスペース推奨、`cargo fmt` / `cargo clippy` / `cargo test`、feature flag の設計指針と実機テストの導線。
