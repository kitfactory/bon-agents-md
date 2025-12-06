# bon-agents-md

Create an `AGENTS.md` in any directory with a single `bon` command. Generates a shared template that points to `docs/` for project details (no project-specific info is embedded).

## Install

```bash
npm install -g bon-agents-md
```

Requires Node.js 16+.

## Usage

```bash
bon                # create AGENTS.md in the current directory
bon --dir path/to  # create inside the specified directory (creates it if missing)
bon --force        # overwrite an existing AGENTS.md
bon --lang ts       # generate TypeScript-oriented guidance (default: python)
bon --editor cursor # target a specific AI editor (default: codex)
bon --help         # show help
```

## Behavior
- Locale: auto-detects terminal language (user > `LANG`/`LC_ALL` > OS; WSL prefers Windows language). Falls back to English.
- Language: `--lang` supports `python` (default) / `js` / `ts` / `rust`.
- Editor: `--editor` supports `codex` (default) / `cursor` / `claudecode` / `copilot`.
- Output filename: codex/claudecode -> `AGENTS.md`, cursor -> `.cursorrules`, copilot -> `copilot-instructions.md`.
- Overwrite: blocks if the target file exists unless `--force` is passed.
- `.env`: does not generate `.env.sample`; AGENTS.md tells you which env vars/keys are needed and where they’re used.

## Template contents
- Requirements: users, pain points, use cases/features, chosen libraries, system design overview.
- Specifications: Given/When/Then (or 前提/条件/振る舞い for Japanese).
- Design: layered + single responsibility, abstract boundaries for DI, avoid god classes/helpers.
- Testing: per feature/layer; mocks are auxiliary—completion requires real calls/connections. List required env vars/`.env` placement/examples.
- Docs-first: instructs agents to read `docs/concept.md`, `docs/spec.md`, `docs/architecture.md` instead of embedding project-specific details here.

## Development
- Tests: `npm test`
