#!/usr/bin/env node

/**
 * This script deploys all Supabase Edge Functions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the functions directory
const functionsDir = path.join(__dirname, 'supabase', 'functions');

// Check if the directory exists
if (!fs.existsSync(functionsDir)) {
  console.error(`Error: Directory ${functionsDir} does not exist`);
  process.exit(1);
}

// Get all function directories
const functionDirs = fs.readdirSync(functionsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (functionDirs.length === 0) {
  console.error('No function directories found');
  process.exit(1);
}

console.log(`Found ${functionDirs.length} functions to deploy:`);
functionDirs.forEach(dir => console.log(`- ${dir}`));

// Deploy each function
let successCount = 0;
let failCount = 0;

functionDirs.forEach(functionName => {
  try {
    console.log(`\nDeploying ${functionName}...`);
    
    // Execute the deployment command
    execSync(`cd ${path.join(functionsDir, functionName)} && npx supabase functions deploy ${functionName} --no-verify-jwt`, {
      stdio: 'inherit'
    });
    
    console.log(`✅ Successfully deployed ${functionName}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to deploy ${functionName}:`, error.message);
    failCount++;
  }
}

console.log(`\nDeployment complete: ${successCount} succeeded, ${failCount} failed`);
if (failCount > 0) {
  console.log('\nFor failed deployments, try deploying them individually:');
  console.log('npx supabase functions deploy <function-name> --no-verify-jwt');
}

console.log('\nNext steps:');
console.log('1. Configure your Stripe webhook in the Stripe Dashboard');
console.log('2. Set the webhook URL to: https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook');
console.log('3. Add the webhook secret to your Supabase environment variables');