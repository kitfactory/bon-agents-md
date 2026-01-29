# docs/OVERVIEW.md（入口 / 運用の正本）

この文書は **プロジェクト運用の正本**です。`AGENTS.md` は最小ルールのみで、詳細はここに集約します。

---

## 現在地（必ず更新）
- 現在フェーズ: P1（MVP）
- 今回スコープ（1〜5行）:
  - `bon` CLI のテンプレート生成と出力の見直し（AGENTS + OVERVIEW）
  - スキルのプロジェクト内コピー（エディタ別配置）
- 非ゴール（やらないこと）:
  - 生成物にプロジェクト固有情報を書き込む（例: 具体的な要件/秘密情報/環境依存の値）
- 重要リンク:
  - concept: `./concept.md`
  - spec: `./spec.md`
  - architecture: `./architecture.md`
  - plan: `./plan.md`

---

## Canonical と Phase のルール
- 正本（Canonical）は `docs/` 側（合意の正本）
- `docs/phases/<PHASE>/` は任意（差分＋証跡）
- フェーズ運用を採用した場合、フェーズ完了時に **Phase Close（P3）で正本へ集約**し、フェーズを凍結する

### フェーズ運用の適用条件（任意）
次のいずれかに当てはまる場合のみ、`docs/phases/<PHASE>/` を使う：
- 複数人で進める / レビュー者が複数いる
- 2週間以上の長期・段階的リリース
- 並行で複数の作業塊（フェーズ/ストリーム）が走る
- ユーザーが明示的にフェーズ管理を希望する

当てはまらない場合は **Canonical（`docs/`）のみ**で運用する。

---

## レビューゲート（必ず止まる）
共通原則：**自己レビュー → 完成と判断できたらユーザー確認 → 合意で次へ**

### Gate 定義（成果物とDoD）
#### 全体レベル（Project Gates）
- **G0: Project Concept Review**
  - 更新対象: `docs/concept.md`, `docs/OVERVIEW.md`
  - DoD:
    - 目的/スコープ/非ゴールが明確
    - MVP とフェーズ分割がある
    - Spec ID の枠が揃っている
- **G1: Project Spec & Architecture Review**
  - 更新対象: `docs/spec.md`, `docs/architecture.md`
  - DoD:
    - concept ⇄ spec の対応が取れている（Spec ID）
    - 主要仕様の Given/When/Then（前提/条件/振る舞い）が揃っている
    - 依存方向/I-F/エラー方針が明記されている
- **G2: Project Plan Review**
  - 更新対象: `docs/plan.md`（current/future/archive）
  - DoD:
    - plan(current) が spec をカバーしている
    - 出口/DoD が明確

#### フェーズレベル（Phase Gates：フェーズ運用時のみ）
- **P0: Phase Concept Review**
- **P1: Phase Spec & Architecture Review**
- **P2: Phase Plan Review**
- **P3: Phase Close Gate**

---

## 自己レビューのチェック項目（Step A）
- concept ⇄ spec ⇄ architecture ⇄ plan の整合
- Spec ID の対応（concept ⇄ spec）
- plan が spec をカバーし、DoD（完了条件）が明確
- データモデルが乱立していない（共通属性で集約され、ユーザーI/Fが単純）
- `details/meta` がゴミ箱化していない（キー集合/構造が定義されている）
- 変更が大きい場合は「提案→合意→適用」になっている

---

## 更新の安全ルール（判断用）
### 合意不要
- 誤字修正、リンク更新、意味を変えない追記
- plan のチェック更新
- 小さな明確化（既存方針に沿う）

### 提案→合意→適用（必須）
- 大量削除、章構成変更、移動/リネーム
- Spec ID / Error ID の変更、互換性に影響する仕様変更
- API/データモデルの形を変える設計変更
- セキュリティ/重大バグ修正で挙動が変わるもの
