const { parseEnvFile } = require('./parser');

function diff(options = {}) {
  const envPath = options.envPath || '.env';
  const examplePath = options.examplePath || '.env.example';

  const envVars = parseEnvFile(envPath);
  const exampleVars = parseEnvFile(examplePath);

  if (!envVars) {
    console.error(`\x1b[31m✗ File not found: ${envPath}\x1b[0m`);
    process.exit(1);
  }
  if (!exampleVars) {
    console.error(`\x1b[31m✗ File not found: ${examplePath}\x1b[0m`);
    process.exit(1);
  }

  const envKeys = Object.keys(envVars);
  const exampleKeys = Object.keys(exampleVars);

  const missing = exampleKeys.filter(k => !envKeys.includes(k));
  const extra = envKeys.filter(k => !exampleKeys.includes(k));

  console.log('\n\x1b[1m📋 env-inspector diff\x1b[0m');
  console.log(`   Comparing \x1b[36m${envPath}\x1b[0m with \x1b[36m${examplePath}\x1b[0m\n`);

  if (missing.length === 0 && extra.length === 0) {
    console.log('   \x1b[32m✓ Files are in sync! No missing or extra variables.\x1b[0m\n');
    return;
  }

  if (missing.length > 0) {
    console.log(`   \x1b[31m✗ Missing in ${envPath} (${missing.length}):\x1b[0m`);
    for (const key of missing) {
      const hint = exampleVars[key] ? ` (example: ${exampleVars[key]})` : '';
      console.log(`     - ${key}${hint}`);
    }
    console.log();
  }

  if (extra.length > 0) {
    console.log(`   \x1b[33m⚠ Extra in ${envPath} (${extra.length}):\x1b[0m`);
    for (const key of extra) {
      console.log(`     - ${key}`);
    }
    console.log();
  }

  if (missing.length > 0) {
    process.exit(1);
  }
}

module.exports = { diff };
