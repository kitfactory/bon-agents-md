#!/usr/bin/env node

/**
 * bon CLI
 * Creates an AGENTS.md file in the specified directory with a ready-to-edit template.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const pkg = require('../package.json');

const SUPPORTED_LANGS = new Set(['python', 'js', 'javascript', 'ts', 'typescript', 'rust']);
const SUPPORTED_EDITORS = new Set(['codex', 'cursor', 'claudecode', 'copilot']);
const args = process.argv.slice(2);

function printHelp() {
  const help = [
    `bon v${pkg.version}`,
    '',
    'Usage: bon [options]',
    '',
    'Options:',
    '  -d, --dir <path>       Target directory (default: current directory)',
    '  -f, --force            Overwrite an existing AGENTS.md',
    '  --lang <python|js|ts|rust>',
    '                         Programming language (default: python)',
    '  --editor <codex|cursor|claudecode|copilot>',
    '                         Target AI editor (default: codex)',
    '  -h, --help             Show this help',
    '  -v, --version          Show version'
  ].join('\n');

  console.log(help);
}

function fail(message) {
  console.error(`[bon] ${message}`);
  process.exit(1);
}

function normalizeLanguage(value) {
  if (!value) return 'python';
  const normalized = value.toLowerCase();
  if (!SUPPORTED_LANGS.has(normalized)) {
    fail(`Unsupported language: ${value}. Use one of python|js|ts|rust.`);
  }

  if (normalized === 'javascript') return 'js';
  if (normalized === 'typescript') return 'ts';
  return normalized;
}

function normalizeEditor(value) {
  if (!value) return 'codex';
  const normalized = value.toLowerCase();
  if (!SUPPORTED_EDITORS.has(normalized)) {
    fail(`Unsupported editor: ${value}. Use one of codex|cursor|claudecode|copilot.`);
  }
  return normalized;
}

function targetFileName(editor) {
  switch (editor) {
    case 'cursor':
      return '.cursorrules';
    case 'copilot':
      return 'copilot-instructions.md';
    default:
      return 'AGENTS.md';
  }
}

function parseArgs(argv) {
  const options = {
    dir: process.cwd(),
    force: false,
    lang: 'python',
    editor: 'codex'
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    switch (arg) {
      case '-d':
      case '--dir': {
        const next = argv[i + 1];
        if (!next) {
          fail('Missing value for --dir');
        }
        options.dir = path.resolve(options.dir, next);
        i += 1;
        break;
      }
      case '-f':
      case '--force':
        options.force = true;
        break;
      case '--lang': {
        const next = argv[i + 1];
        if (!next) fail('Missing value for --lang');
        options.lang = normalizeLanguage(next);
        i += 1;
        break;
      }
      case '--editor': {
        const next = argv[i + 1];
        if (!next) fail('Missing value for --editor');
        options.editor = normalizeEditor(next);
        i += 1;
        break;
      }
      case '-h':
      case '--help':
        printHelp();
        process.exit(0);
        break;
      case '-v':
      case '--version':
        console.log(`bon v${pkg.version}`);
        process.exit(0);
        break;
      default:
        fail(`Unknown option: ${arg}\nUse --help to see available options.`);
    }
  }

  return options;
}

function isWsl(platform = os.platform(), release = os.release(), env = process.env) {
  if (platform !== 'linux') return false;
  const lowerRelease = release.toLowerCase();
  if (lowerRelease.includes('microsoft')) return true;
  return Boolean(env.WSL_DISTRO_NAME || env.WSL_INTEROP);
}

function readWindowsLocale() {
  // Best-effort: try PowerShell first, then cmd. Fail quietly if unavailable.
  try {
    const ps = spawnSync('powershell.exe', ['-NoLogo', '-NoProfile', '-Command', '[culture]::CurrentUICulture.Name'], {
      encoding: 'utf8',
      timeout: 1500
    });
    if (ps.status === 0 && ps.stdout) {
      return ps.stdout.trim();
    }
  } catch (error) {
    // ignore
  }

  try {
    const cmd = spawnSync('cmd.exe', ['/c', 'echo', '%LANG%'], { encoding: 'utf8', timeout: 1500 });
    if (cmd.status === 0 && cmd.stdout) {
      return cmd.stdout.trim();
    }
  } catch (error) {
    // ignore
  }

  return null;
}

function normalizeLocaleTag(tag) {
  if (!tag) return null;
  const lower = tag.toLowerCase();
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('en')) return 'en';
  return null;
}

function detectLocale(options = {}) {
  const env = options.env || process.env;
  const platform = options.platform || os.platform();
  const release = options.release || os.release();
  const windowsLocaleReader = options.windowsLocaleReader || readWindowsLocale;

  const fromEnv =
    normalizeLocaleTag(env.LANG) ||
    normalizeLocaleTag(env.LC_ALL);

  if (isWsl(platform, release, env)) {
    const winLocale = normalizeLocaleTag(windowsLocaleReader());
    if (winLocale) return winLocale;
  }

  if (fromEnv) return fromEnv;

  const osLocale = normalizeLocaleTag(Intl.DateTimeFormat().resolvedOptions().locale);
  if (osLocale) return osLocale;

  return 'en';
}

function langDisplayName(lang) {
  switch (lang) {
    case 'python':
      return 'Python';
    case 'js':
      return 'JavaScript';
    case 'ts':
      return 'TypeScript';
    case 'rust':
      return 'Rust';
    default:
      return lang;
  }
}

function editorDisplayName(editor) {
  switch (editor) {
    case 'codex':
      return 'Codex';
    case 'cursor':
      return 'Cursor';
    case 'claudecode':
      return 'Claude Code';
    case 'copilot':
      return 'GitHub Copilot';
    default:
      return editor;
  }
}

function languageGuidance(lang, locale) {
  const commonEnvNote =
    locale === 'ja'
      ? '環境変数/`.env` の必要キーと利用箇所を明示し、`.env.sample` は生成しないでください。'
      : 'Call out required env vars/`.env` keys and where they are used; do not generate `.env.sample`.';

  switch (lang) {
    case 'python':
      return locale === 'ja'
        ? [
            '- Python: `uv` + `.venv` 仮想環境、`pytest`、Lint/Format（`ruff`/`black` など）を推奨。',
            `- ${commonEnvNote}`
          ].join('\n')
        : [
            '- Python: recommend `uv` + `.venv`, `pytest`, lint/format (`ruff`/`black`).',
            `- ${commonEnvNote}`
          ].join('\n');
    case 'js':
      return locale === 'ja'
        ? [
            '- JavaScript: Node.js + `pnpm`/`npm`、テスト（Vitest/Jest）、Lint/Format（ESLint/Prettier）。',
            `- ${commonEnvNote}`
          ].join('\n')
        : [
            '- JavaScript: Node.js + `pnpm`/`npm`, testing (Vitest/Jest), lint/format (ESLint/Prettier).',
            `- ${commonEnvNote}`
          ].join('\n');
    case 'ts':
      return locale === 'ja'
        ? [
            '- TypeScript: JS と同様 + `tsc --noEmit` で型チェック。抽象インターフェース経由の DI を推奨。',
            `- ${commonEnvNote}`
          ].join('\n')
        : [
            '- TypeScript: as JS + `tsc --noEmit` for type checking; favor DI through abstract interfaces.',
            `- ${commonEnvNote}`
          ].join('\n');
    case 'rust':
      return locale === 'ja'
        ? [
            '- Rust: `cargo` ワークスペース推奨、`cargo fmt` / `cargo clippy` / `cargo test`、feature flag と実機テスト導線を含める。',
            `- ${commonEnvNote}`
          ].join('\n')
        : [
            '- Rust: recommend `cargo` workspace, `cargo fmt` / `cargo clippy` / `cargo test`; include feature-flag guidance and real-device testing.',
            `- ${commonEnvNote}`
          ].join('\n');
    default:
      return commonEnvNote;
  }
}

function createTemplate({ projectName, language, editor, locale }) {
  const displayLang = langDisplayName(language);
  const displayEditor = editorDisplayName(editor);
  const docsReference =
    locale === 'ja'
      ? 'プロジェクト固有の情報は `docs/`（concept/spec/architecture など）で管理してください。この AGENTS.md 自体には固有情報を書きません。'
      : 'Keep project-specific details in `docs/` (concept/spec/architecture, etc.); do not embed them here.';

  const heading =
    locale === 'ja'
      ? '# AGENTS (共通テンプレート)'
      : '# AGENTS (Shared Template)';

  const intro =
    locale === 'ja'
      ? [
          docsReference,
          '該当ドキュメントが無い場合は `docs/concept.md`, `docs/spec.md`, `docs/architecture.md` を作成してください。',
          '作業前に必ずドキュメントを参照し、機密情報は記載しないでください。'
        ].join('\n')
      : [
          docsReference,
          'If missing, create `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`.',
          'Always read the docs first and avoid placing secrets in this file.'
        ].join('\n');

  const requirements =
    locale === 'ja'
      ? [
          '## 要件定義',
          '- 想定ユーザーと困りごとを明確化',
          '- 必要なユースケース/機能一覧',
          '- 使用するライブラリ',
          '- ソフトウェア全体設計の概要'
        ].join('\n')
      : [
          '## Requirements',
          '- Clarify target users and their pain points',
          '- Enumerate required use cases/features',
          '- List chosen libraries',
          '- Summarize the overall software architecture'
        ].join('\n');

  const specSection =
    locale === 'ja'
      ? [
          '## 仕様記述',
          '- 仕様/要求仕様は 前提/条件/振る舞い で記載する'
        ].join('\n')
      : [
          '## Specifications',
          '- Write specs in Given/When/Then form'
        ].join('\n');

  const design =
    locale === 'ja'
      ? [
          '## 設計',
          '- レイヤー構造と単一責務を徹底する',
          '- 抽象クラスで境界を定義し、DI しやすくする',
          '- ゴッドクラスや雑多なヘルパーは作らず、シンプルなインターフェースを提供する'
        ].join('\n')
      : [
          '## Design',
          '- Keep layered architecture and single responsibility',
          '- Define boundaries with abstract classes for easy DI',
          '- Avoid god objects and grab-bag helpers; expose simple interfaces'
        ].join('\n');

  const testing =
    locale === 'ja'
      ? [
          '## テスト方針',
          '- 機能/レイヤー単位でテストを完成させる',
          '- モックは補助。本番経路（実通信・実接続）が通ったときに完了扱い',
          '- 必要な環境変数・接続情報・`.env` の配置場所と設定例をここに記載（`.env.sample` は生成しない）',
          '- テストが難航したらステップごとにデバッグメッセージを追加する'
        ].join('\n')
      : [
          '## Testing',
          '- Finish tests per feature/layer',
          '- Mocks are auxiliary; completion requires real calls/real connections',
          '- List required env vars, connection info, and `.env` placement/examples here (do not generate `.env.sample`)',
          '- Add step-wise debug logging when tests get stuck'
        ].join('\n');

  const languageSection =
    locale === 'ja'
      ? `## 言語別指針 (${displayLang})\n${languageGuidance(language, locale)}`
      : `## Language Guidance (${displayLang})\n${languageGuidance(language, locale)}`;

  const editorSection =
    locale === 'ja'
      ? `## 対応エディタ\n- ターゲット: ${displayEditor}\n- 他のエディタ指定時は CLI オプション \`--editor\` を使用`
      : `## Target Editor\n- Target: ${displayEditor}\n- Use \`--editor\` to choose another editor`;

  const workSection =
    locale === 'ja'
      ? [
          '## 作業の進め方',
          '- まず `docs/concept.md`, `docs/spec.md`, `docs/architecture.md` を読む（無ければ作成する）',
          '- `docs/plan.md` にチェックリストを置き、項目をチェックしながら進める',
          '- 上記を踏まえて要件定義→仕様→設計→実装→テストの順に進める',
          '- 機密情報を記載しない。必要なら環境変数経由で扱う'
        ].join('\n')
      : [
          '## How to Work',
          '- Read `docs/concept.md`, `docs/spec.md`, `docs/architecture.md` (create them if missing)',
          '- Keep a checklist in `docs/plan.md` and tick items as you go',
          '- Proceed Requirements → Specs → Design → Implementation → Tests',
          '- Do not place secrets here; use env vars instead'
        ].join('\n');

  return [
    heading,
    intro,
    '',
    requirements,
    '',
    specSection,
    '',
    design,
    '',
    testing,
    '',
    languageSection,
    '',
    editorSection,
    '',
    workSection
  ].join('\n');
}

function main() {
  const { dir, force, lang, editor } = parseArgs(args);
  const locale = detectLocale();
  const targetDir = path.resolve(dir);
  const fileName = targetFileName(editor);
  const targetPath = path.join(targetDir, fileName);

  try {
    fs.mkdirSync(targetDir, { recursive: true });
  } catch (error) {
    fail(`Could not create directory: ${error.message}`);
  }

  if (fs.existsSync(targetPath) && !force) {
    fail(`AGENTS.md already exists at ${targetPath}. Use --force to overwrite.`);
  }

  const template = createTemplate({
    projectName: path.basename(targetDir) || 'project',
    language: lang,
    editor,
    locale
  });

  try {
    fs.writeFileSync(targetPath, template, 'utf8');
  } catch (error) {
    fail(`Failed to write AGENTS.md: ${error.message}`);
  }

  console.log(`[bon] ${fileName} created at ${targetPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  detectLocale,
  createTemplate,
  isWsl,
  normalizeLanguage,
  normalizeEditor,
  targetFileName,
  languageGuidance,
  readWindowsLocale
};
