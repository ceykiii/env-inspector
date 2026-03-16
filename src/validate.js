const { parseEnvFile } = require('./parser');

const VALIDATORS = {
  url: {
    test: (v) => /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+/.test(v),
    keywords: ['URL', 'ENDPOINT', 'ORIGIN', 'WEBHOOK', 'CALLBACK', 'REDIRECT'],
    label: 'URL',
  },
  port: {
    test: (v) => /^\d+$/.test(v) && parseInt(v) >= 1 && parseInt(v) <= 65535,
    keywords: ['PORT'],
    label: 'Port (1-65535)',
  },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    keywords: ['EMAIL', 'MAIL_FROM', 'SMTP_USER'],
    label: 'Email',
  },
  boolean: {
    test: (v) => ['true', 'false', '1', '0', 'yes', 'no'].includes(v.toLowerCase()),
    keywords: ['ENABLED', 'DISABLED', 'DEBUG', 'VERBOSE', 'SSL', 'TLS'],
    label: 'Boolean',
  },
  number: {
    test: (v) => /^\d+$/.test(v),
    keywords: ['TIMEOUT', 'RETRY', 'LIMIT', 'SIZE', 'COUNT', 'MAX', 'MIN', 'TTL'],
    label: 'Number',
  },
};

function detectType(key) {
  const upper = key.toUpperCase();
  for (const [type, config] of Object.entries(VALIDATORS)) {
    if (config.keywords.some(kw => upper.includes(kw))) {
      return type;
    }
  }
  return null;
}

function validate(options = {}) {
  const envPath = options.envPath || '.env';
  const vars = parseEnvFile(envPath);

  if (!vars) {
    console.error(`\x1b[31m✗ File not found: ${envPath}\x1b[0m`);
    process.exit(1);
  }

  console.log('\n\x1b[1m🔍 env-inspector validate\x1b[0m');
  console.log(`   Checking \x1b[36m${envPath}\x1b[0m\n`);

  let errors = 0;
  let checked = 0;

  for (const [key, value] of Object.entries(vars)) {
    const type = detectType(key);
    if (!type) continue;

    checked++;
    const validator = VALIDATORS[type];

    if (!value) {
      console.log(`   \x1b[33m⚠ ${key}: empty value (expected ${validator.label})\x1b[0m`);
      errors++;
    } else if (!validator.test(value)) {
      console.log(`   \x1b[31m✗ ${key}: "${value}" is not a valid ${validator.label}\x1b[0m`);
      errors++;
    } else {
      console.log(`   \x1b[32m✓ ${key}: valid ${validator.label}\x1b[0m`);
    }
  }

  if (checked === 0) {
    console.log('   No variables matched known formats to validate.\n');
    return;
  }

  console.log();
  if (errors > 0) {
    console.log(`   \x1b[31m${errors} validation error(s) found.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`   \x1b[32m✓ All ${checked} checked variables are valid.\x1b[0m\n`);
  }
}

module.exports = { validate };
