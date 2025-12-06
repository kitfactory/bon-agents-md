#!/usr/bin/env node

/**
 * bon CLI
 * Creates an AGENTS.md file in the specified directory with a ready-to-edit template.
 */
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const args = process.argv.slice(2);

function printHelp() {
  const help = [
    `bon v${pkg.version}`,
    '',
    'Usage: bon [options]',
    '',
    'Options:',
    '  -d, --dir <path>   Target directory (default: current directory)',
    '  -f, --force        Overwrite an existing AGENTS.md',
    '  -h, --help         Show this help',
    '  -v, --version      Show version'
  ].join('\n');

  console.log(help);
}

function fail(message) {
  console.error(`[bon] ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    dir: process.cwd(),
    force: false
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

function createTemplate(targetName) {
  const name = targetName || 'your project';
  return `# AGENTS for ${name}

Use this file to give agents the context they need to operate safely and effectively.

## Overview
- Project: ${name}
- Owners: <add names and contact points>
- Source of truth: <add links to docs, repos, dashboards>

## Goals
- [ ] Primary objective
- [ ] Secondary objective
- [ ] Definition of done

## Constraints
- Keep data private; do not expose secrets or credentials.
- Prefer concise answers in bullet points when possible.
- Confirm before running destructive or irreversible actions.

## Tools
List the APIs, CLIs, or workflows agents can use. Include auth steps or sample invocations.

## Style Guide
- Tone: concise and direct.
- Surface uncertainties and assumptions explicitly.
- Flag risks early and propose mitigations.

## Examples
| Situation | How the agent should respond |
| --------- | --------------------------- |
| Needs more context | "Before I continue, I need the following details: ..." |
| Task seems risky | "This may be destructive because __. Should I proceed?" |
| Conflicting instructions | "I see conflicting guidance in A and B. Which should I follow?" |
`;
}

function main() {
  const { dir, force } = parseArgs(args);
  const targetDir = path.resolve(dir);
  const targetPath = path.join(targetDir, 'AGENTS.md');

  try {
    fs.mkdirSync(targetDir, { recursive: true });
  } catch (error) {
    fail(`Could not create directory: ${error.message}`);
  }

  if (fs.existsSync(targetPath) && !force) {
    fail(`AGENTS.md already exists at ${targetPath}. Use --force to overwrite.`);
  }

  const template = createTemplate(path.basename(targetDir));

  try {
    fs.writeFileSync(targetPath, template, 'utf8');
  } catch (error) {
    fail(`Failed to write AGENTS.md: ${error.message}`);
  }

  console.log(`[bon] AGENTS.md created at ${targetPath}`);
}

main();
