#!/usr/bin/env node

const { diff } = require('../src/diff');
const { validate } = require('../src/validate');
const { security } = require('../src/security');
const { generate } = require('../src/generate');

const args = process.argv.slice(2);
const command = args[0];
const flags = args.slice(1);

const VERSION = require('../package.json').version;

const HELP = `
  \x1b[1menv-inspector v${VERSION}\x1b[0m - Analyze, validate, and secure your .env files

  \x1b[1mUsage:\x1b[0m
    env-inspector <command> [options]

  \x1b[1mCommands:\x1b[0m
    diff        Compare .env with .env.example (show missing/extra variables)
    validate    Check variable formats (URL, port, email, etc.)
    security    Detect weak secrets (short passwords, default values)
    generate    Generate a .env template from .env.example

  \x1b[1mOptions:\x1b[0m
    --env <path>        Path to .env file (default: .env)
    --example <path>    Path to .env.example file (default: .env.example)
    --version           Show version number
    --help              Show this help message
`;

function parseFlags(flags) {
  const options = {};
  for (let i = 0; i < flags.length; i++) {
    if (flags[i] === '--env' && flags[i + 1]) {
      options.envPath = flags[++i];
    } else if (flags[i] === '--example' && flags[i + 1]) {
      options.examplePath = flags[++i];
    }
  }
  return options;
}

if (!command || command === '--help') {
  console.log(HELP);
  process.exit(0);
}

if (command === '--version') {
  console.log(`env-inspector v${VERSION}`);
  process.exit(0);
}

const options = parseFlags(flags);

switch (command) {
  case 'diff':
    diff(options);
    break;
  case 'validate':
    validate(options);
    break;
  case 'security':
    security(options);
    break;
  case 'generate':
    generate(options);
    break;
  default:
    console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
    console.log(HELP);
    process.exit(1);
}
