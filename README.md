# bon-agents-md ⚡️

`bon-agents-md` is a **one-command tool** to generate AI assistant guides (AGENTS.md, etc.).

- Auto-generates guides per editor (Codex CLI / Cursor / Claude Code / Copilot)
- Keeps concept / spec / architecture / plan **linked by Spec IDs**
- Separates project-specific details into `docs/` to reduce AI misreads/misgeneration

Use it as a **starter kit** when you want a fast design guide for AI, and to cut spec drift and rework.

---

## Why bon? 🌈

| You want | bon gives you |
| --- | --- |
| High-quality concept/spec/architecture/plan templates | Spec-ID-linked guardrails with clear approval points |
| Unambiguous specs | Headings with Spec IDs + numbered Given / When / Then and error behaviors |
| AI-ready architecture know-how | Layer responsibilities + key interfaces, with “no god API/data” baked in |
| Quick, crystal-clear samples | One-line success/failure examples with Error IDs matching implementation messages |
| Multi-editor outputs | Automatically picks `AGENTS.md` / `.cursorrules` / `copilot-instructions.md` for codex/cursor/claudecode/copilot |

---

## Install

```bash
npm install -g bon-agents-md
```

Requires Node.js 16+

---

## Usage

```bash
bon                     # generate guide + docs/OVERVIEW.md (if missing), locale auto-detected
bon --dir path/to       # set output directory (creates if missing)
bon --force             # overwrite existing guide file
bon --lang ts           # choose python|js|ts|rust (default: python)
bon --editor cursor     # choose codex|cursor|claudecode|copilot (default: codex)
bon --help              # show help
bon --version           # show version
```

---

## Generated structure

### Editor-facing guides
- Codex / Claude Code: `AGENTS.md`
- Cursor: `.cursorrules`
- Copilot: `copilot-instructions.md`

### Project docs (`docs/`)
- `docs/OVERVIEW.md` (created if missing)
  - Single entrypoint: current status + scope + links + operating rules
- Minimal stubs are also created if missing (you fill in project specifics):
  - `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`

### Project-local skills
bon copies bundled skills into the project (no global install), based on the target editor:
- codex / claudecode: `./.codex/skills`
- cursor: `./.cursor/skills`
- copilot: `./.github/copilot/skills`

---

## Template guidance 🎯
- Locale: detect `LANG` / `LC_ALL` / OS (WSL prefers Windows) and emit JA/EN accordingly.
- Docs-first: AGENTS is lean and points to `docs/OVERVIEW.md`; project specifics live under `docs/`.
- Concept: Spec ID feature table with dependencies/phases; get agreement when created/updated.
- Spec: Spec IDs in headings; Given / When / Then; validation and errors numbered, with an error/message list.
- Architecture: Layers + interfaces spelled out; no god API/data; fixed error format (e.g., `[bon][E_EDITOR_UNSUPPORTED] ...`).
- Plan: current/future/archive; current is a checklist; get agreement when the plan is done.
- Samples/snippets: one-line success + one-line failure with Error IDs matching implementation.
- `.env`: no `.env.sample`; AGENTS tells required keys and where they’re used.

---

## Locale and writing style
- Locale from `LANG` / `LC_ALL` / OS (WSL prefers Windows).
- If Japanese: docs are in Japanese; code comments are bilingual to keep both humans and AI on the same page.

---

## Development

Tests:

```bash
npm test
```

PRs and feedback are welcome.
