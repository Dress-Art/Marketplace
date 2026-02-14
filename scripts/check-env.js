#!/usr/bin/env node

/**
 * Script to verify environment variables configuration
 * Run with: node scripts/check-env.js
 */

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const optionalVars = [
  'FEDAPAY_API_KEY',
  'FEDAPAY_ENVIRONMENT',
  'FEDAPAY_WEBHOOK_SECRET',
  'FEDAPAY_CALLBACK_URL',
  'NEXT_PUBLIC_SITE_URL',
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('✅ Required Variables:');
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName}: MISSING (CRITICAL)`);
    hasErrors = true;
  } else {
    const preview = varName.includes('KEY') || varName.includes('SECRET')
      ? value.substring(0, 10) + '...'
      : value;
    console.log(`  ✓ ${varName}: ${preview}`);
  }
});

console.log('\n⚠️  Optional Variables:');
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ⚠ ${varName}: NOT SET`);
    hasWarnings = true;
  } else {
    const preview = varName.includes('KEY') || varName.includes('SECRET')
      ? value.substring(0, 10) + '...'
      : value;
    console.log(`  ✓ ${varName}: ${preview}`);
  }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ CRITICAL: Missing required environment variables!');
  console.log('The application will NOT work without these variables.');
  console.log('\nPlease check:');
  console.log('  1. Create a .env.local file based on env.example');
  console.log('  2. Add all SUPABASE_* variables from your Supabase project');
  console.log('  3. Restart your development server');
  console.log('\nSee DEPLOYMENT.md for detailed instructions.\n');
  process.exit(1);
}

if (hasWarnings) {
  console.log('\n⚠️  WARNING: Some optional variables are missing.');
  console.log('Payment features will run in DEV MODE.');
  console.log('\nTo enable payments:');
  console.log('  1. Sign up at https://fedapay.com');
  console.log('  2. Add FEDAPAY_* variables to .env.local');
  console.log('  3. Restart your development server');
  console.log('\nSee PAYMENT_SETUP.md for detailed instructions.\n');
}

if (!hasErrors && !hasWarnings) {
  console.log('\n✅ All environment variables are properly configured!');
  console.log('You can now run the application.\n');
}

console.log('='.repeat(60) + '\n');
