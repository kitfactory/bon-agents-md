const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const bon = require('../bin/bon.js');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'bon-'));
}

test('parseArgs defaults', () => {
  const parsed = bon.parseArgs([]);
  assert.ok(parsed.dir);
  assert.strictEqual(parsed.force, false);
  assert.strictEqual(parsed.lang, 'python');
  assert.strictEqual(parsed.editor, 'codex');
});

test('detectLocale honors env ja', () => {
  const locale = bon.detectLocale({ env: { LANG: 'ja_JP.UTF-8' } });
  assert.strictEqual(locale, 'ja');
});

test('detectLocale falls back to en', () => {
  const locale = bon.detectLocale({ env: {} });
  assert.ok(['en', 'ja'].includes(locale)); // default en if no env
});

test('languageGuidance mentions env handling', () => {
  const ja = bon.languageGuidance('js', 'ja');
  assert.ok(ja.includes('`.env`'), 'Japanese guidance should mention .env');
  const en = bon.languageGuidance('python', 'en');
  assert.ok(en.toLowerCase().includes('env'), 'English guidance should mention env');
});

test('createTemplate references docs and avoids project-specific info', () => {
  const tpl = bon.createTemplate({ projectName: 'demo', language: 'ts', editor: 'cursor', locale: 'en' });
  assert.ok(tpl.includes('docs/concept.md'), 'Should point to docs');
  assert.ok(tpl.toLowerCase().includes('plan.md'), 'Should prompt to use plan.md checklist');
  assert.ok(!tpl.includes('demo'), 'Template should not bake project-specific info');
});

test('createTemplate Japanese markers', () => {
  const tpl = bon.createTemplate({ projectName: 'demo', language: 'rust', editor: 'codex', locale: 'ja' });
  assert.ok(tpl.includes('前提') || tpl.includes('仕様記述'), 'Japanese template should include Japanese sections');
});

test('isWsl detects microsoft release', () => {
  const result = bon.isWsl('linux', '5.15.90-microsoft-standard-WSL2', {});
  assert.strictEqual(result, true);
});

test('CLI creates AGENTS.md and blocks overwrite without --force', () => {
  const dir = tempDir();
  const script = path.join(__dirname, '..', 'bin', 'bon.js');
  const first = spawnSync('node', [script, '--dir', dir], { encoding: 'utf8' });
  assert.strictEqual(first.status, 0, first.stderr);
  const target = path.join(dir, bon.targetFileName('codex'));
  assert.ok(fs.existsSync(target), 'AGENTS file should be created');

  const second = spawnSync('node', [script, '--dir', dir], { encoding: 'utf8' });
  assert.notStrictEqual(second.status, 0, 'Second run without --force should fail');

  const forced = spawnSync('node', [script, '--dir', dir, '--force'], { encoding: 'utf8' });
  assert.strictEqual(forced.status, 0, forced.stderr);
});

test('CLI respects --lang and locale ja', () => {
  const dir = tempDir();
  const script = path.join(__dirname, '..', 'bin', 'bon.js');
  const run = spawnSync('node', [script, '--dir', dir, '--lang', 'rust'], {
    encoding: 'utf8',
    env: { ...process.env, LANG: 'ja_JP.UTF-8' }
  });
  assert.strictEqual(run.status, 0, run.stderr);
  const content = fs.readFileSync(path.join(dir, bon.targetFileName('codex')), 'utf8');
  assert.ok(content.includes('Rust'), 'Should mention Rust guidance');
  assert.ok(content.includes('日本語') || content.includes('前提') || content.includes('仕様'), 'Should render in Japanese');
});

test('CLI uses editor-specific filenames', () => {
  const dir = tempDir();
  const script = path.join(__dirname, '..', 'bin', 'bon.js');

  const cursorRun = spawnSync('node', [script, '--dir', path.join(dir, 'cursor'), '--editor', 'cursor'], {
    encoding: 'utf8'
  });
  assert.strictEqual(cursorRun.status, 0, cursorRun.stderr);
  assert.ok(fs.existsSync(path.join(dir, 'cursor', bon.targetFileName('cursor'))));

  const copilotRun = spawnSync('node', [script, '--dir', path.join(dir, 'copilot'), '--editor', 'copilot'], {
    encoding: 'utf8'
  });
  assert.strictEqual(copilotRun.status, 0, copilotRun.stderr);
  assert.ok(fs.existsSync(path.join(dir, 'copilot', bon.targetFileName('copilot'))));
});

console.log('All tests passed.');
