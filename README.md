# env-inspector

> Analyze, validate, and secure your `.env` files.

[![npm version](https://img.shields.io/npm/v/env-inspector.svg)](https://www.npmjs.com/package/env-inspector)
[![GitHub](https://img.shields.io/github/license/ceykiii/env-inspector)](https://github.com/ceykiii/env-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why?

- Accidentally committing `.env` files
- Missing environment variables causing runtime errors
- Weak secrets and default passwords in production
- No easy way to diff `.env` vs `.env.example`

## Install

```bash
npx env-inspector <command>
```

Or install globally:

```bash
npm install -g env-inspector
```

## Commands

### `diff` - Compare .env files

Shows missing and extra variables between `.env` and `.env.example`.

```bash
env-inspector diff
env-inspector diff --env .env.local --example .env.example
```

### `validate` - Check variable formats

Auto-detects and validates URLs, ports, emails, booleans, and numbers.

```bash
env-inspector validate
env-inspector validate --env .env.production
```

### `security` - Detect weak secrets

Finds common default passwords, short secrets, and sequential patterns.

```bash
env-inspector security
env-inspector security --env .env.production
```

### `generate` - Create .env from template

Generates an empty `.env` file from `.env.example` with all keys and empty values.

```bash
env-inspector generate
env-inspector generate --example .env.template --env .env.local
```

## CI/CD Integration

Add to your pipeline to catch issues early:

```yaml
# GitHub Actions
- name: Check env files
  run: |
    npx env-inspector diff
    npx env-inspector validate
    npx env-inspector security
```

## License

MIT
