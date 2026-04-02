#!/usr/bin/env node

/**
 * This script checks the deployment status of Supabase Edge Functions
 */

const { execSync } = require('child_process');

console.log('Checking Supabase Edge Function Deployment Status');
console.log('===============================================');

try {
  // List all deployed functions
  const output = execSync('npx supabase functions list', { encoding: 'utf-8' });
  
  console.log('Deployed Functions:');
  console.log(output);
  
  // Check for required functions
  const requiredFunctions = [
    'stripe-checkout',
    'stripe-webhook',
    'verify-payment',
    'generate-secure-export',
    'store-export-data'
  ];
  
  const deployedFunctions = output
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const match = line.match(/^\s*(\S+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);
  
  console.log('\nDeployment Status:');
  
  requiredFunctions.forEach(func => {
    const isDeployed = deployedFunctions.includes(func);
    console.log(`${isDeployed ? '✅' : '❌'} ${func}`);
  });
  
  const missingFunctions = requiredFunctions.filter(func => !deployedFunctions.includes(func));
  
  if (missingFunctions.length > 0) {
    console.log('\nMissing functions:');
    missingFunctions.forEach(func => {
      console.log(`- ${func}`);
    });
    console.log('\nTo deploy missing functions, run:');
    console.log('npm run deploy:functions');
  } else {
    console.log('\nAll required functions are deployed! 🎉');
  }
  
} catch (error) {
  console.error('Error checking deployment status:', error.message);
  console.log('\nMake sure you have the Supabase CLI installed and are logged in.');
  console.log('Run: npm install -g supabase');
  console.log('Then: npx supabase login');
}