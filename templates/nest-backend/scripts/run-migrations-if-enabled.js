#!/usr/bin/env node

const { execSync } = require('node:child_process');

function shouldSkip() {
  const value = process.env.RUN_MIGRATIONS_ON_BOOT;
  if (!value) {
    return false; // Default: run migrations
  }

  const normalized = value.toString().trim().toLowerCase();
  return ['0', 'false', 'no', 'off', 'skip'].includes(normalized);
}

if (shouldSkip()) {
  console.log(
    'ℹ️  Skipping database migrations because RUN_MIGRATIONS_ON_BOOT is disabled.',
  );
  process.exit(0);
}

try {
  console.log('🚀 Running database migrations (RUN_MIGRATIONS_ON_BOOT enabled).');
  execSync('npm run migration:run', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Database migrations failed:', error.message);
  process.exit(error.status ?? 1);
}

