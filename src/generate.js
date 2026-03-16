const fs = require('fs');
const path = require('path');
const { parseEnvFile } = require('./parser');

function generate(options = {}) {
  const examplePath = options.examplePath || '.env.example';
  const outputPath = options.envPath || '.env';

  const resolved = path.resolve(examplePath);
  if (!fs.existsSync(resolved)) {
    console.error(`\x1b[31m✗ File not found: ${examplePath}\x1b[0m`);
    process.exit(1);
  }

  const outputResolved = path.resolve(outputPath);
  if (fs.existsSync(outputResolved)) {
    console.error(`\x1b[31m✗ ${outputPath} already exists. Remove it first or use a different path.\x1b[0m`);
    process.exit(1);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const lines = content.split('\n');
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Preserve comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) {
      output.push(line);
      continue;
    }

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      output.push(line);
      continue;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    output.push(`${key}=`);
  }

  fs.writeFileSync(outputResolved, output.join('\n'), 'utf-8');

  const vars = parseEnvFile(examplePath);
  const count = vars ? Object.keys(vars).length : 0;

  console.log('\n\x1b[1m📝 env-inspector generate\x1b[0m');
  console.log(`   Generated \x1b[36m${outputPath}\x1b[0m from \x1b[36m${examplePath}\x1b[0m`);
  console.log(`   \x1b[32m✓ ${count} variables ready to fill in.\x1b[0m\n`);
}

module.exports = { generate };
