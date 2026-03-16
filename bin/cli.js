#!/usr/bin/env node

const { diff } = require('../src/diff');
const { validate } = require('../src/validate');
const { security } = require('../src/security');
const { generate } = require('../src/generate');

const args = process.argv.slice(2);
const command = args[0];
const flags = args.slice(1);

const HELP = `
  env-inspector - Analyze, validate, and secure your .env files

  Usage:
    env-inspector <command> [options]

  Commands:
    diff        Compare .env with .env.example (show missing/extra variables)
    validate    Check variable formats (URL, port, email, etc.)
    security    Detect weak secrets (short passwords, default values)
    generate    Generate a .env template from .env.example

  Options:
    --env <path>        Path to .env file (default: .env)
    --example <path>    Path to .env.example file (default: .env.example)
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
