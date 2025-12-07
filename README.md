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
bon                     # generate AGENTS.md / .cursorrules, locale auto-detected
bon --dir path/to       # set output directory (creates if missing)
bon --force             # overwrite existing file
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
- `docs/concept.md`
  - Feature table with Spec IDs, dependencies, MVP/phases
  - Example: `F2 | Template generation | AGENTS.md/.cursorrules/... | Phase1 | depends on F1`
- `docs/spec.md`
  - Chapters per feature group
  - Headings include Spec IDs; numbered Given / When / Then
  - Input validation and error behaviors are numbered; errors/messages kept in a list
- `docs/architecture.md`
  - Layer responsibilities, dependencies, key interfaces
  - Minimal APIs/args, forbid god API/data
  - Log/error format sample (e.g., `[bon][E2] Unsupported editor: ...`)
- `docs/plan.md`
  - Checklists by phase
  - Explicitly get user agreement when the plan is ready

---

## Template guidance 🎯
- Locale: detect `LANG` / `LC_ALL` / OS (WSL prefers Windows) and emit JA/EN accordingly.
- Docs-first: AGENTS is generic; project specifics go into concept/spec/architecture/plan under `docs/`.
- Concept: Spec ID feature table with dependencies/phases; get agreement when created/updated.
- Spec: Spec IDs in headings; Given / When / Then; validation and errors numbered, with an error/message list.
- Architecture: Layers + interfaces spelled out; no god API/data; logging/error format (e.g., `[bon][E1] ...`).
- Plan: Phase checklists; get agreement when the plan is done.
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
