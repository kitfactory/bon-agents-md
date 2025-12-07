# bon-agents-md ⚡️

`bon` creates an AGENTS.md-style guide for AI assistants in one command. The template is intentionally lightweight, points to your `docs/` folder for project-specific details, and encodes how to write concept/spec/architecture/plan so AI outputs stay aligned—without over-generating or baking in project-specific info. Use it to start fast, keep humans in the loop, and avoid “AI slop.” One command, and the lane markers for the whole project light up. 🚦

## Why bon? 🌈

| You want… | bon gives you… |
| --- | --- |
| High-quality concept/spec/architecture/plan | Guardrails to write them consistently and keep them linked by Spec IDs |
| Specs that are unambiguous | Given/When/Then with Spec IDs in headings and numbered error behaviors |
| Architecture with AI-ready know-how | Layer responsibilities + key interfaces + “no god APIs/data” baked in |
| Fast examples to anchor outputs | Success/failure snippets with Error IDs that match real messages |
| Editor-friendly outputs | Auto-picks `AGENTS.md` / `.cursorrules` / `copilot-instructions.md` for codex/cursor/claudecode/copilot |

## Install

```bash
npm install -g bon-agents-md
```

Requires Node.js 16+.

## Quick start

```bash
bon                    # create AGENTS.md (locale auto-detected)
bon --dir path/to      # choose target directory (creates it)
bon --force            # overwrite if it exists
bon --lang ts          # language guidance: python|js|ts|rust (default: python)
bon --editor cursor    # editor target: codex|cursor|claudecode|copilot (default: codex)
bon --help             # usage
bon --version          # show version
```

## What the template enforces 🎯
- Locale aware: detects `LANG`/`LC_ALL`/OS (WSL prefers Windows). Japanese/English text is emitted accordingly.
- Docs-first: AGENTS.md stays generic; project specifics live in `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`.
- Concept: feature table with Spec IDs, dependencies, MVP/phases. User approval is required when concept is created/updated.
- Spec: chapters per feature group, numbered Given/When/Then with matching Spec IDs. Input validation and error behavior are numbered; errors/messages are kept in a dedicated list.
- Architecture: layer responsibilities, dependencies, key interfaces spelled out; forbid god APIs/data (minimal arguments/fields only). Logging/error conventions (e.g., `[bon][E1] ...`) are defined; non-functionals aren’t over-constrained.
- Plan: checklist per phase; secure user agreement when the plan is ready.
- Samples/snippets: include one success and one failure example with Error IDs, matching implementation text exactly.
- `.env`: never generates `.env.sample`; AGENTS.md tells you required env keys and where they’re used.

## Document-by-document highlights (with sample snippets) 📚
- Concept (`docs/concept.md`): Feature table with Spec IDs and dependencies. Example row: `F2 | Template generation | outputs AGENTS.md/.cursorrules/... | Phase1 | depends on F1`.
- Spec (`docs/spec.md`): Spec IDs mirrored in headings, Given/When/Then style. Example title: `4.1 [F2] When --dir is set, create directories recursively`.
- Architecture (`docs/architecture.md`): Lists layers + key interfaces; forbids god APIs/data. Log/error format sample: `[bon][E2] Unsupported editor: ...`.
- Plan (`docs/plan.md`): Phase checklist, requires user approval when the plan is ready.
- Samples inside AGENTS: success `bon --dir ./project --lang ts --editor cursor` → `.cursorrules`; failure `bon --editor unknown` → `[bon][E2] Unsupported editor: ...`.

## Output targets
- codex/claudecode: `AGENTS.md`
- cursor: `.cursorrules`
- copilot: `copilot-instructions.md`

## Why this structure ✨
- Traces concept → spec → architecture → plan via Spec IDs and approvals, so AI and humans stay on the same page.
- Bilingual-ready: if AGENTS is Japanese, docs stay Japanese and comments are bilingual—no guessing.
- Guardrails against bloat: lean APIs/data, fixed error formats, no project secrets, and `.env.sample` is never generated.
- Fast onboarding: tiny success/failure snippets anchor expectations; editors/files are auto-targeted per tool.
- Human-friendly: concept/plan require explicit user approval, keeping control with the team while AI handles the boilerplate.

## Development
- Tests: `npm test`
