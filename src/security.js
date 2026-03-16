const { parseEnvFile } = require('./parser');

const SECRET_KEYWORDS = [
  'SECRET', 'PASSWORD', 'PASS', 'TOKEN', 'KEY', 'API_KEY',
  'PRIVATE', 'CREDENTIAL', 'AUTH',
];

const WEAK_DEFAULTS = [
  'password', 'secret', 'admin', '123456', 'changeme',
  'test', 'default', 'example', 'xxx', 'abc123',
  'password123', 'letmein', 'welcome', 'monkey', 'master',
];

function isBase64(str) {
  return /^[A-Za-z0-9+/]+=*$/.test(str) && str.length >= 16;
}

function checkSecret(key, value) {
  const issues = [];

  if (!value || value.length === 0) {
    issues.push('Empty value');
    return issues;
  }

  if (WEAK_DEFAULTS.includes(value.toLowerCase())) {
    issues.push(`Common default value "${value}"`);
  }

  if (value.length < 8) {
    issues.push(`Too short (${value.length} chars, minimum 8 recommended)`);
  }

  if (/^(.)\1+$/.test(value)) {
    issues.push('Repeated character pattern');
  }

  if (/^(012|123|234|345|456|567|678|789|abc|qwerty)/i.test(value)) {
    issues.push('Sequential pattern detected');
  }

  return issues;
}

function security(options = {}) {
  const envPath = options.envPath || '.env';
  const vars = parseEnvFile(envPath);

  if (!vars) {
    console.error(`\x1b[31m✗ File not found: ${envPath}\x1b[0m`);
    process.exit(1);
  }

  console.log('\n\x1b[1m🔒 env-inspector security\x1b[0m');
  console.log(`   Scanning \x1b[36m${envPath}\x1b[0m for weak secrets\n`);

  let warnings = 0;
  let scanned = 0;

  for (const [key, value] of Object.entries(vars)) {
    const upper = key.toUpperCase();
    const isSecret = SECRET_KEYWORDS.some(kw => upper.includes(kw));
    if (!isSecret) continue;

    scanned++;
    const issues = checkSecret(key, value);

    if (issues.length > 0) {
      warnings++;
      console.log(`   \x1b[31m✗ ${key}\x1b[0m`);
      for (const issue of issues) {
        console.log(`     └─ ${issue}`);
      }
    } else {
      console.log(`   \x1b[32m✓ ${key}: looks secure\x1b[0m`);
    }
  }

  console.log();

  if (scanned === 0) {
    console.log('   No secret-like variables found to scan.\n');
    return;
  }

  if (warnings > 0) {
    console.log(`   \x1b[31m${warnings} security warning(s) out of ${scanned} secrets scanned.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`   \x1b[32m✓ All ${scanned} secrets look secure.\x1b[0m\n`);
  }
}

module.exports = { security };
